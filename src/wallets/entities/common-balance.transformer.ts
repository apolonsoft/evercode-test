import { ValueTransformer } from 'typeorm'
import { BigNumber } from 'bignumber.js'
import { CommonBalance } from '../types/common-balance.type'
import { EthereumBalance } from '../types/ethereum-balance.type'

export class CommonBalanceTransformer implements ValueTransformer {
    to(value: CommonBalance): string {
        //console.log('starting transform TO db...');
        //console.log('incoming object', value);
        const stringObject = {
            ETHEREUM: {
                ETHEREUM: {
                    balance: value.ETHEREUM.ETHEREUM.balance.toString(10),
                    incoming: value.ETHEREUM.ETHEREUM.incoming.toString(10),
                    outgoing: value.ETHEREUM.ETHEREUM.outgoing.toString(10),
                },
            },
           
        }
        //console.log('written to db: ', JSON.stringify(stringObject));
        return JSON.stringify(stringObject)
    }

    from(value: string): EthereumBalance {
        //console.log('starting transform FROM db...');
        const obj = JSON.parse(value)
        //console.log('outgoing object', obj);
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue
            }
            for (const innerKey in obj[key]) {
                if (!obj[key].hasOwnProperty(innerKey)) {
                    continue
                }
                obj[key][innerKey].balance = new BigNumber(
                    obj[key][innerKey].balance,
                )
                obj[key][innerKey].incoming = new BigNumber(
                    obj[key][innerKey].incoming,
                )
                obj[key][innerKey].outgoing = new BigNumber(
                    obj[key][innerKey].outgoing,
                )
            }
        }
        //console.log('read from db', obj);
        return obj
    }
}
