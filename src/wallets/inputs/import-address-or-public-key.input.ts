import { InputType, Field } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { Blockchain } from '../enums/blockchain.enum'

@InputType()
export class ImportAddressOrPublicKeyInput {
    @Field(() => String)
    uuid: string

    @Field(() => Blockchain)
    blockchain: Blockchain

    @Field(() => String, { nullable: true })
    @Transform((address: string) =>
        address.startsWith('0x') ? address.toLowerCase() : address,
    )
    address?: string

    @Field(() => String, { nullable: true })
    publicKey?: string
}
