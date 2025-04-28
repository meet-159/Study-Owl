import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDB from "./db/mongodb.connect.js";
import authRoutes from "./routes/auth.route.js";
import databaseRoutes from "./routes/database.route.js"
import classesRoutes from "./routes/class.route.js"
import notificationRoutes from "./routes/notification.route.js"


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });
  

app.use("/api/auth",authRoutes);
app.use("/api/database",databaseRoutes)
app.use("/api/classes",classesRoutes)
app.use("/api/notifications",notificationRoutes)

app.listen("3000",()=>{
    console.log("server is running on port 3000");
    connectDB();
});