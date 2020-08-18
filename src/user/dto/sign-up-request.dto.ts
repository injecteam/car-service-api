import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class SignUpRequestDto {
  @IsString()
  @MinLength(3)
  readonly name: string;

  @IsString()
  @MinLength(3)
  readonly surname: string;

  @IsOptional()
  @IsNumber()
  readonly age?: number;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).*$/, {
    message: 'The password is too week, please set up a more complex password.',
  })
  readonly password: string;
}
