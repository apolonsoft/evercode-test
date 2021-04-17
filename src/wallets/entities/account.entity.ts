import { Entity, Column, PrimaryColumn } from 'typeorm'
import { CommonBalanceTransformer } from './common-balance.transformer'
import { CommonBalance } from '../types/common-balance.type'
import { Blockchain } from '../enums/blockchain.enum'

@Entity('accounts')
export class AccountEntity {
    @Column('text')
    id: string

    @PrimaryColumn({
        type: 'enum',
        enum: Blockchain,
    })
    blockchain: Blockchain

    @Column('text')
    userId: string

    @PrimaryColumn('text')
    masterPubKey: string

    @Column('json', { transformer: new CommonBalanceTransformer() })
    totalBalance: CommonBalance

    @Column('timestamp')
    createdAt: Date
}
