import { ObjectType, Field, Int, ID } from '@nestjs/graphql'
import { AddressWithAmount } from './address-with-amount.type'
import { DirectionType } from '../enums/direction-type.enum'
import { TransactionStatus } from '../enums/transaction-status.enum'
import { BigNumber } from 'bignumber.js'
import { Token } from '../enums/token.enum'
import { BigNumberScalar } from '../scalars/big-number.scalar'
import { Blockchain } from '../enums/blockchain.enum'

@ObjectType()
export class Transaction {
    @Field(() => ID)
    id: string

    @Field(() => Blockchain, { nullable: true })
    blockchain?: Blockchain

    @Field(() => String)
    txId: string

    @Field(() => String)
    address: string

    @Field(() => String, { nullable: true })
    memo?: string

    @Field(() => Token, { nullable: true })
    currency?: Token

    @Field(() => Int, { nullable: true })
    height: number

    @Field(() => Int)
    confirmations: number

    @Field(() => Int)
    confirmationsRequired: number

    @Field(() => DirectionType)
    direction: DirectionType

    @Field(() => [AddressWithAmount])
    from: AddressWithAmount[]

    @Field(() => [AddressWithAmount], { nullable: true })
    to: AddressWithAmount[]

    @Field(() => BigNumberScalar)
    sum: BigNumber

    @Field(() => BigNumberScalar)
    fee: BigNumber

    @Field(() => BigNumberScalar)
    systemFee: BigNumber

    @Field(() => TransactionStatus)
    status: TransactionStatus

    @Field(() => Date, { nullable: true })
    blockTimestamp: Date

    @Field(() => Date)
    createdAt: Date
}
