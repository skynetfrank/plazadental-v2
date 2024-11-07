import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { detailsPaciente } from '../actions/pacienteActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { format } from 'date-fns';
import {
	faAddressCard,
	faAllergies,
	faGrimace,
	faHandHoldingMedical,
	faHouseMedicalCircleCheck,
	faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PacienteScreen(props) {
	const navigate = useNavigate();
	const params = useParams();
	const { id: pacienteId } = params;
	const [controles, setControles] = useState([]);

	const pacienteDetails = useSelector((state) => state.pacienteDetails);
	const { paciente, loading, error } = pacienteDetails;
	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;
	const dispatch = useDispatch();

	const cloudinaryx =
		'https://res.cloudinary.com/plazasky/image/upload/v1661258482/odontogramas/';

	useEffect(() => {
		if (!paciente || (paciente && paciente._id !== pacienteId)) {
			dispatch(detailsPaciente(pacienteId));
		}
	}, [dispatch, pacienteId, paciente]);

	return loading ? (
		<LoadingBox></LoadingBox>
	) : error ? (
		<MessageBox variant='danger'>{error}</MessageBox>
	) : (
		<div className='main-container'>
			<div className='title-container'>
				<span className='span-box'>
					{paciente.nombre + ' ' + paciente.apellido}
				</span>
			</div>

			<div className='paciente-cards-container'>
				<div className='card'>
					<div className='card-header'>
						<div className='img-box'>
							<FontAwesomeIcon icon={faUserCircle} />
						</div>
						<h1 className='title'>Informacion Personal</h1>
					</div>

					<div className='content'>
						<div className='datos'>
							<p>Cedula:</p>
							<span>{paciente.cedula}</span>
						</div>
						<div className='datos'>
							<p>Genero:</p>
							<span>{paciente.genero}</span>
						</div>
						<div className='datos'>
							<p>Nacimiento:</p>
							<span>{format(new Date(paciente.Nacimiento), 'dd-MM-yyyy')}</span>
						</div>
						<div className='datos'>
							<p>Edad:</p>
							<span>{paciente.edad} años</span>
						</div>
						<div className='datos'>
							<p>Peso:</p>
							<span>{paciente.peso} Kgs.</span>
						</div>
						<div className='datos'>
							<p>Estatura:</p>
							<span>{paciente.estatura} Mts.</span>
						</div>
						<div className='datos'>
							<p>Estado Civil:</p>
							<span>{paciente.estadoCivil}</span>
						</div>
						<div className='datos'>
							<p>Telefono:</p>
							<span>{paciente.telefono + ' ' + paciente.celular}</span>
						</div>
						<div className='datos'>
							<p>Email:</p>
							<span>{paciente.email}</span>
						</div>
						<div className='datos'>
							<p>Direccion:</p>
							<span className='info-paciente'>{paciente.direccion}</span>
						</div>
						<div className='datos'>
							<p>Contacto:</p>
							<span className='info-paciente'>{paciente.contacto}</span>
						</div>
					</div>
				</div>

				<div className='card'>
					<div className='card-header'>
						<div className='img-box'>
							<FontAwesomeIcon icon={faAllergies} />
						</div>
						<h1 className='title'>Alergias </h1>
					</div>

					<div className='content'>
						<p>
							{paciente.alergias.every((elem) => elem === ' ')
								? 'No Refiere'
								: paciente.alergias.map((alergia) => {
										if (alergia === '') {
											return '';
										}
										return alergia + ', ';
								  })}
						</p>
						<div className='datos'>
							<p>Otras Alergias:</p>
							<span>{paciente.otrasAlergias}</span>
						</div>
					</div>
				</div>
				<div className='card'>
					<div className='card-header'>
						<div className='img-box'>
							<FontAwesomeIcon icon={faHandHoldingMedical} />
						</div>
						<h1 className='title'>Antecedentes Personales</h1>
					</div>

					<div className='content'>
						{paciente.antecedentesPersonales.every((elem) => elem === '')
							? 'No Refiere'
							: paciente.antecedentesPersonales.map((bgp, inx) => {
									if (bgp === '') {
										return '';
									}
									return <p key={inx}>{bgp}</p>;
							  })}
					</div>
					<div className='content'>
						<p>Tratado por Medico por: {paciente.tratadoPorEnfermedad}</p>
						<p>Toma Medicamentos: {paciente.medicamentos}</p>
						<p>Dosis: {paciente.dosis}</p>
						<p>Habitos: {paciente.habitos}</p>
					</div>
				</div>
				<div className='card'>
					<div className='card-header'>
						<div className='img-box'>
							<FontAwesomeIcon icon={faHouseMedicalCircleCheck} />
						</div>
						<h1 className='title'>Antecedentes Familiares</h1>
					</div>

					<div className='content'>
						<p>
							{paciente.antecedentesFamiliares.every((elem) => elem === ' ')
								? 'No Refiere'
								: paciente.antecedentesFamiliares.map((bgf) => {
										if (bgf === '') {
											return '';
										}
										return bgf + ', ';
								  })}
						</p>
					</div>
				</div>
				<Link to={`/pacienteycontroles/${paciente._id}`} className='nav__link'>
					<div className='card'>
						<div className='card-header'>
							<div className='img-box'>
								<FontAwesomeIcon icon={faAddressCard} />
							</div>
							<h1 className='title'>Control de Consultas</h1>
						</div>

						<div className='content'>
							<p>Pulse aqui para Ver Los Controles de Consultas</p>
						</div>
					</div>
				</Link>
				<div className='card'>
					<div className='card-header'>
						<div className='img-box'>
							<FontAwesomeIcon icon={faGrimace} />
						</div>
						<h1 className='title'>Odontograma</h1>
					</div>

					<div className='content'>
						<img
							className='odograma-small'
							src={cloudinaryx + paciente.idPacienteOld + '.jpg'}
							alt='Sin Odontograma Asignado'
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
