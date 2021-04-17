import { registerEnumType } from '@nestjs/graphql';

export enum Blockchain {
  ETH = 'ETH'
}

registerEnumType(Blockchain, {
  name: 'Blockchain',
});
