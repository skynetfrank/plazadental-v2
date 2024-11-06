import mongoose from 'mongoose';

const controlSchema = new mongoose.Schema(
  {
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Paciente',
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
          ref: 'Servicio',
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
          ref: 'Producto',
        },
      },
    ],
    cambioBcv: { type: Number, default: 0 },
    montoUsd: { type: Number, default: 0 },
    montoBs: { type: Number, default: 0 },
    tasaIva: { type: Number, default: 0.16 },
    montoIva: { type: Number, default: 0 },
    totalGeneralBs: { type: Number, default: 0 },
    tasaComisionDr: { type: Number, default: 0 },
    tasaComisionPlaza: { type: Number, default: 0 },
    montoComisionDr: { type: Number, default: 0 },
    montoComisionPlaza: { type: Number, default: 0 },

    pagoInfo: {
      status: { type: String, default: 'pendiente' },
      fechaPago: { type: Date, default: '' },
      detallePago: { type: String, default: '' },
      memoPago: { type: String, default: '' },
    },
    factura: { type: String, default: '' },
    facturaControl: { type: String, default: '' },
    fechaFactura: { type: Date, default: '' },
    idPacienteOld: { type: String, default: '' },
    searchstring: { type: String },
  },

  {
    timestamps: true,
  }
);
const Control = mongoose.model('Control', controlSchema);
export default Control;
