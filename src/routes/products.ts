import express from "express";
import prismaClient from "../prisma";
import { ProductService } from "../services/productService";
import RequestError from "../error";

const productRouter = express.Router();

//TODO: Corrigir formatação, utilizando as controllers e retirar os try catchs enviando os erros corretos, pesquisar sobre validators, fazer deploy e depois auth.

const { createProduct, getProducts, deleteProduct, updateProduct } =
  ProductService();

productRouter.get("/", async (req, res) => {
  const products = await getProducts();

  res.status(200).send(products);
});

productRouter.post("/", async (req, res) => {
  const { title, price, description } = req.body as {
    title: string;
    price: number;
    description: string;
  };

  const produto = await createProduct(title, description, price);
  res.status(201).json(produto);
});

productRouter.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  await deleteProduct(id);

  res.status(200).json({ message: "Deletado com sucesso" });
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { title, description, price } = req.body;

  const product = await updateProduct(id, title, price, description);

  res.status(200).send(product);
});

export default productRouter;
