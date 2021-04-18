import { registerEnumType } from '@nestjs/graphql'

export enum FeeLevel {
    MINIMAL,
    OPTIMAL,
    MAXIMAL,
}

registerEnumType(FeeLevel, { name: 'FeeLevel' })
