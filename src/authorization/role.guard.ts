import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserJwtPayload } from 'src/authentication/authentication.type';
import { AuthorizationRole } from './authorization-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // If there is no roles
    if (!roles || !roles.length) return true;

    const request = context.switchToHttp().getRequest();
    const userJwtPayload: UserJwtPayload = request.user;
    // If there is no user payload
    if (!userJwtPayload) return false;

    const userRole: AuthorizationRole = userJwtPayload.role;
    // Check the permissions
    if (roles.includes(userRole)) return true;

    return false;
  }
}
