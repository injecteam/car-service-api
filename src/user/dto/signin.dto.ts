import { IsString, MinLength, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDTO {
  @IsEmail()
  @MinLength(5)
  @MaxLength(30)
  @ApiProperty({
    description: 'email',
    type: String,
    format: 'email',
    minLength: 5,
    maxLength: 30,
    required: true,
    examples: ['user@example.com'],
  })
  readonly email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @ApiProperty({
    description: 'password',
    type: String,
    minLength: 4,
    maxLength: 30,
    required: true,
    examples: ['Password1'],
  })
  readonly password: string;
}

export class SignInResponseDTO {
  @IsString()
  readonly access_token: string;
}
