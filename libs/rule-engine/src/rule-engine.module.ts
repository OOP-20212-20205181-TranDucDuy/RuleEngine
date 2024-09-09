import { Module } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';
import { Visitor } from './visitor';
import { RuleApplyMiddleware } from './rule-chain.middleware';

@Module({
  imports: [ClientsModule.register([
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
      host: 'localhost', 
      port: 6379, 
      ttl: 600 * 60 * 60, 
    }),
  ],
  providers: [RuleEngineService,Visitor,RuleApplyMiddleware],
  exports: [RuleEngineService],
})
export class RuleEngineModule {}
