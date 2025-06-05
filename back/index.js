const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

// 라우터 불러오기(각자 수정)
const payRouter = require('./routes/pay');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const styleRouter = require('./routes/style');

app.use(cors());
app.use(express.json());

// 라우터 등록(각자 수정)
app.use('/pay', payRouter);   
app.use('/user', userRouter);     
app.use('/product', productRouter);   
app.use('/style', styleRouter);  

app.listen(8080, () => {
    console.log("서버 실행중");
});
