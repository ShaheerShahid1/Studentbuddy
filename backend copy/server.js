import express from "express";
import dotenv from "dotenv";
import uploadRouter from './routes/upload.js';
import connectMongoDb from './connectionMongoDB.js';
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectMongoDb(process.env.MongoUrl)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const app = express();
app.use(cors());
app.get('/',(req, res)=>{
res.send("Server is Up and running!");
});
app.use('/upload', uploadRouter);

app.listen(PORT,()=> console.log("server is live on " + PORT));

