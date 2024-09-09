import { NestFactory } from '@nestjs/core';
import { KafkaOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RuleModule } from './rule.module';

async function bootstrap() {
  const app = await NestFactory.create(RuleModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'rule-engine',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'rule-engine-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();
