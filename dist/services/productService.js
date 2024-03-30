"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const error_1 = __importDefault(require("../error"));
function ProductService() {
    const getProducts = async () => {
        const products = await prisma_1.default.product.findMany({
            where: {
                is_deleted: false,
            },
        });
        return products;
    };
    const createProduct = async (title, description, price) => {
        if (!title || !price)
            throw new Error("Incorrect data");
        const product = await prisma_1.default.product.create({
            data: {
                title,
                description,
                price,
            },
        });
        return product;
    };
    const deleteProduct = async (id) => {
        if (!id)
            throw new Error("Incorrect data");
        const product = await prisma_1.default.product.findFirst({
            where: {
                id: id,
            },
        });
        if (product === null) {
            throw new error_1.default("Produto Não encontrado", 404);
        }
        await prisma_1.default.product.update({
            where: {
                id: id,
            },
            data: {
                is_deleted: true,
            },
        });
        return;
    };
    const updateProduct = async (id, title, price, description) => {
        if (!id || !title || !description || !price)
            throw new Error("Incorrect data");
        const product = await prisma_1.default.product.update({
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
exports.ProductService = ProductService;
