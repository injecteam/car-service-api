type UserAuthPayload = {
  email: string;
};

type AuthPayload = {
  user: UserAuthPayload;
  iat: number;
  exp: number;
};
