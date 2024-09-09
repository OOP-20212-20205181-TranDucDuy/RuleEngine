import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  getHello(): string {
    console.log("~ ~ Hello Hello World! ~ ~");
    return 'Hello World!';
  }

  public example(): void {
    this
      .mailerService
      .sendMail({
        to: 'tduy0218@gmail.com', 
        from: 'tduy0215@gmail.com', // Senders email address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((success) => {
        console.log("~ ~ Success ~ ~ ~" ,success)
      })
      .catch((err) => {
        console.log("~ ~ Error ~ ~ ~" ,err)
      });
  }

  public example2(): void {
    this
      .mailerService
      .sendMail({
        to: 'tduy0218@gmail.com', // List of receivers email address
        from: 'tduy0215@gmail.com', // Senders email address
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }

  public example3(): void {
    this
      .mailerService
      .sendMail({
        to: 'test@nestjs.com',
        from: 'noreply@nestjs.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: __dirname + '/index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }
}
