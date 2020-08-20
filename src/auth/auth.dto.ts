import { IsEmail, IsString } from 'class-validator';

export class SignInRequestDTO {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}

export class SignInResponseDTO {
  @IsString()
  readonly access_token: string;
}
