import express from "express";
import prismaClient from "../prisma";
import { ProductService } from "../services/productService";
import RequestError from "../error";

const router = express.Router();

//TODO: Corrigir formatação, utilizando as controllers e retirar os try catchs enviando os erros corretos, pesquisar sobre validators, fazer deploy e depois auth.

const { createProduct, getProducts, deleteProduct, updateProduct } =
  ProductService();

router.get("/", async (req, res) => {
  const products = await getProducts();

  res.status(200).send(products);
});

router.post("/", async (req, res) => {
  try {
    const { title, price, description } = req.body as {
      title: string;
      price: number;
      description: string;
    };

    const produto = await createProduct(title, description, price);
    res.status(201).json(produto);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  await deleteProduct(id);

  res.status(200).json({ message: "Deletado com sucesso" });
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, price } = req.body;

    const product = await updateProduct(id, title, price, description);

    res.status(200).send(product);
  } catch (error) {
    res.status(500);
  }
});

export default router;
