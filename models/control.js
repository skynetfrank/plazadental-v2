import mongoose from "mongoose";

const controlSchema = new mongoose.Schema(
  {
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paciente",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fechaControl: { type: Date },
    esCita1: { type: Boolean },
    evaluacion: { type: String },
    tratamiento: { type: String },
    recipe: { type: String },
    indicaciones: { type: String },
    serviciosItems: [
      {
        cantidad: { type: Number, default: 0 },
        servicio: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Servicio",
        },
        precioServ: { type: Number, default: 0 },
        montoItemServicio: { type: Number, default: 0 },
      },
    ],
    materiales: [
      {
        cantidad: { type: Number, required: true },
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
        },
      },
    ],
    cambioBcv: { type: Number, default: 0 },
    laboratorio: { type: String },
    montoLab: { type: Number, default: 0 },
    montoUsd: { type: Number, default: 0 },
    montoBs: { type: Number, default: 0 },
    tasaIva: { type: Number, default: 0.16 },
    montoIva: { type: Number, default: 0 },
    descuento: { type: Number, default: 0 },
    tasaComisionDr: { type: Number, default: 0 },
    tasaComisionPlaza: { type: Number, default: 0 },
    montoComisionDr: { type: Number, default: 0 },
    montoComisionPlaza: { type: Number, default: 0 },

    pago: {
      efectivousd: { type: Number },
      efectivobs: { type: Number },
      efectivoeuros: { type: Number },
      punto: {
        montopunto: { type: Number, default: 0 },
        bancopunto: { type: String },
        refpunto: { type: String },
        bancodestinopunto: { type: String },
        montopunto2: { type: Number, default: 0 },
        bancopunto2: { type: String },
        refpunto2: { type: String },
        bancodestinopunto2: { type: String },
        montopunto3: { type: Number, default: 0 },
        bancopunto3: { type: String },
        refpunto3: { type: String },
        bancodestinopunto3: { type: String },
      },

      pagomovil: {
        montopagomovil: { type: Number, default: 0 },
        bancopagomovil: { type: String },
        bancodestinopagomovil: { type: String },
        telefonopagomovil: { type: String },
      },
      zelle: {
        montozelle: { type: Number, default: 0 },
        zelletitular: { type: String },
        zelleref: { type: String },
      },
    },
    factura: { type: String, default: "" },
    facturaControl: { type: String, default: "" },
    fechaFactura: { type: Date, default: "" },
    idPacienteOld: { type: String, default: "" },
  },

  {
    timestamps: true,
  }
);
const Control = mongoose.model("Control", controlSchema);
export default Control;
