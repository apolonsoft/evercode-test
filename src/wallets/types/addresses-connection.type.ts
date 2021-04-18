import { ObjectType, Field } from '@nestjs/graphql'
import { AddressInfo } from './address-info.type'
import { AddressEntity } from '../../wallet/entities/address.entity'

@ObjectType()
export class AddressesConnection {
    @Field(() => [AddressInfo])
    nodes: AddressEntity[]

    @Field(() => String, { nullable: true })
    cursor?: string
}
