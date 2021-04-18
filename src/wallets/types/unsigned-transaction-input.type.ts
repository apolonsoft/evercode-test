import { ObjectType, Field, Int } from '@nestjs/graphql'
import { BigNumber } from 'bignumber.js'
import { BigNumberScalar } from '../scalars/big-number.scalar'

@ObjectType()
export class UnsignedTransactionInput {
    @Field(() => String, { nullable: true })
    txId?: string

    @Field(() => String, { nullable: true })
    hex?: string

    @Field(() => Int, { nullable: true })
    n?: number

    @Field(() => BigNumberScalar, { nullable: true })
    sum?: BigNumber

    @Field(() => String)
    address: string

    @Field(() => String, { nullable: true })
    type?: string

    @Field(() => String, { nullable: true })
    scriptPubKeyHex?: string

    @Field(() => String, { nullable: true })
    json?: string
}
