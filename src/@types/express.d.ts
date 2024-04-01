type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

declare namespace Express {
  interface Request {
    user: Partial<User>;
  }
}
