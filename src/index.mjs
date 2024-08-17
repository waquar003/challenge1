import express from "express";
import dotenv from "dotenv"
import connectDB from "./db.mjs";

dotenv.config({
  path: './.env'
})

const app = express();


const PORT = process.env.PORT || 8000

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`⚙️  Server is running at port : ${PORT}`);
  })
})
.catch((err) => {
  console.log("MONGO db connection failed !!! ", err);
})

app.use(express.json());


import userRouter from "./user.routes.js"

app.use("/api/v1/user", userRouter);
