import mongoose from 'mongoose';

const quoteItemSchema = new mongoose.Schema(
    {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio', required: true },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    {
        timestamps: false, // No necesitamos timestamps para cada item de servicio
    }
);

const quoteSchema = new mongoose.Schema(
    {
        paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Asumiendo que el usuario logueado es el doctor
        items: [quoteItemSchema],
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        validity: { type: Number, default: 15 }, // Validez en días
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true, // Para createdAt y updatedAt de la cotización
    }
);

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;