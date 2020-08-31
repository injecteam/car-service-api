import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequestDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 30,
    description: 'name',
  })
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 30,
    description: 'surname',
  })
  readonly surname?: string;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  @ApiProperty({ type: Number, minimum: 18, maximum: 100, description: 'age' })
  readonly age?: number;
}
