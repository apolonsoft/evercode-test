import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Blockchain } from './enums/blockchain.enum'
import { AddressEntity } from './entities/address.entity'
import { TransactionService } from './transaction.service'
import { AddressType } from './enums/address-type.enum'
import { AddressesConnection } from './types/addresses-connection.type'

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>,
        private readonly transactionService: TransactionService,
    ) {}

    async getAddress(
        address: string,
        blockchain: Blockchain,
    ): Promise<AddressEntity> {
        return this.addressRepository.findOne({
            where: { address: address, blockchain: blockchain },
        })
    }

    async getAddresses(
        addresses: string[] = [],
        blockchain: Blockchain,
    ): Promise<AddressEntity[]> {
        return this.addressRepository.find({
            where: [
                {
                    address: In(addresses),
                    blockchain: blockchain,
                },
            ],
        })
    }

    async saveAddresses(addresses: AddressEntity[]): Promise<AddressEntity[]> {
        return this.addressRepository.save(addresses)
    }

    async getUsedAddressesCount(
        type: AddressType,
        accountId: string,
    ): Promise<number> {
        return (
            await this.addressRepository.find({
                where: {
                    accountId: accountId,
                    isUsed: true,
                    type: type,
                },
            })
        ).length
    }

    async getAddressesListByAccount(accountId: string): Promise<string[]> {
        return (await this.getAddressesByAccount(accountId)).map(
            address => address.address,
        )
    }

    async getAddressesByAccount(accountId: string): Promise<AddressEntity[]> {
        return this.addressRepository.find({
            where: { accountId: accountId },
            order: { createdAt: 'ASC' },
        })
    }

    async getAddressesByAccountPaginated(
        accountId: string,
        first: number,
        after: string,
    ): Promise<AddressesConnection> {
        let addresses: AddressEntity[] = await this.getAddressesByAccount(
            accountId,
        )

        if (after) {
            //after = JSON.parse(after).address
            const index = addresses.findIndex(
                ({ address }) => address === after,
            )
            if (index === -1) {
                addresses = []
            } else {
                addresses = addresses.slice(index + 1)
            }
        }

        const addressesCount: number = addresses.length
        let cursor = ''

        if (addressesCount > first) {
            addresses = addresses.slice(0, first)
            cursor = addresses[addresses.length - 1].address
        }

        return {
            nodes: addresses,
            cursor: cursor,
        }
    }

   
}
