import Axios from "axios";
import {
  CONTROL_CREATE_FAIL,
  CONTROL_CREATE_REQUEST,
  CONTROL_CREATE_SUCCESS,
  CONTROL_DETAILS_FAIL,
  CONTROL_DETAILS_REQUEST,
  CONTROL_DETAILS_SUCCESS,
  CONTROL_UPDATE_REQUEST,
  CONTROL_UPDATE_SUCCESS,
  CONTROL_UPDATE_FAIL,
  CONTROL_DELETE_REQUEST,
  CONTROL_DELETE_FAIL,
  CONTROL_DELETE_SUCCESS,
  CONTROL_BYPACIENTE_REQUEST,
  CONTROL_BYPACIENTE_SUCCESS,
  CONTROL_BYPACIENTE_FAIL,
  CUADREDIA_SUCCESS,
  CUADREDIA_FAIL,
  CUADREDIA_REQUEST,
  GROUPBYDAY_FAIL,
  GROUPBYDAY_SUCCESS,
  GROUPBYDAY_REQUEST,
  CONTROL_CONSOLIDADO_REQUEST,
  CONTROL_CONSOLIDADO_SUCCESS,
  CONTROL_CONSOLIDADO_FAIL,
} from "../constants/controlConstants";

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
    descuento,
    tasaComisionDr,
    tasaComisionPlaza,
    montoComisionDr,
    montoComisionPlaza,
    pago,
    montoLab,
    laboratorio,
    conceptoLaboratorio,
    montoServicios
  ) =>
  async (dispatch, getState) => {
    dispatch({ type: CONTROL_CREATE_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();

    try {
      const { data } = await Axios.post(
        "/api/controles/create",
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
          descuento,
          tasaComisionDr,
          tasaComisionPlaza,
          montoComisionDr,
          montoComisionPlaza,
          pago,
          montoLab,
          laboratorio,
          conceptoLaboratorio,
          montoServicios,
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

export const detailsControl = (controlId) => async (dispatch, getState) => {
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

export const updateControl = (control) => async (dispatch, getState) => {
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

export const deleteControl = (controlId) => async (dispatch, getState) => {
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

export const controlesByPaciente = (pacienteId) => async (dispatch, getState) => {
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

export const groupByDay = () => async (dispatch, getState) => {
  dispatch({ type: GROUPBYDAY_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/controles/groupedbyday", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    console.log("data:", data);
    dispatch({ type: GROUPBYDAY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GROUPBYDAY_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const cuadreDia = (fecha) => async (dispatch, getState) => {
  dispatch({ type: CUADREDIA_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/controles/cuadrediario?fecha=${fecha}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    console.log("data cash server", data);
    dispatch({ type: CUADREDIA_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: CUADREDIA_FAIL, payload: message });
  }
};

export const ventasControls =
  (fecha1 = "18-12-2024", fecha2 = "31-12-2027") =>
  async (dispatch, getState) => {
    //VENTAS CONSOLIDADAS TODAS LAS SUCURSALES DISPONIBLES
    dispatch({ type: CONTROL_CONSOLIDADO_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = await Axios.get(`/api/controles/consolidadoventas?fecha1=${fecha1}&fecha2=${fecha2}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      console.log("action data", data);

      dispatch({ type: CONTROL_CONSOLIDADO_SUCCESS, payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      dispatch({ type: CONTROL_CONSOLIDADO_FAIL, payload: message });
    }
  };
