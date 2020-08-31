import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
@Injectable()
export class MailerService {
  private transport: Mail;
  private transportEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: this.configService.get<string>('NODE_MAILER_HOST'),
      port: Number(this.configService.get<string>('NODE_MAILER_PORT')),
      secure: Boolean(this.configService.get<string>('NODE_MAILER_SECURE')),
      auth: {
        user: this.configService.get<string>('NODE_MAILER_USER'),
        pass: this.configService.get<string>('NODE_MAILER_PASSWORD'),
      },
    });
    this.transportEmail = this.configService.get<string>('NODE_MAILER_EMAIL');
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    const result = await this.transport.sendMail({
      from: `"car_service_api" <${this.transportEmail}>`,
      to,
      subject,
      html,
    });

    console.info(result);
  }
}
