import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { User } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User> {
    return this.userService.create(user);
  }
}
