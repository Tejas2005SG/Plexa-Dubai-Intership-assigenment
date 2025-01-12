import express from "express"; // module form 
import dotenv from "dotenv";
import {connectDb } from "./Db/connectDb.js";
import authRoutes from "./Routes/auth.route.js"
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import campaignRoutes from "./Routes/campaign.routes.js";
import invoiceRoutes from "./Routes/invoice.routes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT||5000;
const __dirname = path.resolve();

app.use(cors({origin:"http://localhost:5173", credentials:true}))


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/invoices", invoiceRoutes);

app.listen(PORT,()=>{
    console.log(PORT)
    connectDb();
});





