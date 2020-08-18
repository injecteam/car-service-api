import { IsString } from 'class-validator';

export class SignInResponseDto {
  @IsString()
  readonly access_token: string;
}
