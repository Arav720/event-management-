import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.ts';

import connectDB from './lib/db.ts';
const port = 3000;

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }))

connectDB();

app.use("/api/v1/auth", authRoutes);

app.listen(port, ()=>{
    console.log("app is running at port: ", port);
})
