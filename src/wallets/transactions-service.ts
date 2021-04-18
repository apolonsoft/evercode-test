import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionEntity } from './entities/transaction.entity'
import { In, Repository, UpdateResult } from 'typeorm'
import { TransactionStatus } from './enums/transaction-status.enum'
import { TransactionsConnection } from './types/transactions-connection.type'
import { Blockchain } from './enums/blockchain.enum'
import { Token } from './enums/token.enum'

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionEntity: Repository<TransactionEntity>,
    ) { }

    async saveTransactions(transactions): Promise<any> {
        return this.transactionEntity.save(transactions)
    }

    async getTransactionsByAddresses(
        addresses: string[],
        blockchain: Blockchain,
        statusList: TransactionStatus[] = [
            TransactionStatus.CONFIRMED,
            TransactionStatus.FAILED,
            TransactionStatus.PENDING,
            TransactionStatus.UNCONFIRMED,
        ],
    ): Promise<any[]> {

        return this.transactionEntity.find({
            where: {
                status: In(statusList),
                address: In(addresses),
                blockchain: blockchain,
            },
            order: { createdAt: 'DESC' },
        })

    }

    async deleteOrphanTransactions(
        blockNumber,
        blockchain: Blockchain,
    ): Promise<UpdateResult> {
        return this.transactionEntity
            .createQueryBuilder('transactions')
            .update()
            .set({ status: TransactionStatus.ORPHANED })
            .where('height >= :height', { height: blockNumber })
            .andWhere('blockchain = :blockchain', { blockchain: blockchain })
            .execute()
    }

    async getUnconfirmedTransactions(blockchain: Blockchain): Promise<any[]> {

        return this.transactionEntity.find({
            where: {
                status: TransactionStatus.UNCONFIRMED,
            },
            order: { height: 'ASC' },
        })
    }

    async getTransactionsByAddressesPaginated(
        addresses: string[],
        first: number,
        after: string,
        blockchain: Blockchain,
        token: Token,
    ): Promise<TransactionsConnection> {
        let transactions: any[] = await this.getTransactionsByAddresses(
            addresses,
            blockchain,
        )
        if (token) {
            transactions = transactions.filter(tx => tx.currency === token)
        }
        if (!transactions) {
            return { nodes: [], cursor: '' }
        }

        if (after) {
            //after = JSON.parse(after).id
            const index = transactions.findIndex(({ id }) => id === after)
            if (index === -1) {
                transactions = []
            } else {
                transactions = transactions.slice(index + 1)
            }
        }

        const transactionsCount: number = transactions.length
        let cursor = ''

        if (transactionsCount > first) {
            transactions = transactions.slice(0, first)
            cursor = transactions[transactions.length - 1].id
        }

        return {
            nodes: transactions,
            cursor: cursor,
        }
    }
}