import prismaClient from "../prisma";
import RequestError from "../error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type JWTPayload = {
  id: number;
};

export function UserService() {
  const findOneBy = async (id: number) => {
    const user = await prismaClient.user.findFirst({
      where: {
        id: id.toString(),
      },
    });

    return user;
  };
  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    if (!name || !email || !password)
      throw new RequestError("Dados Incorretos", 400);

    const userExists = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) throw new RequestError("Email já existe", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return newUser;
  };

  const loginUser = async (email: string, password: string) => {
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new RequestError("Email ou senha inválidos", 400);

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword)
      throw new RequestError("Email ou senha inválidos", 400);

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASSWORD ?? "", {
      expiresIn: "1d",
    });

    return { user, token };
  };

  const getProfile = async (id: string) => {
    const user = await prismaClient.user.findFirst({
      where: {
        id: id.toString(),
      },
    });

    if (!user) throw new RequestError("Usuario Não existe", 404);

    return user;
  };

  const deleteUser = async (id: string) => {
    if (!id) throw new RequestError("Dados Incorretos", 400);

    const product = await prismaClient.user.findFirst({
      where: {
        id: id,
      },
    });

    if (product === null) {
      throw new RequestError("Produto Não encontrado", 404);
    }

    await prismaClient.product.update({
      where: {
        id: id,
      },
      data: {
        is_deleted: true,
      },
    });

    return;
  };

  const updateUser = async (
    id: string,
    title: string,
    price: number,
    description: string
  ) => {
    if (!id || !title || !description || !price)
      throw new RequestError("Dados Incorretos", 400);

    const product = await prismaClient.product.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        price,
      },
    });

    return product;
  };

  return {
    registerUser,
    getProfile,
    deleteUser,
    updateUser,
    loginUser,
    findOneBy,
  };
}
