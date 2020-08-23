import { Module } from '@nestjs/common';
import { RoleGuard } from './role.guard';
import { OwnOrRoleGuard } from './own-or-role.guard';

@Module({
  imports: [],
  providers: [RoleGuard, OwnOrRoleGuard],
  exports: [],
})
export class AuthorizationModule {}
