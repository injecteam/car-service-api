import { IsEmail, IsString } from 'class-validator';

export class SignInRequestDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
