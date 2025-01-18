import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
	{
		nombre: { type: String, required: true },
		apellido: { type: String, required: true },
		nacimiento: { type: Date },
		cedula: { type: String, unique: true, maxlength: 10 },
		genero: { type: String },
		rif: { type: String, maxlength: 10 },
		numeroColegio: { type: String },
		email: { type: String },
		celular: { type: String },
		telefono: { type: String },
		direccion: { type: String, required: true },
		contacto: { type: String },
		especialidad: { type: String },
		tasaComisionDoctor: { type: Number, default: 0.6 },
		fotoUrl: { type: String },
		isActivo: { type: Boolean, default: true },
		searchstring: {
			type: String,
			default: function () {
				return this.nombre.concat(
					' ',
					this.apellido,
					' ',
					this.cedula,
					' ',
					this.rif,
					' ',
					this.direccion,
					' ',
					this.especialidad
				);
			},
		},
	},
	{
		timestamps: true,
	}
);
const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
