import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import dbConnect from './Config/dbConnect.js';
import cookieParser from 'cookie-parser';
import path from 'path'
import userRouter from './Routers/userRouter.js'


const app=express();
app.use(
    cors({
      origin: [
        "http://localhost:3000", 
      ],
      credentials: true,
    })
  );
dbConnect();
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.resolve()+"/public"))

app.use('/user',userRouter)
app.listen(5000, ()=>{
    console.log("server running on port 5000")
})



// https://dbdiagram.io/d/url-shortner-6544c6577d8bbd64656ade59