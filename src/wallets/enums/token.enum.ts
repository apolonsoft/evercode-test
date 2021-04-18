import { registerEnumType } from '@nestjs/graphql'

export enum Token {
    ETH = 'ETH'
}

registerEnumType(Token, { name: 'Token' })
