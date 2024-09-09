import { Controller, Get, Req } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get()
  async getHello(@Req() req: Request): Promise<string>  {
    return this.apiGatewayService.getHello();
  }
}
