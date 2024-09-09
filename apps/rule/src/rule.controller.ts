import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RuleService } from './rule.service';


@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}
    @Get()
    async convertToModel(@Body('code') code: string) {
        return this.ruleService.convertToModel(code);
    }
    @Get('execute')
    async executeRule(@Body('code') code: string, @Body('params') params: any[]) {
        return this.ruleService.excuteRule(code, params);
    }
    @Get('test-send-mail')
    async testSendMail() {
        return this.ruleService.testSendMail();
    }
    
}
