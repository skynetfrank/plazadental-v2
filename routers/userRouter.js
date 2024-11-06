import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/usuario.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
	'/',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const pageSize = 8;
		const page = Number(req.query.pageNumber) || 1;
		const count = await User.countDocuments({});

		const users = await User.find({})
			.skip(pageSize * (page - 1))
			.limit(pageSize);

		res.send({ users, page, pages: Math.ceil(count / pageSize), count });
	})
);

userRouter.post(
	'/signin',
	expressAsyncHandler(async (req, res) => {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				res.send({
					_id: user._id,
					nombre: user.nombre,
					apellido: user.apellido,
					cedula: user.cedula,
					telefono: user.telefono,
					email: user.telefono,
					password: user.password,
					isAdmin: user.isAdmin,
					isVendedor: user.isVendedor,
					isAsistente: user.isAsistente,
					isDoctor: user.isDoctor,
					token: generateToken(user),
				});
				return;
			}
		}
		res.status(401).send({ message: 'Email o Clave Invalidos' });
	})
);

userRouter.post(
	'/register',
	expressAsyncHandler(async (req, res) => {
		const user = new User({
			nombre: req.body.nombre,
			apellido: req.body.apellido,
			cedula: req.body.cedula,
			telefono: req.body.telefono,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 8),
		});
		const createdUser = await user.save();
		res.send({
			_id: createdUser._id,
			nombre: createdUser.nombre,
			apellido: createdUser.apellido,
			cedula: createdUser.cedula,
			telefono: createdUser.telefono,
			email: createdUser.email,
			isAdmin: createdUser.isAdmin,
			isVendedor: createdUser.isVendedor,
			isAsistente: createdUser.isAsistente,
			isDoctor: createdUser.isDoctor,
			token: generateToken(createdUser),
		});
	})
);

userRouter.get(
	'/:id',
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			res.send(user);
		} else {
			res.status(404).send({ message: 'Usuario No Encontrado' });
		}
	})
);

userRouter.put(
	'/profile',
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.user._id);
		if (user) {
			user.nombre = req.body.nombre || user.nombre;
			user.apellido = req.body.apellido || user.apellido;
			user.cedula = req.body.cedula || user.cedula;
			user.telefono = req.body.telefono || user.telefono;
			user.email = req.body.email || user.email;

			if (req.body.password) {
				user.password = bcrypt.hashSync(req.body.password, 8);
			}
			const updatedUser = await user.save();
			res.send({
				_id: updatedUser._id,
				nombre: updatedUser.nombre,
				apellido: updatedUser.apellido,
				cedula: updatedUser.cedula,
				telefono: updatedUser.telefono,
				email: updatedUser.email,
				isAdmin: updatedUser.isAdmin,
				isVendedor: updatedUser.isVendedor,
				isAsistente: updatedUser.isAsistente,
				isDoctor: updatedUser.isDoctor,
				token: generateToken(updatedUser),
			});
		}
	})
);

userRouter.delete(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			if (
				user.email === 'frank.uah@gmail.com' ||
				user.email === 'rony@gmail.com'
			) {
				res.status(400).send({ message: 'No puedes Eliminar al Admin!' });
				return;
			}
			const deleteUser = await user.remove();
			res.send({ message: 'Usuario Eliminado', user: deleteUser });
		} else {
			res.status(404).send({ message: 'Usuario No Encontrado' });
		}
	})
);

userRouter.put(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const user = await User.findById(req.params.id);
		if (user) {
			user.nombre = req.body.nombre || user.nombre;
			user.apellido = req.body.apellido || user.apellido;
			user.email = req.body.email || user.email;
			user.telefono = req.body.email || user.telefono;
			user.isAdmin = Boolean(req.body.isAdmin);
			user.isVendedor = Boolean(req.body.isVendedor);
			user.isAsistente = Boolean(req.body.isAsistente);
			user.isDoctor = Boolean(req.body.isDoctor);

			const updatedUser = await user.save();
			res.send({ message: 'Usuario Actualizado', user: updatedUser });
		} else {
			res.status(404).send({ message: 'Usuario No Encontrado' });
		}
	})
);

export default userRouter;
