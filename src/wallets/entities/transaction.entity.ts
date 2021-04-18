import { Entity, Column } from 'typeorm'
import { BigNumber } from 'bignumber.js'
import { DirectionType } from '../enums/direction-type.enum'
import { BigNumberFieldTransformer } from './bignumber-field.transformer'
import { TransactionStatus } from '../enums/transaction-status.enum'
import { Token } from '../enums/token.enum'
import {  PrimaryColumn } from 'typeorm/index'
import { Blockchain } from '../enums/blockchain.enum'

@Entity('transactions')
export class TransactionEntity {
    @Column('text')
    id: string

    @Column({
        type: 'enum',
        enum: Blockchain,
    })
    blockchain: Blockchain

    @Column({
        type: 'enum',
        enum: Token,
        nullable: true,
    })
    currency?: Token

    @Column('text', { nullable: true })
    memo?: string

    @PrimaryColumn('text')
    txId: string

    @PrimaryColumn('text')
    address: string

    @Column('json')
    to: string[]

    @Column('json')
    from: string[]

    @Column('int', { nullable: true })
    height: number

    @Column({
        type: 'enum',
        enum: DirectionType,
    })
    direction: DirectionType

    @Column('text', { transformer: new BigNumberFieldTransformer() })
    sum: BigNumber

    @Column('text', { transformer: new BigNumberFieldTransformer() })
    fee: BigNumber

    @Column('text', { transformer: new BigNumberFieldTransformer() })
    systemFee: BigNumber

    @Column({
        type: 'enum',
        enum: TransactionStatus,
    })
    status: TransactionStatus

    @Column('timestamp', { nullable: true })
    blockTimestamp: Date

    @Column('timestamp')
    createdAt: Date

    confirmations?: number

    
}
