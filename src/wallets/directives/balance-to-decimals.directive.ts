import { SchemaDirectiveVisitor } from 'apollo-server'
import { defaultFieldResolver, GraphQLField } from 'graphql'
import { BigNumber } from 'bignumber.js'

export class BalanceToDecimalsDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>): any {
        const { decimals } = this.args
        const { resolve = defaultFieldResolver } = field
        field.resolve = async function(...args): Promise<any> {
            const result = await resolve.apply(this, args)
            if (typeof result === 'object') {
                return {
                    balance: result.balance.dividedBy(
                        new BigNumber('10').pow(decimals),
                    ),
                    incoming: result.incoming.dividedBy(
                        new BigNumber('10').pow(decimals),
                    ),
                    outgoing: result.outgoing.dividedBy(
                        new BigNumber('10').pow(decimals),
                    ),
                }
            }
            return result
        }
    }
}
