import { ValueTransformer } from 'typeorm'
import { BigNumber } from 'bignumber.js'

export class BigNumberFieldTransformer implements ValueTransformer {
    to(value): string {
        //console.log('incoming tx TO db...');
        //console.log(value.toString());
        return value.toString(10)
    }

    from(value): BigNumber {
        //console.log('outgoing tx FROM db...');
        //console.log(new BigNumber(value));
        return new BigNumber(value)
    }
}
