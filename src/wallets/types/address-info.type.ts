import { ObjectType, Field } from '@nestjs/graphql'
import { AddressType } from '../enums/address-type.enum'
import { CommonBalance } from './common-balance.type'

@ObjectType()
export class AddressInfo {
    @Field(() => String)
    address: string

    @Field(() => CommonBalance)
    balance: CommonBalance

    @Field(() => Boolean)
    isUsed: boolean

    @Field(() => AddressType)
    type: AddressType
}
