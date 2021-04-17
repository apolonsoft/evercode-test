import { registerEnumType } from '@nestjs/graphql'

export enum Token {
    ETHEREUM = 'ETHEREUM'
}

registerEnumType(Token, { name: 'Token' })
