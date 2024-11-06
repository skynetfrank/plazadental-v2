import Axios from 'axios';
import {
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_UPDATE_EXISTENCIA_FAIL,
  PRODUCT_UPDATE_EXISTENCIA_RESET,
  PRODUCT_UPDATE_EXISTENCIA_SUCCESS,
  PRODUCT_UPDATE_EXISTENCIA_REQUEST,
  PRODUCT_BYCODE_REQUEST,
  PRODUCT_BYCODE_SUCCESS,
  PRODUCT_BYCODE_FAIL,
  PRODUCT_ALL_REQUEST,
  PRODUCT_ALL_SUCCESS,
  PRODUCT_ALL_FAIL,
  PRODUCT_ONLY_CODES_REQUEST,
  PRODUCT_ONLY_CODES_SUCCESS,
  PRODUCT_ONLY_CODES_FAIL,
} from '../constants/productConstants';

export const listProducts =
  ({ nombre = '', pageNumber = '' }) =>
  async dispatch => {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });
    try {
      const { data } = await Axios.get(`/api/productos?pageNumber=${pageNumber}&nombre=${nombre}`);

      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
    }
  };

export const detailsProduct = productId => async dispatch => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
  try {
    const { data } = await Axios.get(`/api/productos/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const createProduct =
  (
    codigo,
    nombre,
    marca,
    presentacion,
    unidades,
    descripcion,
    existencia,
    reposicion,
    costobs,
    costousd,
    preciobs,
    preciousd,
    proveedor,
    imageurl
  ) =>
  async (dispatch, getState) => {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = await Axios.post(
        '/api/productos/create',
        {
          codigo,
          nombre,
          marca,
          presentacion,
          unidades,
          descripcion,
          existencia,
          reposicion,
          costobs,
          costousd,
          preciobs,
          preciousd,
          proveedor,
          imageurl,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: PRODUCT_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
    }
  };

export const updateProduct = product => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/productos/${product._id}`, product, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_UPDATE_FAIL, error: message });
  }
};

export const deleteProduct = productId => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/productos/${productId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: message });
  }
};

export const updateExistencia = item => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_UPDATE_EXISTENCIA_REQUEST, payload: item });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/productos/existencia/${item.idProducto}`, item, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_UPDATE_EXISTENCIA_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_UPDATE_EXISTENCIA_FAIL, error: message });
  }
};

export const getProductoByCode = codigo => async dispatch => {
  dispatch({ type: PRODUCT_BYCODE_REQUEST, payload: codigo });
  try {
    const { data } = await Axios.get(`/api/productos/encontrar?codigo=${codigo}`);
    dispatch({ type: PRODUCT_BYCODE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_BYCODE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const allProducts = (fecha1, fecha2) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_ALL_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/productos/all?fecha1=${fecha1}&fecha2=${fecha2}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_ALL_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_ALL_FAIL, payload: message });
  }
};

export const onlyCodes = () => async dispatch => {
  dispatch({
    type: PRODUCT_ONLY_CODES_REQUEST,
  });
  try {
    const { data } = await Axios.get('/api/productos/onlycodes');
    dispatch({ type: PRODUCT_ONLY_CODES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_ONLY_CODES_FAIL, payload: error.message });
  }
};
