import {
  DOCTOR_LIST_REQUEST,
  DOCTOR_LIST_SUCCESS,
  DOCTOR_LIST_FAIL,
  DOCTOR_DETAILS_REQUEST,
  DOCTOR_DETAILS_SUCCESS,
  DOCTOR_DETAILS_FAIL,
  DOCTOR_CREATE_REQUEST,
  DOCTOR_CREATE_SUCCESS,
  DOCTOR_CREATE_FAIL,
  DOCTOR_CREATE_RESET,
  DOCTOR_UPDATE_REQUEST,
  DOCTOR_UPDATE_SUCCESS,
  DOCTOR_UPDATE_FAIL,
  DOCTOR_UPDATE_RESET,
  DOCTOR_DELETE_REQUEST,
  DOCTOR_DELETE_SUCCESS,
  DOCTOR_DELETE_FAIL,
  DOCTOR_DELETE_RESET,
} from "../constants/doctorConstants";

export const doctorCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_CREATE_REQUEST:
      return { loading: true };
    case DOCTOR_CREATE_SUCCESS:
      return { loading: false, success: true, doctor: action.payload };
    case DOCTOR_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const doctorListReducer = (state = { loading: true, doctores: [] }, action) => {
  switch (action.type) {
    case DOCTOR_LIST_REQUEST:
      return { loading: true };
    case DOCTOR_LIST_SUCCESS:
      return {
        loading: false,
        doctores: action.payload.doctores,
        pages: action.payload.pages,
        page: action.payload.page,
        count: action.payload.count,
      };
    case DOCTOR_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case DOCTOR_DETAILS_REQUEST:
      return { loading: true };
    case DOCTOR_DETAILS_SUCCESS:
      return { loading: false, doctor: action.payload };
    case DOCTOR_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_UPDATE_REQUEST:
      return { loading: true };
    case DOCTOR_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case DOCTOR_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
export const doctorDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_DELETE_REQUEST:
      return { loading: true };
    case DOCTOR_DELETE_SUCCESS:
      return { loading: false, success: true };
    case DOCTOR_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
