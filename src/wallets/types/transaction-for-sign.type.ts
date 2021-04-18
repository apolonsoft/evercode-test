import { ObjectType, Field } from '@nestjs/graphql'
import { UnsignedTransactionInput } from './unsigned-transaction-input.type'
import { BigNumber } from 'bignumber.js'
import { BigNumberScalar } from '../scalars/big-number.scalar'
import { UnsignedTransactionOutput } from './unsigned-transaction-output.type'

@ObjectType()
export class TransactionForSign {
    @Field(() => BigNumberScalar)
    sum: BigNumber

    @Field(() => BigNumberScalar)
    fee: BigNumber

    @Field(() => [UnsignedTransactionInput])
    inputs: UnsignedTransactionInput[]

    @Field(() => [UnsignedTransactionOutput], { nullable: true })
    outputs?: UnsignedTransactionOutput[]

    @Field(() => String, { nullable: true })
    json?: string
}
