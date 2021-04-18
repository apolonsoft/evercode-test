import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Blockchain } from '../enums/blockchain.enum'
import { CommonBalance } from './common-balance.type'

@ObjectType()
export class Account {
    @Field(() => ID)
    id: string

    @Field(() => Blockchain)
    blockchain: Blockchain

    @Field(() => Date)
    createdAt: Date

    @Field(() => CommonBalance)
    totalBalance: CommonBalance

    @Field(() => String, { nullable: true })
    masterPubKey: string
}
