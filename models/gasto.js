import mongoose from "mongoose";

const gastoSchema = new mongoose.Schema(
  {
    fecha: { type: Date },
    referencia: { type: String },
    formadepago: { type: String },
    banco: { type: String },
    categoria: { type: String },
    beneficiario: { type: String },
    descripcion: { type: String },
    montousd: { type: Number, default: 0 },
    montobs: { type: Number, default: 0 },
    cambiodia: { type: Number, default: 0 },
    imageurl: { type: String },
    imageurl2: { type: String },
    registradopor: { type: String },
    searchstring: { type: String },
  },
  {
    timestamps: true,
  }
);
const Gasto = mongoose.model("Gasto", gastoSchema);

export default Gasto;
