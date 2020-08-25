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
} from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  surname: string;

  @Column({ type: 'smallint', nullable: true })
  @IsNumber()
  age?: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({
    type: 'enum',
    enum: AuthorizationRole,
    default: AuthorizationRole.USER,
  })
  @IsEnum(AuthorizationRole)
  role: AuthorizationRole;

  @Column()
  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  @BeforeInsert()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }
}
