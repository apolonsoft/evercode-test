import { registerEnumType } from '@nestjs/graphql'

export enum TransactionStatus {
    PENDING,
    UNCONFIRMED,
    CONFIRMED,
    FAILED,
    ORPHANED,
}

registerEnumType(TransactionStatus, { name: 'TransactionStatus' })
