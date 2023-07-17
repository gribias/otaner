import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import orderRouters from './routes/order.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));

app.get('/', (req, res) =>{
    res.send({ message: 'Hello World!'})
})


app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouters)
const startServer = async () => {
    try {
        // connect to the database...
        connectDB(process.env.MONGODB_URL)

        app.listen(8080, () => console.log('Server started on port http://localhost:8080'))
    }catch (error){
        console.log(error);
    }
}

startServer();