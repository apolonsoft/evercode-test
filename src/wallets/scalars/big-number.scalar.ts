import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind } from 'graphql'
import { BigNumber } from 'bignumber.js'
import { NotFoundException } from '@nestjs/common'

@Scalar('BigNumber')
export class BigNumberScalar implements CustomScalar<string, BigNumber> {
    parseValue(value: string): BigNumber {
        //return new BigNumber(value).multipliedBy(new BigNumber('10').pow(18));
        return new BigNumber(value)
    }

    serialize(value: BigNumber): string {
        //value = value.dividedBy(new BigNumber('10').pow(18));
        return value.toString(10)
    }

    parseLiteral(ast: any): BigNumber {
        if (ast.kind === Kind.STRING) {
            //return new BigNumber(ast.value).multipliedBy(new BigNumber('10').pow(18));
            return new BigNumber(ast.value)
        }
        throw new NotFoundException(
            'input value must be BigNumber in form of String!',
        )
    }
}
