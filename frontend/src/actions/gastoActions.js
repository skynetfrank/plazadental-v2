import Axios from "axios";
import {
  GASTO_CREATE_FAIL,
  GASTO_CREATE_REQUEST,
  GASTO_CREATE_SUCCESS,
  GASTO_DETAILS_FAIL,
  GASTO_DETAILS_REQUEST,
  GASTO_DETAILS_SUCCESS,
  GASTO_LIST_FAIL,
  GASTO_LIST_REQUEST,
  GASTO_LIST_SUCCESS,
  GASTO_UPDATE_REQUEST,
  GASTO_UPDATE_SUCCESS,
  GASTO_UPDATE_FAIL,
  GASTO_DELETE_REQUEST,
  GASTO_DELETE_FAIL,
  GASTO_DELETE_SUCCESS,
} from "../constants/gastoConstants";

export const listGastos = () => async (dispatch) => {
  dispatch({
    type: GASTO_LIST_REQUEST,
  });
  try {
    const { data } = await Axios.get(`/api/gastos`);
    dispatch({ type: GASTO_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GASTO_LIST_FAIL, payload: error.message });
  }
};

export const detailsGasto = (GastoId) => async (dispatch) => {
  dispatch({ type: GASTO_DETAILS_REQUEST, payload: GastoId });
  try {
    const { data } = await Axios.get(`/api/gastos/${GastoId}`);
    dispatch({ type: GASTO_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GASTO_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createGasto =
  (
    fecha,
    referencia,
    formadepago,
    banco,
    categoria,
    beneficiario,
    descripcion,
    montousd,
    montobs,
    cambiodia,
    registradopor,
    imageurl,
    imageurl2
  ) =>
    async (dispatch, getState) => {
      dispatch({ type: GASTO_CREATE_REQUEST });
      const {
        userSignin: { userInfo },
      } = getState();

      try {
        const { data } = await Axios.post(
          "/api/gastos/create",
          {
            fecha,
            referencia,
            formadepago,
            banco,
            categoria,
            beneficiario,
            descripcion,
            montousd,
            montobs,
            cambiodia,
            registradopor,
            imageurl,
            imageurl2,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({
          type: GASTO_CREATE_SUCCESS,
          payload: data,
        });
        console.log("actions data gastos:", data)
      } catch (error) {
        const message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({ type: GASTO_CREATE_FAIL, payload: message });
      }
    };

export const updateGasto = (gasto) => async (dispatch, getState) => {
  dispatch({ type: GASTO_UPDATE_REQUEST, payload: gasto });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/gastos/${gasto._id}`, gasto, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: GASTO_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: GASTO_UPDATE_FAIL, error: message });
  }
};

export const deleteGasto = (gastoId) => async (dispatch, getState) => {
  dispatch({ type: GASTO_DELETE_REQUEST, payload: gastoId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/gastos/${gastoId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: GASTO_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: GASTO_DELETE_FAIL, payload: message });
  }
};
