import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { User } from './user.interface';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashedPassword: string) => {
        const newUser = new UserEntity();
        newUser.email = user.email;
        newUser.password = hashedPassword;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),

          catchError(err => throwError(err)),
        );
      }),
    );
  }

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }

  findByEmail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ email }));
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(v => delete v.password);
        return users;
      }),
    );
  }

  // async findAll(): Promise<User[]> {
  //   try {
  //     const users = await this.userRepository.find();
  //     users.forEach(user => delete user.password);
  //     return users;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  updateOne(id: number, user: User): Observable<UpdateResult> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashedPassword: string) => {
        user.password = hashedPassword;

        return from(this.userRepository.update(id, user)).pipe(
          catchError(err => throwError(err)),
        );
      }),
    );
  }

  // async updateOne(id: number, user: User): Promise<UpdateResult> {
  //   delete user.email;
  //   delete user.password;
  //   try {
  //     const result = await this.userRepository.update(id, user);
  //     return result;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  deleteOne(id: number): Observable<DeleteResult> {
    return from(this.userRepository.delete(id));
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          const { password, ...payload } = user;
          return this.authService
            .generateJWT(payload)
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'Wrong credentials';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return this.findByEmail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              return user;
            } else {
              throw new Error();
            }
          }),
        ),
      ),
    );
  }
}
