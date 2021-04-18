import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitter } from 'events'
import { NestEmitterModule } from 'nest-emitter/nest-emitter.module'
import { AppEventsService } from './app.events'
import { WalletsModule } from './wallets/wallets.module';
import { BigNumberScalar } from './wallets/scalars/big-number.scalar';
import { GraphQLFederationModule } from '@nestjs/graphql'
import { BalanceToDecimalsDirective } from './wallets/directives/balance-to-decimals.directive';
@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: 'schema.gql',
      schemaDirectives: {
        format: BalanceToDecimalsDirective
      },
    }),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    NestEmitterModule.forRoot(new EventEmitter()),
    AppEventsService,
    WalletsModule,
  ],
  providers: [
    BigNumberScalar
  ],
})
export class AppModule { }
