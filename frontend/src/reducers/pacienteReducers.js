import {
  PACIENTE_LIST_REQUEST,
  PACIENTE_LIST_SUCCESS,
  PACIENTE_LIST_FAIL,
  PACIENTE_DETAILS_REQUEST,
  PACIENTE_DETAILS_SUCCESS,
  PACIENTE_DETAILS_FAIL,
  PACIENTE_DETAILS_RESET,
  PACIENTE_CREATE_REQUEST,
  PACIENTE_CREATE_SUCCESS,
  PACIENTE_CREATE_FAIL,
  PACIENTE_CREATE_RESET,
  PACIENTE_UPDATE_REQUEST,
  PACIENTE_UPDATE_SUCCESS,
  PACIENTE_UPDATE_FAIL,
  PACIENTE_UPDATE_RESET,
  PACIENTE_DELETE_REQUEST,
  PACIENTE_DELETE_SUCCESS,
  PACIENTE_DELETE_FAIL,
  PACIENTE_DELETE_RESET,
  PACIENTE_ALL_REQUEST,
  PACIENTE_ALL_SUCCESS,
  PACIENTE_ALL_FAIL,
  PACIENTE_ADDCONTROL_REQUEST,
  PACIENTE_ADDCONTROL_SUCCESS,
  PACIENTE_ADDCONTROL_FAIL,
  PACIENTE_ADDCONTROL_RESET,
  PACIENTE_DELETECONTROL_REQUEST,
  PACIENTE_DELETECONTROL_SUCCESS,
  PACIENTE_DELETECONTROL_FAIL,
  PACIENTE_DELETECONTROL_RESET,
} from "../constants/pacienteConstants";

export const pacienteCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PACIENTE_CREATE_REQUEST:
      return { loading: true };
    case PACIENTE_CREATE_SUCCESS:
      return { loading: false, success: true, paciente: action.payload };
    case PACIENTE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PACIENTE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const pacienteListReducer = (state = { loading: true, pacientes: [] }, action) => {
  switch (action.type) {
    case PACIENTE_LIST_REQUEST:
      return { loading: true };
    case PACIENTE_LIST_SUCCESS:
      return {
        loading: false,
        pacientes: action.payload.pacientes,
      };
    case PACIENTE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const pacienteDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PACIENTE_DETAILS_REQUEST:
      return { loading: true };
    case PACIENTE_DETAILS_SUCCESS:
      return { loading: false, paciente: action.payload };
    case PACIENTE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case PACIENTE_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const pacienteUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PACIENTE_UPDATE_REQUEST:
      return { loading: true };
    case PACIENTE_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case PACIENTE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PACIENTE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const pacienteDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PACIENTE_DELETE_REQUEST:
      return { loading: true };
    case PACIENTE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PACIENTE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case PACIENTE_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const pacienteAllReducer = (state = { pacientes: [] }, action) => {
  switch (action.type) {
    case PACIENTE_ALL_REQUEST:
      return { loading: true };
    case PACIENTE_ALL_SUCCESS:
      return { loading: false, pacientes: action.payload.pacientes };
    case PACIENTE_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const pacienteAddControlReducer = (state = {}, action) => {
  switch (action.type) {
    case PACIENTE_ADDCONTROL_REQUEST:
      return { loading: true };
    case PACIENTE_ADDCONTROL_SUCCESS:
      return { loading: false, success: true };
    case PACIENTE_ADDCONTROL_FAIL:
      return { loading: false, error: action.payload };
    case PACIENTE_ADDCONTROL_RESET:
      return {};
    default:
      return state;
  }
};

export const pacienteDeleteControlReducer = (state = {}, action) => {
  switch (action.type) {
    case PACIENTE_DELETECONTROL_REQUEST:
      return { loading: true };
    case PACIENTE_DELETECONTROL_SUCCESS:
      return { loading: false, success: true };
    case PACIENTE_DELETECONTROL_FAIL:
      return { loading: false, error: action.payload };
    case PACIENTE_DELETECONTROL_RESET:
      return {};
    default:
      return state;
  }
};
