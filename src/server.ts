import "express-async-errors";
import express from "express";
import ProductRoute from "./routes/products";
import { errorMiddleware } from "./middlewares/error";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/product", ProductRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
