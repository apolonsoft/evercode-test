import { ObjectType, Field } from '@nestjs/graphql'
import { TransactionEntity } from '../entities/transaction.entity'
import { Transaction } from './transaction.type'

@ObjectType()
export class TransactionsConnection {
    @Field(() => [Transaction])
    nodes: TransactionEntity[]

    @Field(() => String, { nullable: true })
    cursor?: string
}
