import "express-async-errors";
import express from "express";
import ProductRoute from "./routes/products";
import UserRoute from "./routes/user";
import { errorMiddleware } from "./middlewares/error";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/product", ProductRoute);
app.use("/user", UserRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
