import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Parser } from 'acorn';
import { Cache } from 'cache-manager';
import { IRuleChain, IStatus, IPublishMessageStatement, IIfElseStatement, IStatement, ICallApiStatement, ISwitchCaseStatement, ISendMailStatement, ISetRedisStatement, IVariableDeclaration, EStatement } from './interfaces/rule-chain.interface';
import { ClientKafka } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Visitor } from './visitor';
import { InjectModel } from '@nestjs/mongoose';
import { Rule } from './entities/rule.entity';
import { Model } from 'mongoose';
import { RuleEngineService } from '@app/rule-engine';
@Injectable()
export class RuleService {
  constructor(private readonly visitor: Visitor ,
     @InjectModel(Rule.name) private readonly ruleModel: Model<Rule>,
     @Inject('MAIL_SERVICE') private readonly client: ClientKafka,
     @Inject(CACHE_MANAGER) private cacheManager: Cache,
     private readonly ruleEngineService: RuleEngineService) {}
  private readonly logger = new Logger(RuleService.name);
  async convertToModel(code: string): Promise<IRuleChain> {
    const ast = Parser.parse(code, { ecmaVersion: 2024 });
    const data = await this.visitor.visitNode(ast);
    console.log("--------Ast--------", JSON.stringify(ast));
    return data;
  }
  async excuteRule(code: string, params: any[]) {
     return this.ruleEngineService.excuteRule(code, params);
  }
  async testSendMail() {
    const cachedData = await this.cacheManager.get('rule-engine');
    if (cachedData) {
      return cachedData; // Return cached data if available
    }
    const data = {message :  '~ ~ ~ ~ ~ Send mail ~ ~ ~ ~' };
    // Store data in cache
    await this.cacheManager.set('rule-engine', data);
    this.logger.log(`Data cached with key: rule-engine && data: ${data}`);
     // Set TTL for specific key
    return this.client.emit('send_template', {});
  }
}
