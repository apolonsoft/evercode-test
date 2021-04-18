import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { Account } from './types/account.type'
import { ImportAddressOrPublicKeyInput } from './inputs/import-address-or-public-key.input'
import { MakeTransactionInput } from './inputs/make-transaction.input'
import { TransactionForSign } from './types/transaction-for-sign.type'
import { EthereumService } from './ethereum.service'

@Resolver('Wallet')
export class WalletResolver {
    constructor(private readonly ethereumService: EthereumService) {}

    @Mutation(() => Account)
    async importAddressesOrPublicKey(
        @Args('input') input: ImportAddressOrPublicKeyInput,
    ): Promise<Account> {
        const userId = ''
        return this.ethereumService.importAddressesOrPublicKey(input, userId)
    }

    @Mutation(() => TransactionForSign)
    async makeTransaction(
        @Args('input') input: MakeTransactionInput,
    ): Promise<TransactionForSign> {
        return this.ethereumService.makeTransaction(input)
    }
}
