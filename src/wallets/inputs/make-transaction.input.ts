import { InputType, Field } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { BigNumber } from 'bignumber.js'
import { BigNumberScalar } from '../scalars/big-number.scalar'
import { FeeLevel } from './../enums/fee-level.enum'
import { Token } from '../enums/token.enum'
import { Blockchain } from '../enums/blockchain.enum'

@InputType()
export class MakeTransactionInput {
    @Field(() => String)
    uuid: string

    @Field(() => Blockchain)
    blockchain: Blockchain

    @Field(() => String, { nullable: true })
    fromAccount?: string

    @Field(() => String, { nullable: true })
    @Transform(fromAddress =>
        fromAddress.value.startsWith('0x') ? fromAddress.value.toLowerCase() : fromAddress.value,
    )
    fromAddress?: string

    @Field(() => String)
    @Transform(toAddress =>
        toAddress.value.startsWith('0x') ? toAddress.value.toLowerCase() : toAddress.value,
    )
    toAddress: string

    @Field(() => BigNumberScalar)
    amount: BigNumber

    @Field(() => FeeLevel, { nullable: true })
    feeLevel?: FeeLevel

    @Field(() => Token, { nullable: true })
    token?: Token

    @Field(() => String, { nullable: true })
    memo?: string
}
