import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import pacienteRouter from "./routers/pacienteRouter.js";
import doctorRouter from "./routers/doctorRouter.js";
import controlRouter from "./routers/controlRouter.js";
import servicioRouter from "./routers/servicioRouter.js";
import gastoRouter from "./routers/gastoRouter.js";
import cloudinary from "cloudinary";

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const localdb = "mongodb://127.0.0.1:27017/plazadentaldb";
//process.env.MONGODB_URI;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("mongodb =>: conectado"))
  .catch((e) => console.log(e.message));

app.use("/api/users", userRouter);
app.use("/api/productos", productRouter);
app.use("/api/pacientes", pacienteRouter);
app.use("/api/doctores", doctorRouter);
app.use("/api/controles", controlRouter);
app.use("/api/servicios", servicioRouter);
app.use("/api/gastos", gastoRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/frontend/dist/index.html")));

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("servidor ok escuchando en http://localhost");
});
