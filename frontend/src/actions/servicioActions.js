import Axios from 'axios';
import {
	SERVICIO_CREATE_FAIL,
	SERVICIO_CREATE_REQUEST,
	SERVICIO_CREATE_SUCCESS,
	SERVICIO_DETAILS_FAIL,
	SERVICIO_DETAILS_REQUEST,
	SERVICIO_DETAILS_SUCCESS,
	SERVICIO_LIST_FAIL,
	SERVICIO_LIST_REQUEST,
	SERVICIO_LIST_SUCCESS,
	SERVICIO_UPDATE_REQUEST,
	SERVICIO_UPDATE_SUCCESS,
	SERVICIO_UPDATE_FAIL,
	SERVICIO_DELETE_REQUEST,
	SERVICIO_DELETE_FAIL,
	SERVICIO_DELETE_SUCCESS,
	SERVICIO_ALL_REQUEST,
	SERVICIO_ALL_SUCCESS,
	SERVICIO_ALL_FAIL,
	SERVICIO_ALL_LIST_REQUEST,
	SERVICIO_ALL_LIST_SUCCESS,
	SERVICIO_ALL_LIST_FAIL,
} from '../constants/servicioConstants';

export const listServicios =
	({ nombre = '', pageNumber = '' }) =>
	async (dispatch) => {
		dispatch({
			type: SERVICIO_LIST_REQUEST,
		});
		try {
			const { data } = await Axios.get(
				`/api/servicios?pageNumber=${pageNumber}&nombre=${nombre}`
			);

			dispatch({ type: SERVICIO_LIST_SUCCESS, payload: data });
		} catch (error) {
			dispatch({ type: SERVICIO_LIST_FAIL, payload: error.message });
		}
	};

export const detailsServicio = (servicioId) => async (dispatch) => {
	dispatch({ type: SERVICIO_DETAILS_REQUEST, payload: servicioId });
	try {
		const { data } = await Axios.get(`/api/servicios/${servicioId}`);
		dispatch({ type: SERVICIO_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: SERVICIO_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createServicio =
	(codigo, nombre, area, descripcion, preciobs, preciousd, cambio) =>
	async (dispatch, getState) => {
		dispatch({ type: SERVICIO_CREATE_REQUEST });
		const {
			userSignin: { userInfo },
		} = getState();
		try {
			const { data } = await Axios.post(
				'/api/servicios/create',
				{
					codigo,
					nombre,
					area,
					descripcion,
					preciobs,
					preciousd,
					cambio,
				},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` },
				}
			);

			dispatch({
				type: SERVICIO_CREATE_SUCCESS,
				payload: data,
			});
		} catch (error) {
			const message =
				error.response && error.response.data.message
					? error.response.data.message
					: error.message;
			dispatch({ type: SERVICIO_CREATE_FAIL, payload: message });
		}
	};

export const updateServicio = (servicio) => async (dispatch, getState) => {
	dispatch({ type: SERVICIO_UPDATE_REQUEST, payload: servicio });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = await Axios.put(
			`/api/servicios/${servicio._id}`,
			servicio,
			{
				headers: { Authorization: `Bearer ${userInfo.token}` },
			}
		);
		dispatch({ type: SERVICIO_UPDATE_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: SERVICIO_UPDATE_FAIL, error: message });
	}
};

export const deleteServicio = (servicioId) => async (dispatch, getState) => {
	dispatch({ type: SERVICIO_DELETE_REQUEST, payload: servicioId });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = Axios.delete(`/api/servicios/${servicioId}`, {
			headers: { Authorization: `Bearer ${userInfo.token}` },
		});

		dispatch({ type: SERVICIO_DELETE_SUCCESS });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: SERVICIO_DELETE_FAIL, payload: message });
	}
};

export const allServicios = (fecha1, fecha2) => async (dispatch, getState) => {
	dispatch({ type: SERVICIO_ALL_REQUEST });
	const {
		userSignin: { userInfo },
	} = getState();
	try {
		const { data } = await Axios.get(
			`/api/servicios/all?fecha1=${fecha1}&fecha2=${fecha2}`,
			{
				headers: { Authorization: `Bearer ${userInfo.token}` },
			}
		);
		dispatch({ type: SERVICIO_ALL_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({ type: SERVICIO_ALL_FAIL, payload: message });
	}
};

export const listAllServicios = () => async (dispatch) => {
	dispatch({
		type: SERVICIO_ALL_LIST_REQUEST,
	});
	try {
		const { data } = await Axios.get('/api/servicios/allservices');

		dispatch({ type: SERVICIO_ALL_LIST_SUCCESS, payload: data });
	} catch (error) {
		dispatch({ type: SERVICIO_ALL_LIST_FAIL, payload: error.message });
	}
};
