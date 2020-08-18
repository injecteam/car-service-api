import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    console.info(user);

    return true;
  }
}
