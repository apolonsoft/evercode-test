import { ObjectType, Field } from '@nestjs/graphql'
import { BigNumber } from 'bignumber.js'
import { BigNumberScalar } from '../scalars/big-number.scalar'

@ObjectType()
export class Balance {
    @Field(() => BigNumberScalar)
    balance: BigNumber = new BigNumber('0')

    @Field(() => BigNumberScalar)
    incoming: BigNumber = new BigNumber('0')

    @Field(() => BigNumberScalar)
    outgoing: BigNumber = new BigNumber('0')
}
