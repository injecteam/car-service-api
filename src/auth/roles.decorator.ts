import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const hasRoles = (...hasRoles: string[]): CustomDecorator<string> =>
  SetMetadata('roles', hasRoles);
