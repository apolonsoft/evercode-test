import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountEntity } from './entities/account.entity'
import { AddressEntity } from './entities/address.entity'
import { CoinEntity } from './entities/coin.entity'
import { TransactionEntity } from './entities/transaction.entity'
import { TransactionService } from './transactions-service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountEntity,
            AddressEntity, 
            TransactionEntity,
            CoinEntity
        ]),
    ],
    providers:[TransactionService]
})
export class WalletsModule { }
