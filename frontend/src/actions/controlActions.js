import Axios from 'axios';
import {
  CONTROL_CREATE_FAIL,
  CONTROL_CREATE_REQUEST,
  CONTROL_CREATE_SUCCESS,
  CONTROL_CREATE_RESET,
  CONTROL_DETAILS_FAIL,
  CONTROL_DETAILS_REQUEST,
  CONTROL_DETAILS_SUCCESS,
  CONTROL_DETAILS_RESET,
  CONTROL_LIST_FAIL,
  CONTROL_LIST_REQUEST,
  CONTROL_LIST_SUCCESS,
  CONTROL_LIST_RESET,
  CONTROL_UPDATE_REQUEST,
  CONTROL_UPDATE_SUCCESS,
  CONTROL_UPDATE_FAIL,
  CONTROL_UPDATE_RESET,
  CONTROL_DELETE_REQUEST,
  CONTROL_DELETE_FAIL,
  CONTROL_DELETE_SUCCESS,
  CONTROL_DELETE_RESET,
  CONTROL_BYPACIENTE_REQUEST,
  CONTROL_BYPACIENTE_SUCCESS,
  CONTROL_BYPACIENTE_FAIL,
} from '../constants/controlConstants';

export const createControl =
  (
    pacienteId,
    doctorId,
    user,
    fechaControl,
    esCita1,
    evaluacion,
    tratamiento,
    recipe,
    indicaciones,
    serviciosItems,
    materiales,
    cambioBcv,
    montoUsd,
    montoBs,
    tasaIva,
    montoIva,
    totalGeneralBs,
    tasaComisionDr,
    tasaComisionPlaza,
    montoComisionDr,
    montoComisionPlaza,
    pagoInfo,
    factura,
    facturaControl,
    fechaFactura
  ) =>
    async (dispatch, getState) => {
      dispatch({ type: CONTROL_CREATE_REQUEST });
      const {
        userSignin: { userInfo },
      } = getState();

      try {
        const { data } = await Axios.post(
          '/api/controles/create',
          {
            pacienteId,
            doctorId,
            user,
            fechaControl,
            esCita1,
            evaluacion,
            tratamiento,
            recipe,
            indicaciones,
            serviciosItems,
            materiales,
            cambioBcv,
            montoUsd,
            montoBs,
            tasaIva,
            montoIva,
            totalGeneralBs,
            tasaComisionDr,
            tasaComisionPlaza,
            montoComisionDr,
            montoComisionPlaza,
            pagoInfo,
            factura,
            facturaControl,
            fechaFactura,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({
          type: CONTROL_CREATE_SUCCESS,
          payload: data,
        });
      } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: CONTROL_CREATE_FAIL, payload: message });
      }
    };

export const detailsControl = controlId => async (dispatch, getState) => {
  dispatch({ type: CONTROL_DETAILS_REQUEST, payload: controlId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/controles/${controlId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: CONTROL_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CONTROL_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const updateControl = control => async (dispatch, getState) => {
  dispatch({ type: CONTROL_UPDATE_REQUEST, payload: control });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/controles/${control._id}`, control, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: CONTROL_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: CONTROL_UPDATE_FAIL, error: message });
  }
};

export const deleteControl = controlId => async (dispatch, getState) => {
  dispatch({ type: CONTROL_DELETE_REQUEST, payload: controlId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/controles/${controlId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: CONTROL_DELETE_SUCCESS });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: CONTROL_DELETE_FAIL, payload: message });
  }
};

export const controlesByPaciente = pacienteId => async (dispatch, getState) => {
  dispatch({ type: CONTROL_BYPACIENTE_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/controles/controlesporpaciente/${pacienteId},`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: CONTROL_BYPACIENTE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: CONTROL_BYPACIENTE_FAIL, payload: message });
  }
};
