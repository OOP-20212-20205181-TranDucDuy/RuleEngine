import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Parser } from 'acorn';
import { IRuleChain, IPublishMessageStatement, IIfElseStatement, IStatement, ICallApiStatement, ISwitchCaseStatement, ISendMailStatement, ISetRedisStatement, IVariableDeclaration, EStatement } from 'apps/rule/src/interfaces/rule-chain.interface';
import { RuleService } from 'apps/rule/src/rule.service';
import { Visitor } from './visitor';
import { Cache } from 'cache-manager';  
@Injectable()
export class RuleEngineService {
    constructor(private readonly visitor: Visitor ,
        @Inject('MAIL_SERVICE') private readonly client: ClientKafka,
        @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
     private readonly logger = new Logger(RuleService.name);
     async convertToModel(code: string): Promise<IRuleChain> {
       const ast = Parser.parse(code, { ecmaVersion: 2024 });
       const data = await this.visitor.visitNode(ast);
       console.log("--------Ast--------", JSON.stringify(ast));
       return data;
     }
     async excuteRule(code: string, params: any[]) {
       const ast = Parser.parse(code, { ecmaVersion: 2024 });
       const data = await this.visitor.visitNode(ast);
       const rulechain = {
         rule_id: "1",
         statements: data
       } as IRuleChain;
       console.log("🚀 ~ RuleService ~ excuteRule ~ rulechain:",JSON.stringify(rulechain));
       
       const listStatements = rulechain.statements;
       const response: any[] = [];
       async function executePublishMessageStatement(statement: IPublishMessageStatement) {
         response.push({ message: "PublishMessage success" })
       }
   
       async function executeIfElseStatement(statement: IIfElseStatement) {
         let ifElseStatement = statement;
         console.log("call in function executeIfElseStatement");
         console.log(ifElseStatement.true as IStatement[]);
         let ret;
         try {
           ret = eval(statement.condition);
           console.log(ret);
         }
         catch (e) {
           console.error(`Error evaluating condition: ${e}`);
         };
         const true_statement = ifElseStatement.true;
         const false_statement = ifElseStatement.false;
   
         if (ret) {
           const promises = true_statement.map(async (s) => {
             console.log(s);
             await executeStatement(s);
           });
           await Promise.all(promises);
         } else {
           if (false_statement) {
             const promises = false_statement.map(async (s) => {
               console.log(s);
               await executeStatement(s);
             });
             await Promise.all(promises);
           }
         }
       }
       async function executeCallApiStatement(statement: ICallApiStatement) {
         response.push({ message: "CallApi success" })
       }
       async function executeSwitchCaseStatement(statement: ISwitchCaseStatement) {
         const discriminant = eval(statement.discriminant);
         for (const c of statement.cases) {
           if (c.condition === discriminant) {
             const promises = c.statement.map(async (s) => {
               console.log(s);
               await executeStatement(s);
             });
             await Promise.all(promises);
           }
         }
       }
       async function executeSendMailStatement(statement: ISendMailStatement) {
         response.push({ message: "SendMail success" })
       }
       async function executeSetRedisStatement(statement: ISetRedisStatement) {
         response.push({ message: "SetRedis success" })
       }
       async function executeVariableDeclaration(statement: IVariableDeclaration) {
         console.log("call in function executeVariableDeclaration");
         return statement;
       }
       async function executeStatement(statement: IStatement) {
         // check required statements
         switch (statement.type) {
           case EStatement.VARIABLE_DECLARATION:
             console.log('variable declaration');
             await executeVariableDeclaration(statement as IVariableDeclaration);
             break;
           case EStatement.IF_ELSE:
             console.log('if-else');
             await executeIfElseStatement(statement as IIfElseStatement);
             break;
           case EStatement.CALL_API:
             console.log('CALL_API');
             await executeCallApiStatement(statement as ICallApiStatement);
             break;
           case EStatement.SWITCH_CASE:
             console.log('SWITCH_CASE');
             await executeSwitchCaseStatement(statement as ISwitchCaseStatement);
             break;
           case EStatement.SEND_MAIL:
             console.log('SEND_MAIL');
             await executeSendMailStatement(statement as ISendMailStatement);
             break;
           case EStatement.PUBLISH_MESSAGE:
             console.log('PUBLISH_MESSAGE');
             await executePublishMessageStatement(statement as IPublishMessageStatement);
             break;
           case EStatement.SET_REDIS:
             console.log('SET_REDIS');
             await executeSetRedisStatement(statement as ISetRedisStatement);
             break;
         }
       }
       const promises = listStatements.map(async (statement) => {
         await executeStatement(statement);
       });
       await Promise.all(promises);
       return { status: HttpStatus.OK, data: { response } };
     }
   
}
