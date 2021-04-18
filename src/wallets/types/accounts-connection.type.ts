import { ObjectType, Field } from '@nestjs/graphql'
import { Account } from './account.type'

@ObjectType()
export class AccountsConnection {
    @Field(() => [Account])
    nodes: Account[]

    @Field(() => String, { nullable: true })
    cursor?: string
}
