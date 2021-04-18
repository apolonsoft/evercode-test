import {
    Injectable, OnModuleInit,
} from '@nestjs/common'
import { Blockchain } from './enums/blockchain.enum';
import { EthereumService } from './ethereum.service'
import { v4 } from 'uuid'
@Injectable()
export class WalletService implements OnModuleInit {
    constructor(private readonly ethereumService: EthereumService) {

    }
    async onModuleInit(): Promise<void> {
        const addresses = [
            '0xDCBb4268bd301DC08BD2c055358456E4e7aBea51',
            '0x31d05C37a25d5d7D324D80cfdde790f5E3C4391f',
            '0x1f6A6e688a413F56bf839588560E645625564fc0',
            '0x0385824f0e57F42815f41d78368520154c9BA6Df'
        ]

        await Promise.all(addresses.map(async address => {
            await this.ethereumService.importAddressesOrPublicKey({
                blockchain: Blockchain.ETH,
                uuid: v4(),
                address
            }, '')
        }));
    }
}