import { Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import routes from "./src/config/routesRegistry";
import requestLogger from "./src/shared/middleware/logs"
import cors from "cors";
import { specs, swaggerUi } from './swagger';
import sampleRoutes from "./src/api/routes/sample"
import path from 'path';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8084;
require("./src/config/dbConnection");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(express.json())
app.use(requestLogger);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/compressed")));
app.use(express.static(path.join(__dirname, "public/originals")));



// Serve compressed images at /uploads/compressed/
app.use('/uploads/compressed', express.static(path.join(__dirname, './uploads/compressed')));

app.use(sampleRoutes)
routes(app);
app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Welcome to Data Gyani");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running at PORT: ${PORT}`);
}).on("error", (error) => {
  throw new Error(error.message);
});
