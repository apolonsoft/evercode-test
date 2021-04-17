import { Entity, Column, PrimaryColumn } from 'typeorm'
import { CommonBalanceTransformer } from './common-balance.transformer'
import { CommonBalance } from '../types/common-balance.type'
import { AddressType } from '../enums/address-type.enum'
import { Blockchain } from '../enums/blockchain.enum'

@Entity('addresses')
export class AddressEntity {
    @PrimaryColumn('text')
    id: string

    @Column('text')
    address: string

    @Column({
        type: 'enum',
        enum: Blockchain,
    })
    blockchain: Blockchain

    @Column('text')
    accountId: string

    @Column('json', { transformer: new CommonBalanceTransformer() })
    balance: CommonBalance

    @Column('boolean')
    isUsed: boolean

    @Column({
        type: 'enum',
        enum: AddressType,
    })
    type: AddressType

    @Column('timestamp')
    createdAt: Date
}
