import { registerEnumType } from '@nestjs/graphql'

export enum AddressType {
    EXTERNAL,
    CHANGE,
}

registerEnumType(AddressType, { name: 'AddressType' })
