import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
  async send(
    from: string,
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const transport = nodemailer.createTransport({
      host: process.env.NODE_MAILER_HOST,
      port: Number(process.env.NODE_MAILER_PORT),
      secure: Boolean(process.env.NODE_MAILER_SECURE),
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    const result = await transport.sendMail({ from, to, subject, html });

    console.info(result);
  }
}
