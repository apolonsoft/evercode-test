import { ObjectType, Field } from '@nestjs/graphql'
import { BigNumber } from 'bignumber.js'
import { BigNumberScalar } from '../scalars/big-number.scalar'

@ObjectType()
export class UnsignedTransactionOutput {
    @Field(() => String, { nullable: true })
    address: string

    @Field(() => BigNumberScalar, { nullable: true })
    amount: BigNumber
}
