import { registerEnumType } from '@nestjs/graphql'

export enum DirectionType {
    INCOMING,
    OUTGOING,
    TRANSFER,
}

registerEnumType(DirectionType, { name: 'DirectionType' })
