import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsControl } from '../actions/controlActions';
import ComponentToPrintConstancia from '../components/ComponentToPrintConstancia';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

export default function PrintConstanciaScreen(props) {
	const contentRef = useRef(null);
	const handlePrint = useReactToPrint({ contentRef });

	const params = useParams();
	const { id: controlId } = params;

	const controlDetails = useSelector((state) => state.controlDetails);
	const { control, loading, error } = controlDetails;
	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;

	const dispatch = useDispatch();

	useEffect(() => {
		if (!control || (control && control._id !== controlId)) {
			dispatch(detailsControl(controlId));
		}
	}, [dispatch, controlId, control]);

	return loading ? (
		<LoadingBox></LoadingBox>
	) : error ? (
		<MessageBox variant='danger'>{error}</MessageBox>
	) : (
		<div className='printer-container recipe'>
			<div className='factura'>
				<button className='btn-print recipe' onClick={handlePrint}>
					<FontAwesomeIcon icon={faPrint} />
				</button>
			</div>
			<ComponentToPrintConstancia
				control={control}
				userInfo={userInfo}
				ref={contentRef}
			/>
		</div>
	);
}
