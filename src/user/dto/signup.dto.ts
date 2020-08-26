import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEmail,
  Matches,
} from 'class-validator';
import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({
    description: 'name',
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true,
  })
  readonly name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({
    description: 'surname',
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true,
  })
  readonly surname: string;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  @ApiProperty({
    type: Number,
    minimum: 18,
    maximum: 100,
    description: 'age',
    required: false,
  })
  readonly age?: number;

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
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).*$/, {
    message: 'The password is too week, please set up a more complex password.',
  })
  // FIXME: Here must be the PASSWORD, not the pure random string
  @ApiProperty({
    description: 'password',
    type: String,
    format: 'password',
    minLength: 4,
    maxLength: 30,
    required: true,
    examples: ['Password1'],
  })
  readonly password: string;
}

export class SignUpResponseDTO extends User {}
