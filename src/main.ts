import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppEventsService } from './app.events'
import { Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'

const logger = new Logger('WalletInstance')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const { emitter } = app.get(AppEventsService)
  emitter.on('initialisationCompleted', () => {
    if (process.env.RMQ_URLS) {
      app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
          urls: JSON.parse(process.env.RMQ_URLS),
          queue: 'wallet',
          noAck: false,
          prefetchCount: 1,
          isGlobalPrefetchCount: true,
          queueOptions: {
            durable: true,
          },
        },
      })
    }
    app.startAllMicroservices()
  })

  await app.listen(process.env.PORT, process.env.HOST, () =>
    logger.log(`Listening on ${process.env.HOST}:${process.env.PORT}`),
  )
}
bootstrap();
