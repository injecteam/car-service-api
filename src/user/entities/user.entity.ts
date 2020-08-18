import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }
}
