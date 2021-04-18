import { registerEnumType } from '@nestjs/graphql';

export enum Network {
  MAINNET = 'MAINNET',
  TESTNET = 'TESTNET',
  REGTEST = 'REGTEST',
}

registerEnumType(Network, {
  name: 'Network',
});
