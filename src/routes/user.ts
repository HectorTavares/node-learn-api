import express from "express";
import prismaClient from "../prisma";
import { UserService } from "../services/userService";
import RequestError from "../error";
import { authMiddleware } from "../middlewares/auth";

const userRouter = express.Router();

const { registerUser, loginUser, getProfile } = UserService();

userRouter.post("/", async (req, res) => {
  const { email, password, name } = req.body;
  const token = await registerUser(name, email, password);

  res.status(201).send(token);
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const response = await loginUser(email, password);
  res.status(200).send(response);
});

userRouter.get("/", authMiddleware, async (req, res) => {
  const user = req.user;

  res.send(user);
});

export default userRouter;
