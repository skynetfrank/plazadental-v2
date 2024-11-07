import Axios from "axios";
import {
  PACIENTE_CREATE_FAIL,
  PACIENTE_CREATE_REQUEST,
  PACIENTE_CREATE_SUCCESS,
  PACIENTE_DETAILS_FAIL,
  PACIENTE_DETAILS_REQUEST,
  PACIENTE_DETAILS_SUCCESS,
  PACIENTE_LIST_FAIL,
  PACIENTE_LIST_REQUEST,
  PACIENTE_LIST_SUCCESS,
  PACIENTE_UPDATE_REQUEST,
  PACIENTE_UPDATE_SUCCESS,
  PACIENTE_UPDATE_FAIL,
  PACIENTE_DELETE_REQUEST,
  PACIENTE_DELETE_FAIL,
  PACIENTE_DELETE_SUCCESS,
  PACIENTE_ALL_REQUEST,
  PACIENTE_ALL_SUCCESS,
  PACIENTE_ALL_FAIL,
  PACIENTE_ADDCONTROL_REQUEST,
  PACIENTE_ADDCONTROL_SUCCESS,
  PACIENTE_ADDCONTROL_FAIL,
  PACIENTE_DELETECONTROL_REQUEST,
  PACIENTE_DELETECONTROL_SUCCESS,
  PACIENTE_DELETECONTROL_FAIL,
} from "../constants/pacienteConstants";

export const createPaciente =
  (
    nombre,
    apellido,
    cedula,
    nombrerepresentante,
    apellidorepresentante,
    cedularepresentante,
    genero,
    estadoCivil,
    Nacimiento,
    edad,
    peso,
    estatura,
    direccion,
    celular,
    telefono,
    email,
    contacto,
    alergias,
    otrasAlergias,
    isAlergicoOtros,
    antecedentesPersonales,
    antecedentesFamiliares,
    isTratadoPorMedico,
    tratadoPorEnfermedad,
    isOtraEnfermedad,
    otraEnfermedad,
    isTomaMedicamentos,
    medicamentos,
    dosismeds,
    isHabitos,
    habitos,
    motivoEstaConsulta,
    motivoUltimaConsulta,
    fechaUltimaconsulta,
    isComplicaciones,
    complicaciones,
    odontogramaUrl,
    idOdontoImgName,
    controles
  ) =>
    async (dispatch, getState) => {
      dispatch({ type: PACIENTE_CREATE_REQUEST });
      const {
        userSignin: { userInfo },
      } = getState();
      try {
        const { data } = await Axios.post(
          "/api/pacientes/create",
          {
            nombre,
            apellido,
            cedula,
            nombrerepresentante,
            apellidorepresentante,
            cedularepresentante,
            genero,
            estadoCivil,
            Nacimiento,
            edad,
            peso,
            estatura,
            direccion,
            celular,
            telefono,
            email,
            contacto,
            alergias,
            otrasAlergias,
            isAlergicoOtros,
            antecedentesPersonales,
            antecedentesFamiliares,
            isTratadoPorMedico,
            tratadoPorEnfermedad,
            isOtraEnfermedad,
            otraEnfermedad,
            isTomaMedicamentos,
            medicamentos,
            dosismeds,
            isHabitos,
            habitos,
            motivoEstaConsulta,
            motivoUltimaConsulta,
            fechaUltimaconsulta,
            isComplicaciones,
            complicaciones,
            odontogramaUrl,
            idOdontoImgName,
            controles,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({
          type: PACIENTE_CREATE_SUCCESS,
          payload: data,
        });
      } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: PACIENTE_CREATE_FAIL, payload: message });
      }
    };

export const listPacientes =
  () =>
    async (dispatch) => {
      dispatch({
        type: PACIENTE_LIST_REQUEST,
      });
      try {
        const { data } = await Axios.get("/api/pacientes");

        dispatch({ type: PACIENTE_LIST_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: PACIENTE_LIST_FAIL, payload: error.message });
      }
    };

export const detailsPaciente = (pacienteId) => async (dispatch) => {
  dispatch({ type: PACIENTE_DETAILS_REQUEST, payload: pacienteId });
  try {
    const { data } = await Axios.get(`/api/pacientes/${pacienteId}`);
    dispatch({ type: PACIENTE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PACIENTE_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const updatePaciente = (paciente) => async (dispatch, getState) => {
  dispatch({ type: PACIENTE_UPDATE_REQUEST, payload: paciente });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/pacientes/${paciente._id}`, paciente, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PACIENTE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PACIENTE_UPDATE_FAIL, error: message });
  }
};

export const deletePaciente = (pacienteId) => async (dispatch, getState) => {
  dispatch({ type: PACIENTE_DELETE_REQUEST, payload: pacienteId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/pacientes/${pacienteId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: PACIENTE_DELETE_SUCCESS });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PACIENTE_DELETE_FAIL, payload: message });
  }
};

export const allPacientes = (fecha1, fecha2) => async (dispatch, getState) => {
  dispatch({ type: PACIENTE_ALL_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/pacientes/all?fecha1=${fecha1}&fecha2=${fecha2}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PACIENTE_ALL_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PACIENTE_ALL_FAIL, payload: message });
  }
};

export const addControlPaciente = (pacienteId, control) => async (dispatch, getState) => {
  dispatch({ type: PACIENTE_ADDCONTROL_REQUEST, payload: control });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/pacientes/addcontrol/${pacienteId}`, control, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PACIENTE_ADDCONTROL_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PACIENTE_ADDCONTROL_FAIL, error: message });
  }
};

export const deleteControlPaciente = (pacienteId, control) => async (dispatch, getState) => {
  dispatch({ type: PACIENTE_DELETECONTROL_REQUEST, payload: control });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/pacientes/deletecontrol/${pacienteId}`, control, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PACIENTE_DELETECONTROL_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PACIENTE_DELETECONTROL_FAIL, error: message });
  }
};

/* 

nombre           	                    
apellido								
cedula									
genero									
estadoCivil								
Nacimiento								
edad									
peso									
direccion								
celular									
telefono								
email									
contacto								
alergias								
otrasAlergias							
antecedentesPersonales					
antecedentesFamiliares					
IsTratadoPorMedico						
tratadoPorEnfermedad					
otraEnfermedad							
IsTomaMedicamentos						
medicamentos							
dosismeds								
habitos									
motivoEstaConsulta						
motivoUltimaConsulta					
fechaUltimaconsulta						
IsComplicaciones						
complicaciones							
odontogramaUrl							 */
