const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

const payRouter = require("./routes/pay");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const styleRouter = require("./routes/style");

app.use(cors());
app.use(express.json());

app.use("/", payRouter);
app.use("/", userRouter);
app.use("/", productRouter);
app.use("/", styleRouter);

app.listen(8080, () => {
  console.log("서버 실행중");
});
