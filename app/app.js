import express from "express";
import authroutes from "../routes/authRiutes";

const app = express();

app.use(express.json());

app.use('/api/auth',authroutes);

app.listen(3000,()=>{
    console.log('server running on port 3000');
});
