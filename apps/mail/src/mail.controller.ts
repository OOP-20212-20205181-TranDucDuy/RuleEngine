import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MessagePattern, EventPattern } from '@nestjs/microservices';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  getHello(): string {
    return this.mailService.getHello();
  }
  @MessagePattern('get_hello')
  async sendMail() {
    return this.mailService.getHello();
  }
  @EventPattern('send_template')
  async sendTemplate() {
    return this.mailService.example();
  }
}
  