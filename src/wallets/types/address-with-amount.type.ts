import { ObjectType, Field } from '@nestjs/graphql'
import { BigNumber } from 'bignumber.js'
import { BigNumberScalar } from '../scalars/big-number.scalar'

@ObjectType()
export class AddressWithAmount {
    @Field(() => String)
    txId: string

    @Field(() => [String])
    address: string[]

    @Field(() => BigNumberScalar)
    amount: BigNumber
}
