import mongoose from "mongoose";

const servicioSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, required: true },
    nombre: { type: String, maxlength: 50, required: true },
    area: { type: String },
    descripcion: { type: String, maxlength: 80 },
    preciobs: { type: Number, default: 0 },
    preciousd: { type: Number, default: 0 },
    cambio: { type: Number, default: 0 },
    searchstring: { type: String },
  },
  {
    timestamps: true,
  }
);
const Servicio = mongoose.model("Servicio", servicioSchema);

export default Servicio;
