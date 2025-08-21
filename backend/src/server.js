import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoutes from './Routes/transactionsRoutes.js';

dotenv.config();

const app = express();

//Middlewares
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/transactions",transactionsRoutes);


initDB().then(() => {
    app.listen(PORT, () => {
    console.log('Server is running on port:',PORT);
});
});