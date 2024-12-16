import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDoctor } from '../actions/doctorActions';
import { DOCTOR_CREATE_RESET } from '../constants/doctorConstants';
import { NumericFormat } from 'react-number-format';
import Swal from "sweetalert2";

export default function DoctorCreateScreen(props) {
	const [nombre, setNombre] = useState('');
	const [apellido, setApellido] = useState('');
	const [cedula, setCedula] = useState('');
	const [genero, setGenero] = useState('');
	const [nacimiento, setNacimiento] = useState();
	const [direccion, setDireccion] = useState('');
	const [celular, setCelular] = useState('');
	const [telefono, setTelefono] = useState('');
	const [email, setEmail] = useState('');
	const [contacto, setContacto] = useState('');
	const [especialidad, setEspecialidad] = useState('');
	const [numeroColegio, setNumeroColegio] = useState('');
	const [tasaComisionDoctor, setTasaComisionDr] = useState(0.40)

	const [fotoUrl, setFotoUrl] = useState('');

	const selGenero = ['', 'Hombre', 'Mujer', 'Otro'];
	const selEspecialidad = [
		'',
		'CIRUGIA BUCAL',
		'ENDODONCIA',
		'ODONTOLOGIA',
		'ODONTOPEDIATRIA',
		'ORTODONCIA',
		'PERIODONCIA',
		'PROSTODONCIA',
	];

	const doctorCreate = useSelector((state) => state.doctorCreate);
	const { error, success, doctor } = doctorCreate;

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		if (genero === 'hombre') {
			setFotoUrl(
				'https://res.cloudinary.com/plazasky/image/upload/v1662409177/doctores/male-doctor.png'
			);
		}
		if (genero === 'mujer') {
			setFotoUrl(
				'https://res.cloudinary.com/plazasky/image/upload/v1662409177/doctores/female-doctor.png'
			);
		}

		dispatch(
			createDoctor({
				nombre,
				apellido,
				cedula,
				genero,
				nacimiento,
				direccion,
				celular,
				telefono,
				email,
				especialidad,
				numeroColegio,
				contacto,
				fotoUrl,
			})
		);
	};

	useEffect(() => {
		if (doctor) {
			Swal.fire({
				text: "Doctor Registrado!",
				imageUrl: "/tiny_logo.jpg",
				imageWidth: 70,
				imageHeight: 30,
				imageAlt: "logo",
			});
		}
		dispatch({ type: DOCTOR_CREATE_RESET });
		setApellido('');
		setCedula('');
		setGenero('');
		setNacimiento();
		setDireccion('');
		setCelular('');
		setTelefono('');
		setEmail('');
		setContacto('');
		setFotoUrl(
			'https://res.cloudinary.com/plazasky/image/upload/v1662409177/doctores/male-doctor.png'
		);
		setEspecialidad('');
		setNumeroColegio('');
	}, [dispatch, doctor]);

	return (
		<div className='main-container'>
			<div className='flx jcenter gap1'>
				<h2>Agregar Doctor</h2>
				<div>
					<img src={fotoUrl} alt='doctor' className='doctor-img' />
				</div>
			</div>

			<div>
				<form id='form-doctor' onSubmit={submitHandler}>
					<div className='inputs-section'>
						<div className='input-group'>
							<input
								type='text'
								id='nombre'
								placeholder=' '
								className='input'
								autoComplete='off'
								maxLength={20}
								required
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
							></input>
							<label htmlFor='nombre' className='user-label'>
								Nombre
							</label>
						</div>
						<div className='input-group'>
							<input
								type='text'
								id='apellido'
								placeholder=' '
								className='input'
								autoComplete='off'
								maxLength={20}
								required
								value={apellido}
								onChange={(e) => setApellido(e.target.value)}
							></input>
							<label htmlFor='apellido' className='user-label'>
								Apellido
							</label>
						</div>
						<div className='input-group'>
							<input
								type='text'
								id='cedula'
								placeholder=' '
								className='input'
								autoComplete='off'
								maxLength={10}
								pattern='[V|E][0-9]{6,9}'
								value={cedula}
								onChange={(e) => setCedula(e.target.value)}
							></input>
							<label htmlFor='cedula' className='user-label'>
								Cedula (ej: V999999999)
							</label>
						</div>
						<div className='input-group'>
							<input
								type='text'
								id='colegio'
								placeholder=' '
								className='input'
								autoComplete='off'
								maxLength={20}
								required
								value={numeroColegio}
								onChange={(e) => setNumeroColegio(e.target.value)}
							></input>
							<label htmlFor='colegio' className='user-label'>
								Colegio Numero
							</label>
						</div>
						<div className='input-group'>
							<input
								type='date'
								id='nacimiento'
								placeholder=' '
								className='input'
								min='1930-12-31'
								max='2030-12-31'
								autoComplete='off'
								value={nacimiento}
								onChange={(e) => setNacimiento(e.target.value)}
							></input>
							<label htmlFor='nacimiento' className='user-label'>
								Fecha Nacimiento
							</label>
						</div>
						<div className='input-group'>
							<NumericFormat
								format='####-###-##-##'
								allowEmptyFormatting
								mask='_'
								type='text'
								id='celular'
								value={celular}
								className='input'
								onChange={(e) => setCelular(e.target.value)}
							/>
							<label htmlFor='telefono' className='user-label'>
								Telefono
							</label>
						</div>

						<div className='input-group'>
							<input
								type='text'
								id='email'
								placeholder=' '
								className='input'
								autoComplete='off'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></input>
							<label htmlFor='email' className='user-label'>
								Email
							</label>
						</div>
						<div className='input-group'>
							<input
								type='text'
								id='direccion'
								placeholder=' '
								className='input'
								autoComplete='off'
								maxLength={50}
								value={direccion}
								onChange={(e) => setDireccion(e.target.value)}
							></input>
							<label htmlFor='direccion' className='user-label'>
								Direccion
							</label>
						</div>
						<div className='input-group'>
							<input
								type='text'
								id='contacto'
								placeholder=' '
								className='input'
								autoComplete='off'
								maxLength={30}
								value={contacto}
								onChange={(e) => setContacto(e.target.value)}
							></input>
							<label htmlFor='contacto' className='user-label'>
								Contacto
							</label>
						</div>

						<div className='select-wrapper' data-title='Genero'>
							<select
								className='input select'
								value={genero}
								placeholder='selecionar'
								onChange={(e) => setGenero(e.target.value)}
							>
								{selGenero.map((x) => (
									<option key={x} value={x}>
										{x}
									</option>
								))}
							</select>
						</div>
						<div className='select-wrapper' data-title='Especialidad'>
							<select
								className='input select'
								value={especialidad}
								placeholder='selecionar'
								onChange={(e) => setEspecialidad(e.target.value)}
							>
								{selEspecialidad.map((x) => (
									<option key={x} value={x}>
										{x}
									</option>
								))}
							</select>
						</div>
						<div className='input-group'>
							<input
								type='text'
								placeholder=' '
								className='input'
								autoComplete='off'
								step={0.1}
								value={tasaComisionDoctor}
								onChange={(e) => setTasaComisionDr(e.target.value)}
							></input>
							<label htmlFor='contacto' className='user-label'>
								Tasa Comision
							</label>
						</div>
					</div>

					<div className="centrado">
						<button className='button' type='submit'>
							Registrar Doctor
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
