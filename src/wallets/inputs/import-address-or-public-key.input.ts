import { InputType, Field } from '@nestjs/graphql'
import { Transform, TransformFnParams } from 'class-transformer'
import { Blockchain } from '../enums/blockchain.enum'

@InputType()
export class ImportAddressOrPublicKeyInput {
    @Field(() => String)
    uuid: string

    @Field(() => Blockchain)
    blockchain: Blockchain

    @Field(() => String, { nullable: true })
    @Transform((address: TransformFnParams) =>
        address.value.startsWith('0x') ? address.value.toLowerCase() : address.value,
    )
    address?: string

    @Field(() => String, { nullable: true })
    publicKey?: string
}
