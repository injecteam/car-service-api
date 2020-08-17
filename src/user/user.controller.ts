import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.interface';
import { catchError } from 'rxjs/operators';
import { UpdateResult, DeleteResult } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User | Record<string, unknown>> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Record<string, unknown>> {
    return this.userService.login(user).pipe(
      map((jwt: string) => ({
        access_token: jwt,
      })),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<User> {
    return this.userService.findOne(id);
  }

  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Put(':id')
  updateOne(
    @Param('id') id: number,
    @Body() user: User,
  ): Observable<UpdateResult> {
    return this.userService.updateOne(id, user);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number): Observable<DeleteResult> {
    return this.userService.deleteOne(id);
  }
}
