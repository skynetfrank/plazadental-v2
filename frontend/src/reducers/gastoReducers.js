import {
  GASTO_LIST_REQUEST,
  GASTO_LIST_SUCCESS,
  GASTO_LIST_FAIL,
  GASTO_DETAILS_REQUEST,
  GASTO_DETAILS_SUCCESS,
  GASTO_DETAILS_FAIL,
  GASTO_CREATE_REQUEST,
  GASTO_CREATE_SUCCESS,
  GASTO_CREATE_FAIL,
  GASTO_CREATE_RESET,
  GASTO_UPDATE_REQUEST,
  GASTO_UPDATE_SUCCESS,
  GASTO_UPDATE_FAIL,
  GASTO_UPDATE_RESET,
  GASTO_DELETE_REQUEST,
  GASTO_DELETE_SUCCESS,
  GASTO_DELETE_FAIL,
  GASTO_DELETE_RESET,
  GASTO_LIST_RESET,

} from "../constants/gastoConstants";

export const gastoCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case GASTO_CREATE_REQUEST:
      return { loading: true };
    case GASTO_CREATE_SUCCESS:
      console.log("reducer action.payload", action.payload)
      return { loading: false, success: true, gasto: action.payload };
    case GASTO_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case GASTO_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const gastoListReducer = (state = { loading: true, gastos: [] }, action) => {
  switch (action.type) {
    case GASTO_LIST_REQUEST:
      return { loading: true };
    case GASTO_LIST_SUCCESS:
      return {
        loading: false,
        gastos: action.payload.gastos,
        pages: action.payload.pages,
        page: action.payload.page,
        count: action.payload.count,
      };
    case GASTO_LIST_FAIL:
      return { loading: false, error: action.payload };
    case GASTO_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const gastoDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case GASTO_DETAILS_REQUEST:
      return { loading: true };
    case GASTO_DETAILS_SUCCESS:
      return { loading: false, gasto: action.payload };
    case GASTO_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const gastoUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case GASTO_UPDATE_REQUEST:
      return { loading: true };
    case GASTO_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case GASTO_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case GASTO_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
export const gastoDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case GASTO_DELETE_REQUEST:
      return { loading: true };
    case GASTO_DELETE_SUCCESS:
      return { loading: false, success: true };
    case GASTO_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case GASTO_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
