import {
  SERVICIO_LIST_REQUEST,
  SERVICIO_LIST_SUCCESS,
  SERVICIO_LIST_FAIL,
  SERVICIO_DETAILS_REQUEST,
  SERVICIO_DETAILS_SUCCESS,
  SERVICIO_DETAILS_FAIL,
  SERVICIO_CREATE_REQUEST,
  SERVICIO_CREATE_SUCCESS,
  SERVICIO_CREATE_FAIL,
  SERVICIO_CREATE_RESET,
  SERVICIO_UPDATE_REQUEST,
  SERVICIO_UPDATE_SUCCESS,
  SERVICIO_UPDATE_FAIL,
  SERVICIO_UPDATE_RESET,
  SERVICIO_DELETE_REQUEST,
  SERVICIO_DELETE_SUCCESS,
  SERVICIO_DELETE_FAIL,
  SERVICIO_DELETE_RESET,
  SERVICIO_BYCODE_REQUEST,
  SERVICIO_BYCODE_SUCCESS,
  SERVICIO_BYCODE_FAIL,
  SERVICIO_BYCODE_RESET,
  SERVICIO_ALL_REQUEST,
  SERVICIO_ALL_SUCCESS,
  SERVICIO_ALL_FAIL,
  SERVICIO_ONLY_CODES_REQUEST,
  SERVICIO_ONLY_CODES_SUCCESS,
  SERVICIO_ONLY_CODES_FAIL,
  SERVICIO_ALL_LIST_REQUEST,
  SERVICIO_ALL_LIST_SUCCESS,
  SERVICIO_ALL_LIST_FAIL,
} from "../constants/servicioConstants";

export const servicioCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICIO_CREATE_REQUEST:
      return { loading: true };
    case SERVICIO_CREATE_SUCCESS:
      return { loading: false, success: true, servicio: action.payload };
    case SERVICIO_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case SERVICIO_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const servicioListReducer = (state = { loading: true, servicios: [] }, action) => {
  switch (action.type) {
    case SERVICIO_LIST_REQUEST:
      return { loading: true };
    case SERVICIO_LIST_SUCCESS:
      return {
        loading: false,
        servicios: action.payload.servicios,
        pages: action.payload.pages,
        page: action.payload.page,
        count: action.payload.count,
      };
    case SERVICIO_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const servicioDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case SERVICIO_DETAILS_REQUEST:
      return { loading: true };
    case SERVICIO_DETAILS_SUCCESS:
      return { loading: false, servicio: action.payload };
    case SERVICIO_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const servicioUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICIO_UPDATE_REQUEST:
      return { loading: true };
    case SERVICIO_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case SERVICIO_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case SERVICIO_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
export const servicioDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICIO_DELETE_REQUEST:
      return { loading: true };
    case SERVICIO_DELETE_SUCCESS:
      return { loading: false, success: true };
    case SERVICIO_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case SERVICIO_DELETE_RESET:
      return {};
    default:
      return state;
  }
};


export const getServiciobyCodeReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case SERVICIO_BYCODE_REQUEST:
      return { loading: true };
    case SERVICIO_BYCODE_SUCCESS:
      return { loading: false, success: true, servicioso: action.payload };
    case SERVICIO_BYCODE_FAIL:
      return { loading: false, error: action.payload };
    case SERVICIO_BYCODE_RESET:
      return { error: false, servicios: {} };
    default:
      return state;
  }
};

export const servicioAllReducer = (state = { servicios: [] }, action) => {
  switch (action.type) {
    case SERVICIO_ALL_REQUEST:
      return { loading: true };
    case SERVICIO_ALL_SUCCESS:
      return { loading: false, servicios: action.payload.servicios };
    case SERVICIO_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const servicioOnlyCodesReducer = (state = { loading: true, codigos: [] }, action) => {
  switch (action.type) {
    case SERVICIO_ONLY_CODES_REQUEST:
      return { loading: true };
    case SERVICIO_ONLY_CODES_SUCCESS:
      let codigos = action.payload.codigos;
      codigos.unshift({ codigo: " " });
      return {
        loading: false,
        codigos: codigos,
      };
    case SERVICIO_ONLY_CODES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const servicioAllListReducer = (state = { loading: true, servicios: [] }, action) => {
  switch (action.type) {
    case SERVICIO_ALL_LIST_REQUEST:
      return { loading: true };
    case SERVICIO_ALL_LIST_SUCCESS:
      return {
        loading: false,
        servicios: action.payload.servicios,
      };
    case SERVICIO_ALL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
