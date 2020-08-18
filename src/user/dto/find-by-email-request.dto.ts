import { IsEmail } from 'class-validator';
export class FindByEmailRequestDto {
  @IsEmail()
  readonly email: string;
}
