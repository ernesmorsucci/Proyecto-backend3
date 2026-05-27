//dependences
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//routes
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";

//server config
dotenv.config();
const app=express();
const PORT=process.env.PORT||8080;

app.use(express.json());
app.use(cookieParser());

//routes config
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

//DB connection
const mongoInstance=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database conection success!');
    }catch(error){
        console.error(error);
        procces.exit();
    }
}

// Start server and DB unless running tests
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    app.listen(PORT,()=>console.log(`Listening on ${PORT}`));
    mongoInstance();
}

export default app;