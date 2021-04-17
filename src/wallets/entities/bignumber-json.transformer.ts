import { ValueTransformer } from 'typeorm'
import { BigNumber } from 'bignumber.js'
import { EthereumBalance } from '../types/ethereum-balance.type'

export class BigNumberJsonTransformer implements ValueTransformer {
    to(value: EthereumBalance): string {
        //console.log('starting transform TO db...');
        const stringObject = {
            // ETHEREUM: value.ETHEREUM.toFixed(),
        }
        //console.log('written to db: ', JSON.stringify(stringObject));
        return JSON.stringify(stringObject)
    }

    from(value: string): EthereumBalance {
        //console.log('starting transform FROM db...');
        const obj = JSON.parse(value)
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue
            }
            obj[key] = new BigNumber(obj[key])
        }
        //console.log('read from db', obj);
        return obj
    }
}
