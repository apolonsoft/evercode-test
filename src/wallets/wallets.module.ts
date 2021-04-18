import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountService } from './account.service';
import { AddressService } from './address.service';
import { CommonService } from './common.service';
import { AccountEntity } from './entities/account.entity'
import { AddressEntity } from './entities/address.entity'
import { TransactionEntity } from './entities/transaction.entity'
import { EthereumService } from './ethereum.service';
import { TransactionService } from './transaction.service';
import { WalletResolver } from './wallet.resolver'
import { WalletService } from './wallet.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountEntity,
            AddressEntity,
            TransactionEntity,
        ]),
    ],
    providers: [TransactionService, AccountService, CommonService, WalletService,
        AddressService, EthereumService, WalletResolver]
})
export class WalletsModule { }
