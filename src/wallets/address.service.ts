import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Blockchain } from './enums/blockchain.enum'
import { AddressEntity } from './entities/address.entity'
import { TransactionService } from './transaction.service'
import { AddressType } from './enums/address-type.enum'
import { AddressesConnection } from './types/addresses-connection.type'
import { EthereumBalance } from './types/ethereum-balance.type'
import { TransactionStatus } from './enums/transaction-status.enum'
import { CommonService } from './common.service'
import { Token } from './enums/token.enum'
import { DirectionType } from './enums/direction-type.enum'

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>,
        private readonly transactionService: TransactionService,
        private readonly commonService: CommonService
    ) {}

    async getAddress(
        address: string,
        blockchain: Blockchain,
    ): Promise<AddressEntity> {
        return this.addressRepository.findOne({
            where: { address: address, blockchain: blockchain },
        })
    }

    async getAddresses(
        addresses: string[] = [],
        blockchain: Blockchain,
    ): Promise<AddressEntity[]> {
        return this.addressRepository.find({
            where: [
                {
                    address: In(addresses),
                    blockchain: blockchain,
                },
            ],
        })
    }

    async saveAddresses(addresses: AddressEntity[]): Promise<AddressEntity[]> {
        return this.addressRepository.save(addresses)
    }

    async getUsedAddressesCount(
        type: AddressType,
        accountId: string,
    ): Promise<number> {
        return (
            await this.addressRepository.find({
                where: {
                    accountId: accountId,
                    isUsed: true,
                    type: type,
                },
            })
        ).length
    }

    async getAddressesListByAccount(accountId: string): Promise<string[]> {
        return (await this.getAddressesByAccount(accountId)).map(
            address => address.address,
        )
    }

    async getAddressesByAccount(accountId: string): Promise<AddressEntity[]> {
        return this.addressRepository.find({
            where: { accountId: accountId },
            order: { createdAt: 'ASC' },
        })
    }

    async getAddressesByAccountPaginated(
        accountId: string,
        first: number,
        after: string,
    ): Promise<AddressesConnection> {
        let addresses: AddressEntity[] = await this.getAddressesByAccount(
            accountId,
        )

        if (after) {
            //after = JSON.parse(after).address
            const index = addresses.findIndex(
                ({ address }) => address === after,
            )
            if (index === -1) {
                addresses = []
            } else {
                addresses = addresses.slice(index + 1)
            }
        }

        const addressesCount: number = addresses.length
        let cursor = ''

        if (addressesCount > first) {
            addresses = addresses.slice(0, first)
            cursor = addresses[addresses.length - 1].address
        }

        return {
            nodes: addresses,
            cursor: cursor,
        }
    }

    async updateAddressBalancesAndSave(
        addressEntity: AddressEntity,
        blockchain: Blockchain,
    ): Promise<AddressEntity> {
        const balance: EthereumBalance = new EthereumBalance()

        const transactions = await this.transactionService.getTransactionsByAddresses(
            [addressEntity.address],
            blockchain,
        )

        for (const transaction of transactions) {
            if (transaction.status === TransactionStatus.CONFIRMED) {
                balance[Token[transaction.currency]].balance = balance[
                    Token[transaction.currency]
                ].balance.plus(
                    this.commonService.calculateBalanceDif(transaction),
                )
                balance.ETHEREUM.balance = balance.ETHEREUM.balance.minus(
                    transaction.fee,
                )
            } else if (transaction.status === TransactionStatus.FAILED) {
                balance.ETHEREUM.balance = balance.ETHEREUM.balance.minus(
                    transaction.fee,
                )
            } else {
                switch (transaction.direction) {
                    case DirectionType.INCOMING: {
                        balance[Token[transaction.currency]].incoming = balance[
                            Token[transaction.currency]
                        ].incoming.plus(transaction.sum)
                        break
                    }

                    case DirectionType.OUTGOING: {
                        balance[Token[transaction.currency]].outgoing = balance[
                            Token[transaction.currency]
                        ].outgoing.minus(transaction.sum)
                        balance.ETHEREUM.outgoing = balance.ETHEREUM.outgoing.minus(
                            transaction.fee,
                        )
                        break
                    }

                    default: {
                        balance[Token[transaction.currency]].outgoing = balance[
                            Token[transaction.currency]
                        ].outgoing.minus(transaction.sum)
                        balance[Token[transaction.currency]].incoming = balance[
                            Token[transaction.currency]
                        ].incoming.plus(transaction.sum)
                        balance.ETHEREUM.outgoing = balance.ETHEREUM.outgoing.minus(
                            transaction.fee,
                        )
                    }
                }
            }
        }
        addressEntity.balance.ETHEREUM = balance
        return this.addressRepository.save(addressEntity)
    }
   
}
