import { AuthorizationRole } from 'src/authorization/authorization-role.enum';

export type UserJwtPayload = {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: AuthorizationRole;
};

export type AuthenticationPayload = {
  user: UserJwtPayload;
  iat: number;
  exp: number;
};
