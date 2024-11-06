import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		nombre: { type: String, required: true },
		apellido: { type: String, required: true },
		cedula: { type: String, default: ' ' },
		telefono: { type: String, default: ' ' },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false, required: true },
		isVendedor: { type: Boolean, default: false, required: true },
		isAsistente: { type: Boolean, default: false, required: true },
		isDoctor: { type: Boolean, default: false, required: true },
	},
	{
		timestamps: true,
	}
);
const User = mongoose.model('User', userSchema);
export default User;
