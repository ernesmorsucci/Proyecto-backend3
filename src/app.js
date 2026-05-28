//dependences
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

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

//docs config
const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'AdoptMe API',
            description:'API RESTful para la gestión de adopciones de mascotas.',
            version:'1.0.0'
        }
    },
    apis:[
        './src/docs/*.yaml',
    ]
}
const specs=swaggerJSDoc(swaggerOptions);
app.use('/api/docs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs));

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