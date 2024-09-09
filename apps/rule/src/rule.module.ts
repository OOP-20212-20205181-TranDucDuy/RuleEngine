import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { Visitor } from './visitor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleSchema } from './entities/rule.entity';
import { RuleEngineModule } from '@app/rule-engine';
@Module({
  imports: [RuleEngineModule,
    ClientsModule.register([
    {
      name: 'MAIL_SERVICE',
      transport: Transport.KAFKA  ,
      options: {
        client: {
          clientId: 'mail',
          brokers: ['localhost:9092'],
        },
        producerOnlyMode: true,
        consumer: {
          groupId: 'mail-consumer',
        }
      }
    },
    ]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Redis host (change if necessary)
      port: 6379, // Redis port (default is 6379)
      ttl: 600 * 60 * 60, // Cache time-to-live in seconds (optional)
    }),
    MongooseModule.forRoot('mongodb://root:1@localhost:27018/rule?authSource=admin'),
    MongooseModule.forFeature([{ name: 'rule', schema: RuleSchema }]),

  ],
  controllers: [RuleController],
  providers: [RuleService , Visitor],
})
export class RuleModule {}
