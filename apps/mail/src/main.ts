import { NestFactory } from '@nestjs/core';
import {
  Transport,
} from '@nestjs/microservices';
import { MailModule } from './mail.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MailModule, {
    name: 'MAIL_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'mail-consumer',
      },
    },
  });
  await app.listen();
}

bootstrap();
