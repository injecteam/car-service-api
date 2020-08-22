type UserJwtPayload = {
  id: number;
  name: string;
  surname: string;
  email: string;
};

type AuthPayload = {
  user: UserJwtPayload;
  iat: number;
  exp: number;
};
