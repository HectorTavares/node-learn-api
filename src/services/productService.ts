import prismaClient from "../prisma";
import RequestError from "../error";

export function ProductService() {
  const getProducts = async () => {
    const products = await prismaClient.product.findMany({
      where: {
        is_deleted: false,
      },
    });
    return products;
  };

  const createProduct = async (
    title: string,
    description: string,
    price: number
  ) => {
    if (!title || !price) throw new Error("Incorrect data");

    const product = await prismaClient.product.create({
      data: {
        title,
        description,
        price,
      },
    });

    return product;
  };

  const deleteProduct = async (id: string) => {
    if (!id) throw new Error("Incorrect data");

    const product = await prismaClient.product.findFirst({
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

  const updateProduct = async (
    id: string,
    title: string,
    price: number,
    description: string
  ) => {
    if (!id || !title || !description || !price)
      throw new Error("Incorrect data");

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
    createProduct,
    getProducts,
    deleteProduct,
    updateProduct,
  };
}
