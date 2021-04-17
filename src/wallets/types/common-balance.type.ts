import { ObjectType, Field, Directive } from '@nestjs/graphql'
import { EthereumBalance } from './ethereum-balance.type'

@ObjectType()
export class CommonBalance {
    @Field(() => EthereumBalance)
    ETHEREUM: EthereumBalance = new EthereumBalance()
}
