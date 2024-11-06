import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
	{
		codigo: { type: String, unique: true, required: true },
		nombre: { type: String, maxlength: 50, required: true },
		marca: { type: String },
		presentacion: { type: String },
		unidades: { type: Number, min: 1 },
		descripcion: { type: String, maxlength: 200 },
		existencia: { type: Number, default: 0 },
		reposicion: { type: Number, default: 0 },
		costobs: { type: Number, default: 0 },
		costousd: { type: Number, default: 0 },
		preciobs: { type: Number, default: 0 },
		preciousd: { type: Number, default: 0 },
		proveedor: { type: String },
		imageurl: { type: String },
		searchstring: {
			type: String,
			default: function () {
				return this.codigo.concat(
					' ',
					this.nombre,
					' ',
					this.descripcion,
					' ',
					this.marca
				);
			},
		},
	},
	{
		timestamps: true,
	}
);
const Producto = mongoose.model('Producto', productoSchema);

export default Producto;
