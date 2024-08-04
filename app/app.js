import express from "express";
import authroutes from "../routes/authRiutes";
import { limiter } from "../middlewares/rateLimitMiddleware";


const app = express();

app.use(express.json());

app.use(limiter);

app.use('/api/auth',authroutes);

app.listen(3000,()=>{
    console.log('server running on port 3000');
});
