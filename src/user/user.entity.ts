import { Entity, Column, BeforeInsert } from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { AuthorizationRole } from 'src/authorization/authorization-role.enum';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsEmail,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  // TODO: Describe API property (swagger stuff)
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  // TODO: Describe API property (swagger stuff)
  surname: string;

  /**
   * FIXME: Replace the AGE with BIRTH (birth date)
   */
  @Column({ type: 'smallint', nullable: true })
  @IsNumber()
  @Min(18)
  @Max(100)
  // TODO: Describe API property (swagger stuff)
  age?: number;

  /**
   * FIXME: Replace the EMAIL as main data entry point to the PHONE
   */
  @Column({ type: 'varchar', unique: true, nullable: false })
  @IsEmail()
  @MinLength(5)
  @MaxLength(30)
  // TODO: Describe API property (swagger stuff)
  email: string;

  @Column({
    type: 'enum',
    enum: AuthorizationRole,
    default: AuthorizationRole.USER,
  })
  @IsEnum(AuthorizationRole)
  // TODO: Describe API property (swagger stuff)
  role: AuthorizationRole;

  @Column()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @Exclude({ toPlainOnly: true })
  // TODO: Describe API property (swagger stuff)
  password: string;

  @BeforeInsert()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }
}
