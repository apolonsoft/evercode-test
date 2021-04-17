import { ObjectType, Field, Directive } from '@nestjs/graphql'
import { Balance } from './balance.type'

@ObjectType()
export class EthereumBalance {
    @Directive('@format(decimals:18)')
    @Field(() => Balance)
    ETHEREUM: Balance = new Balance()
}
