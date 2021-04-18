import {

    Injectable,

} from '@nestjs/common'
import { BigNumber } from 'bignumber.js'
import { EthereumBalance } from './types/ethereum-balance.type'
import { TransactionStatus } from './enums/transaction-status.enum'
import { FeeLevel } from './enums/fee-level.enum'
import { TransactionEntity } from './entities/transaction.entity'

@Injectable()
export class CommonService {

    sumEthereumBalances(
        a: EthereumBalance,
        b: EthereumBalance,
    ): EthereumBalance {
        const c: EthereumBalance = new EthereumBalance()
        for (const key in a) {
            if (!a.hasOwnProperty(key)) {
                continue
            }
            for (const innerKey in a[key]) {
                if (!a[key].hasOwnProperty(innerKey)) {
                    continue
                }
                c[key][innerKey] = a[key][innerKey].plus(b[key][innerKey])
            }
        }
        return c
    }

    sumBalanceAndOutgoingBalance(balance: EthereumBalance): EthereumBalance {
        const result: EthereumBalance = new EthereumBalance()
        for (const key in balance) {
            if (!balance.hasOwnProperty(key)) {
                continue
            }
            result[key].balance = balance[key].balance.plus(
                balance[key].outgoing,
            )
        }
        return result
    }

    calculateBalanceDif(transaction: TransactionEntity): BigNumber {
        if (
            transaction.from[0] === transaction.to[0] ||
            transaction.status === TransactionStatus.FAILED
        ) {
            return new BigNumber('0')
        }
        if (transaction.to[0] === transaction.address) {
            return transaction.sum
        }
        return new BigNumber('0').minus(transaction.sum)
    }

    async getGasPrice(feeLevel: FeeLevel): Promise<BigNumber> {
        //const fees = await this.dbService.getFeeEstimates();
        switch (feeLevel) {
            case FeeLevel.OPTIMAL:
                return new BigNumber('20000000000') //Math.round(fees.optimal);
            case FeeLevel.MINIMAL:
                return new BigNumber('1') //Math.round(fees.minimal);
            default:
                return new BigNumber('200000000000') //Math.round(fees.maximal);
        }
    }
}
