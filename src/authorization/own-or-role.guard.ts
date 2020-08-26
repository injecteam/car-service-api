import { Reflector } from '@nestjs/core';
import { UserJwtPayload } from 'src/authentication/authentication.type';
import { AuthorizationRole } from './authorization-role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnOrRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Check the owner
    const requestParamsId = Number(request.params.id);
    const userJwtPayload: UserJwtPayload = request.user;
    const userId = userJwtPayload.id;
    if (requestParamsId === userId) return true;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // If there is no roles
    if (!roles || !roles.length) return false;

    const userRole: AuthorizationRole = userJwtPayload.role;
    // Check the permissions
    if (roles.includes(userRole)) return true;

    return false;
  }
}
