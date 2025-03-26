import {
  CONTROL_LIST_REQUEST,
  CONTROL_LIST_SUCCESS,
  CONTROL_LIST_FAIL,
  CONTROL_DETAILS_REQUEST,
  CONTROL_DETAILS_SUCCESS,
  CONTROL_DETAILS_FAIL,
  CONTROL_CREATE_REQUEST,
  CONTROL_CREATE_SUCCESS,
  CONTROL_CREATE_FAIL,
  CONTROL_CREATE_RESET,
  CONTROL_UPDATE_REQUEST,
  CONTROL_UPDATE_SUCCESS,
  CONTROL_UPDATE_FAIL,
  CONTROL_UPDATE_RESET,
  CONTROL_DELETE_REQUEST,
  CONTROL_DELETE_SUCCESS,
  CONTROL_DELETE_FAIL,
  CONTROL_DELETE_RESET,
  CONTROL_BYPACIENTE_REQUEST,
  CONTROL_BYPACIENTE_SUCCESS,
  CONTROL_BYPACIENTE_FAIL,
  CUADREDIA_FAIL,
  CUADREDIA_SUCCESS,
  CUADREDIA_REQUEST,
  GROUPBYDAY_REQUEST,
  GROUPBYDAY_SUCCESS,
  GROUPBYDAY_FAIL,
  CONTROL_CONSOLIDADO_REQUEST,
  CONTROL_CONSOLIDADO_SUCCESS,
  CONTROL_CONSOLIDADO_FAIL,
  CONTROL_ABONO_REQUEST,
  CONTROL_ABONO_SUCCESS,
  CONTROL_ABONO_FAIL,
  CONTROL_ABONO_RESET,
} from "../constants/controlConstants";

export const controlCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CONTROL_CREATE_REQUEST:
      return { loading: true };
    case CONTROL_CREATE_SUCCESS:
      return { loading: false, success: true, control: action.payload };
    case CONTROL_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case CONTROL_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const controlDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case CONTROL_DETAILS_REQUEST:
      return { loading: true };
    case CONTROL_DETAILS_SUCCESS:
      return { loading: false, control: action.payload };
    case CONTROL_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const controlUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case CONTROL_UPDATE_REQUEST:
      return { loading: true };
    case CONTROL_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case CONTROL_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case CONTROL_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
export const controlDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case CONTROL_DELETE_REQUEST:
      return { loading: true };
    case CONTROL_DELETE_SUCCESS:
      return { loading: false, success: true };
    case CONTROL_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case CONTROL_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const controlesByPacienteReducer = (state = { loading: true, controles: [] }, action) => {
  switch (action.type) {
    case CONTROL_BYPACIENTE_REQUEST:
      return { loading: true };
    case CONTROL_BYPACIENTE_SUCCESS:
      return {
        loading: false,
        controls: action.payload.controles,
        pages: action.payload.pages,
        page: action.payload.page,
        count: action.payload.count,
      };
    case CONTROL_BYPACIENTE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderGroupByDayReducer = (state = { loading: true, dailyControles: {} }, action) => {
  switch (action.type) {
    case GROUPBYDAY_REQUEST:
      return { loading: true };
    case GROUPBYDAY_SUCCESS:
      return { loading: false, dailyControles: action.payload };
    case GROUPBYDAY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const cuadreDiaReducer = (
  state = {
    controles: [],
    abonos: [],
    cash: {},
    puntoPlaza: [],
    puntoVenezuela: [],
    puntoBanesco: [],
  },

  action
) => {
  switch (action.type) {
    case CUADREDIA_REQUEST:
      return { loading: true };
    case CUADREDIA_SUCCESS:
      return {
        loading: false,
        controles: action.payload.controles,
        abonos: action.payload.abonos,
        cash: action.payload.cash[0],
        puntoPlaza: action.payload.puntoPlaza,
        puntoVenezuela: action.payload.puntoVenezuela,
        puntoBanesco: action.payload.puntoBanesco,
      };
    case CUADREDIA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ventasControlsReducer = (state = { ventas: [] }, action) => {
  switch (action.type) {
    case CONTROL_CONSOLIDADO_REQUEST:
      return { loading: true };
    case CONTROL_CONSOLIDADO_SUCCESS:
      return {
        loading: false,
        ventas: action.payload,
      };
    case CONTROL_CONSOLIDADO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const controlAbonoReducer = (state = {}, action) => {
  switch (action.type) {
    case CONTROL_ABONO_REQUEST:
      return { loading: true };
    case CONTROL_ABONO_SUCCESS:
      return { loading: false, success: true };
    case CONTROL_ABONO_FAIL:
      return { loading: false, error: action.payload };
    case CONTROL_ABONO_RESET:
      return {};
    default:
      return state;
  }
};


export const controlListReducer = (state = { loading: true, controles: [] }, action) => {
  switch (action.type) {
    case CONTROL_LIST_REQUEST:
      return { loading: true };
    case CONTROL_LIST_SUCCESS:
      return {
        loading: false,
        controles: action.payload.controles,
      };
    case CONTROL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

