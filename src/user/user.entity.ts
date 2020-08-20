import { Entity, Column, BeforeInsert } from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';
import { Exclude, classToPlain } from 'class-transformer';

@Entity('users')
export class User extends AbstractEntity {
  @Column()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @Column()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  surname: string;

  @Column({ nullable: true })
  @IsNumber()
  age?: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @IsString()
  @Exclude()
  password: string;

  @BeforeInsert()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }

  toJSON(): Record<string, any> {
    return classToPlain(this);
  }
}
