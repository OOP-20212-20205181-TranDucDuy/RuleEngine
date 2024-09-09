import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { RuleEngineService } from './rule-engine.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class RuleApplyMiddleware implements NestMiddleware {
   constructor(
        private readonly ruleEngineService: RuleEngineService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache 
   ) {}
   private readonly logger = new Logger(RuleApplyMiddleware.name);
   async use(req: Request, res: Response, next: NextFunction) {
      next();
      // do some tasks
      const cachedData = await this.cacheManager.get('rule-engine');
      this.logger.log(`~ ~ calling rule engine ~ ~ `);
      if (cachedData) {
        this.logger.log(`~ ~ cachedData ~ ~ ${cachedData}`); // Return cached data if available
      }
      next();
   }
}