import { IsString, MinLength, IsNumber, IsOptional } from 'class-validator';
export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly surname?: string;

  @IsOptional()
  @IsNumber()
  readonly age?: number;
}
