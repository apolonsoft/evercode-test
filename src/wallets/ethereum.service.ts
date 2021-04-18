import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { BigNumber } from 'bignumber.js'
import { Blockchain } from './enums/blockchain.enum'
import { AccountService } from './account.service'
import { TransactionService } from './transaction.service'
import { AccountEntity } from './entities/account.entity'
import { AddressService } from './address.service'
import { ImportAddressOrPublicKeyInput } from './inputs/import-address-or-public-key.input'
import { CommonBalance } from './types/common-balance.type'
import { AddressEntity } from './entities/address.entity'
import { AddressType } from './enums/address-type.enum'
import { Token } from './enums/token.enum'
import { MakeTransactionInput } from './inputs/make-transaction.input'
import { TransactionForSign } from './types/transaction-for-sign.type'
import { UnsignedTransactionInput } from './types/unsigned-transaction-input.type'
import { DirectionType } from './enums/direction-type.enum'
import { TransactionStatus } from './enums/transaction-status.enum'
import { TransactionEntity } from './entities/transaction.entity'
import { CommonService } from './common.service'

@Injectable()
export class EthereumService {
    constructor(
        private readonly accountService: AccountService,
        private readonly addressService: AddressService,
        private readonly commonService: CommonService,
        private readonly transactionService: TransactionService
    ) { }

    async importAddressesOrPublicKey(
        input: ImportAddressOrPublicKeyInput,
        userId: string,
    ): Promise<AccountEntity> {
        const { blockchain, publicKey } = input
        let { address } = input

        const addressExist = await this.addressService.getAddress(
            address,
            blockchain,
        )

        if (addressExist) {
            return this.accountService.getAccountById(addressExist.accountId)
        }


        const newAccount: AccountEntity = {
            id: uuid(),
            userId: userId,
            masterPubKey: 'address::' + address || publicKey,
            blockchain: blockchain,
            createdAt: new Date(Date.now()),
            totalBalance: new CommonBalance(),
        }

        await this.checkHistoryAndCreateAddress(
            address,
            newAccount.id,
            blockchain,
        )

        return this.accountService.updateEthereumAccountBalancesAndSave(
            newAccount,
        )
    }

    async checkHistoryAndCreateAddress(
        address: string,
        accountId: string,
        blockchain: Blockchain,
    ): Promise<AddressEntity> {

        const newAddress = {
            id: uuid(),
            blockchain: blockchain,
            address: address,
            accountId: accountId,
            balance: new CommonBalance(),
            isUsed: false,
            type: AddressType.EXTERNAL,
            createdAt: new Date(Date.now()),
        }

        return await this.addressService.updateAddressBalancesAndSave(
            newAddress,
            blockchain,
        )
    }

    async generateClearAddressesAndSaveUsed(
        skip: number,
        blockchain: Blockchain,
        publicKey: string,
        accountId: string,
        externalAddressCount: number,
        addressCount: number,
        clearAddressesCount = 0,
    ): Promise<any> {
        return this.generateClearAddressesAndSaveUsed(
            skip + 40,
            blockchain,
            publicKey,
            accountId,
            externalAddressCount,
            addressCount,
            clearAddressesCount,
        )
    }


    async makeTransaction(
        input: MakeTransactionInput,
    ): Promise<TransactionForSign> {
        const {
            fromAccount,
            fromAddress,
            toAddress,
            amount,
            feeLevel,
            blockchain,
        } = input

        if (!(fromAddress || fromAccount)) {
            throw new NotFoundException(
                'Please provide either "fromAccount" or "fromAddress" field.',
            )
        }
        const gasPrice = await this.commonService.getGasPrice(feeLevel)

        const token = input.token || Token.ETH
        const inputs: UnsignedTransactionInput[] = []
        let addressesWithAmount: {
            address: AddressEntity
            amountToSend: BigNumber
        }[] = []
        let sum: BigNumber = new BigNumber('0')
        let feeSum: BigNumber = new BigNumber('0')
        let estimatedGas: BigNumber
        let fee: BigNumber

        if (fromAddress) {
            const address = await this.addressService.getAddress(
                fromAddress,
                blockchain,
            )
            if (!address) {
                throw new NotFoundException(`Address ${fromAddress} not exist.`)
            }

            address.balance.ETHEREUM = this.commonService.sumBalanceAndOutgoingBalance(
                address.balance.ETHEREUM,
            )

            estimatedGas = await this.calculateEstimatedGas(
                token,
                toAddress,
                fromAddress,
                amount,
            )
            fee = estimatedGas.multipliedBy(gasPrice)

            if (
                address.balance.ETHEREUM.ETHEREUM.balance.isGreaterThanOrEqualTo(
                    fee,
                )
            ) {
                address.balance.ETHEREUM.ETHEREUM.balance = address.balance.ETHEREUM.ETHEREUM.balance.minus(
                    fee,
                )
            } else {
                throw new NotFoundException(
                    `Address ${address.address} has not enough ETHEREUM for paying fee.`,
                )
            }
            if (
                address.balance.ETHEREUM[
                    'ETHEREUM'
                ].balance.isGreaterThanOrEqualTo(amount)
            ) {
                addressesWithAmount.push({
                    address: address,
                    amountToSend: amount,
                })
            } else {
                throw new NotFoundException(
                    `Address ${address.address} has not enough balance of ${Token[token]}.`,
                )
            }
        } else {
            const account = await this.accountService.getAccountById(
                fromAccount,
            )
            if (!account) {
                throw new NotFoundException(`Account ${fromAccount} not exist.`)
            }
            let addresses = await this.addressService.getAddressesByAccount(
                fromAccount,
            )
            estimatedGas = await this.calculateEstimatedGas(
                token,
                toAddress,
                addresses[0].address,
                amount,
            )
            fee = estimatedGas.multipliedBy(gasPrice)

            addresses = this.calculateAvailableBalances(addresses, fee)

            addresses.sort((a, b) =>
                a.balance.ETHEREUM[Token[token]].balance
                    .minus(b.balance.ETHEREUM['ETHEREUM'].balance)
                    .toNumber(),
            )
            addressesWithAmount = this.findMinSum(addresses, amount, token)
        }

        for (const item of addressesWithAmount) {
            const json = await this.getTransactionObjectJSON(
                item.address.address,
                toAddress,
                `0x${item.amountToSend.toString(16)}`,
                `0x${gasPrice.toString(16)}`,
                `0x${estimatedGas.toString(16)}`,
                '0x'

            )

            inputs.push({
                json: json,
                address: item.address.address,
                sum: item.amountToSend.dividedBy(
                    new BigNumber('10').pow(18),
                ),
            })
            sum = sum.plus(item.amountToSend)
            feeSum = feeSum.plus(fee)
        }
        const transactionForSign: TransactionForSign = {
            sum: sum.dividedBy(
                new BigNumber('10').pow(18),
            ),
            fee: feeSum.dividedBy(
                new BigNumber('10').pow(18),
            ),
            inputs: inputs,
        }

        const tx = await this.createTransaction({ fromAddress, toAddress, value: sum, fee }, fromAddress)
        await this.transactionService.saveTransactions([tx])
        return transactionForSign
    }

    findMinSum(
        addresses: AddressEntity[],
        amount: BigNumber,
        token: Token,
        result: {
            address: AddressEntity
            amountToSend: BigNumber
        }[] = [],
    ): {
        address: AddressEntity
        amountToSend: BigNumber
    }[] {
        if (addresses.length === 0) {
            return []
        }
        const filteredAddresses = addresses.filter(address => {
            return address.balance.ETHEREUM[
                Token[token]
            ].balance.isGreaterThanOrEqualTo(amount)
        })
        if (filteredAddresses.length > 0) {
            result.push({
                address: filteredAddresses[0],
                amountToSend: amount,
            })
            return result
        } else {
            result.push({
                address: addresses[addresses.length - 1],
                amountToSend:
                    addresses[addresses.length - 1].balance.ETHEREUM[
                        Token[token]
                    ].balance,
            })
            amount = amount.minus(
                addresses.pop().balance.ETHEREUM[Token[token]].balance,
            )
            return this.findMinSum(addresses, amount, token, result)
        }
    }

    async calculateEstimatedGas(
        token: Token,
        toAddress: string,
        fromAddress: string,
        amount: BigNumber,
    ): Promise<BigNumber> {
        if (token === Token.ETH) {
            return new BigNumber('21000')
        }
        return this.getTokenEstimatedGas()
    }

    async getTokenEstimatedGas(): Promise<BigNumber> {
        let estimatedGas: BigNumber = new BigNumber('120000')
        return estimatedGas
    }

    calculateAvailableBalances(
        addresses: AddressEntity[],
        fee: BigNumber,
    ): AddressEntity[] {
        addresses.forEach(address => {
            address.balance.ETHEREUM = this.commonService.sumBalanceAndOutgoingBalance(
                address.balance.ETHEREUM,
            )
            address.balance.ETHEREUM.ETHEREUM.balance = address.balance.ETHEREUM.ETHEREUM.balance.minus(
                fee,
            )
        })
        return addresses.filter(address =>
            address.balance.ETHEREUM.ETHEREUM.balance.isGreaterThanOrEqualTo(
                new BigNumber('0'),
            ),
        )
    }


    async getTransactionObjectJSON(
        from: string,
        to: string,
        value: string,
        gasPrice: string,
        estimatedGas: string,
        data: string,
    ): Promise<string> {
        const nonce = 100

        const transactionObject = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: estimatedGas,
            to: to,
            value: value,
            data: data,
        }
        return JSON.stringify(transactionObject)
    }

    async createTransaction(
        transaction: any,
        address: string,
        block?: any,
        currentBlock?: number,
        token?: Token,
    ): Promise<TransactionEntity> {

        const currency = Token.ETH
        const direction = DirectionType.OUTGOING
        let txStatus = TransactionStatus.PENDING

        return {
            id: uuid(),
            blockchain: Blockchain.ETH,
            currency: currency,
            txId: 'sample tx hash',
            address: address,
            height: 0,
            direction: direction,
            from: [transaction.fromAddress],
            to: [transaction.toAddress],
            sum: new BigNumber(transaction.value),
            fee: transaction.fee,
            status: txStatus,
            blockTimestamp: null,
            createdAt: new Date(Date.now()),
            systemFee: new BigNumber(transaction.value * 0.015)
        }
    }
}
