import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthenticationModule,
    AuthorizationModule,
    MailerModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
