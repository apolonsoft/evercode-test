import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountEntity } from './entities/account.entity'
import { AddressService } from './address.service'
import { AccountsInput } from './inputs/accounts.input'
import { AccountsConnection } from './types/accounts-connection.type'
import { Blockchain } from './enums/blockchain.enum'
import { EthereumBalance } from './types/ethereum-balance.type'

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountEntity)
        private readonly accountRepository: Repository<AccountEntity>,
        private readonly addressService: AddressService,
    ) {}

    async getAccounts(userId: string): Promise<AccountEntity[]> {
        return this.accountRepository.find({
            where: { userId: userId },
            order: { createdAt: 'ASC' },
        })
    }

    async saveAccount(account: AccountEntity): Promise<AccountEntity> {
        return this.accountRepository.save(account)
    }

    async getAccountById(id: string): Promise<AccountEntity> {
        return this.accountRepository.findOne({ id: id })
    }

    async getAccountByPublicKey(
        masterPubKey: string,
        blockchain: Blockchain,
    ): Promise<AccountEntity> {
        return this.accountRepository.findOne({
            masterPubKey: masterPubKey,
            blockchain: blockchain,
        })
    }

    async getAccountsByUser(userId: string): Promise<AccountEntity[]> {
        return this.accountRepository.find({
            where: { userId: userId },
            order: { createdAt: 'ASC' },
        })
    }

    async getPaginatedAccounts(
        input: AccountsInput,
        userId: string,
    ): Promise<AccountsConnection> {
        const { first, after } = input

        let accounts: AccountEntity[] = await this.getAccountsByUser(userId)
        //let accounts: AccountEntity[] = await this.accountRepository.find(); // temporary show all accounts

        if (after) {
            //const afterDecoded = JSON.parse(after).id
            const index = accounts.findIndex(({ id }) => id === after)
            if (index === -1) {
                accounts = []
            } else {
                accounts = accounts.slice(index + 1)
            }
        }

        const accountsCount: number = accounts.length
        let cursor = ''

        if (accountsCount > first) {
            accounts = accounts.slice(0, first)
            cursor = accounts[accounts.length - 1].id
        }

        return {
            nodes: accounts,
            cursor: cursor,
        }
    }

    async updateEthereumAccountBalancesAndSave(
        account: AccountEntity,
    ): Promise<AccountEntity> {
        let balance: EthereumBalance = new EthereumBalance()
        const addresses = await this.addressService.getAddressesByAccount(
            account.id,
        )
        
        account.totalBalance.ETHEREUM = balance
        return this.accountRepository.save(account)
    }

    
}
