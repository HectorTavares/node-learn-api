"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productService_1 = require("../services/productService");
const router = express_1.default.Router();
//TODO: Corrigir formatação, utilizando as controllers e retirar os try catchs enviando os erros corretos, pesquisar sobre validators, fazer deploy e depois auth.
const { createProduct, getProducts, deleteProduct, updateProduct } = (0, productService_1.ProductService)();
router.get("/", async (req, res) => {
    const products = await getProducts();
    res.status(200).send(products);
});
router.post("/", async (req, res) => {
    try {
        const { title, price, description } = req.body;
        const produto = await createProduct(title, description, price);
        res.status(201).json(produto);
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500);
    }
});
exports.default = router;
