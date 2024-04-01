import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import RequestError from "../error";
import { UserService } from "../services/userService";

type JwtPayload = {
  id: number;
};

const { findOneBy } = UserService();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new RequestError("Não autorizado", 401);
  }

  const token = authorization.split(" ")[1];

  const { id } = jwt.verify(
    token,
    process.env.JWT_PASSWORD ?? ""
  ) as JwtPayload;

  const user = await findOneBy(id);

  if (!user) {
    throw new RequestError("Não autorizado", 401);
  }

  const { password: _, ...loggedUser } = user;

  req.user = loggedUser;

  next();
};
