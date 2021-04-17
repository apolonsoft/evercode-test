import { Entity, Column, PrimaryColumn } from 'typeorm'
import { BigNumber } from 'bignumber.js'
import { BigNumberFieldTransformer } from './bignumber-field.transformer'
import { Blockchain } from '../enums/blockchain.enum'

@Entity('coins')
export class CoinEntity {
    @PrimaryColumn('text')
    id: string

    @Column({
        type: 'enum',
        enum: Blockchain,
    })
    blockchain: Blockchain

    @Column('text', { nullable: true })
    address?: string

    @Column('text', { transformer: new BigNumberFieldTransformer() })
    value: BigNumber

    @Column('int')
    mintIndex: number

    @Column('text')
    mintTxid: string

    @Column('int', { nullable: true })
    mintHeight?: number

    @Column('text', { nullable: true })
    spentTxid?: string

    @Column('int', { nullable: true })
    spentHeight?: number
}
