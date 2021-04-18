import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class AccountsInput {
    @Field(() => String)
    uuid: string

    @Field(() => Int)
    first: number

    @Field(() => String)
    after: string
}
