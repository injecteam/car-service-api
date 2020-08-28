import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
  async sendTestEmail(): Promise<void> {
    const transport = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASSWORD,
      },
    });

    const result = await transport.sendMail({
      from: '"car_service_api" <foo@example.com>',
      to: 'slak@samaradom.ru',
      subject: 'Test email ✔',
      html: '<b>Do u see mee?<b>',
    });

    console.info(result);
  }
}
