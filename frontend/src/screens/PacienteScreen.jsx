import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { detailsPaciente } from "../actions/pacienteActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import dayjs from "dayjs";
import { faAllergies, faHandHoldingMedical, faHouseMedicalCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PacientesIcon from "../icons/PacientesIcon";
import PacienteInfoIcon from "../icons/PacienteInfoIcon";

export default function PacienteScreen(props) {
  const navigate = useNavigate();
  const params = useParams();
  const { id: pacienteId } = params;

  const pacienteDetails = useSelector((state) => state.pacienteDetails);
  const { paciente, loading, error } = pacienteDetails;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!paciente || (paciente && paciente._id !== pacienteId)) {
      dispatch(detailsPaciente(pacienteId));
    }
  }, [dispatch, pacienteId, paciente]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="flx column " >
      <div className="paciente-info-container font-12">
        <PacienteInfoIcon />
        <span className="font-14 negrita">{paciente.nombre + " " + paciente.apellido}</span>
        <span>{paciente.cedula + " - " + paciente.telefono + " " + paciente.celular}</span>
        <span>{dayjs(new Date(paciente.Nacimiento)).format("DD/MM/YYYY") + " - " + paciente.edad + " años "}</span>
        <span>{paciente.genero + " " + paciente.estadoCivil}</span>
        <span>{paciente.peso + " Kgs - " + paciente.estatura + " Mts"}</span>
        <span>{paciente.email}</span>
        <span>{paciente.contacto}</span>
        <span className="division">{paciente.direccion}</span>

        <div className="division">
          <span>Alergias:</span>
          <div className="content">
            <p>
              {paciente.alergias.every((elem) => elem === " ")
                ? "No Refiere"
                : paciente.alergias.map((alergia) => {
                  if (alergia === "") {
                    return "";
                  }
                  return alergia + ", ";
                })}
            </p>
            <div className="datos">
              <p>Otras Alergias:</p>
              <span>{paciente.otrasAlergias}</span>
            </div>
          </div>
        </div>
        <div className="division">
          <span>Antecedentes Personales:</span>
          <div className="content">
            {paciente.antecedentesPersonales.every((elem) => elem === "")
              ? "No Refiere"
              : paciente.antecedentesPersonales.map((bgp, inx) => {
                if (bgp === "") {
                  return "";
                }
                return <p key={inx}>{bgp}</p>;
              })}
            <p>Tratado por Medico por: {paciente.tratadoPorEnfermedad}</p>
            <p>Toma Medicamentos: {paciente.medicamentos}</p>
            <p>Dosis: {paciente.dosis}</p>
            <p>Habitos: {paciente.habitos}</p>
          </div>
        </div>
        <div className="division">
          <span>Antecedentes Familiares:</span>
          <div className="content">
            <p>
              {paciente.antecedentesFamiliares.every((elem) => elem === " ")
                ? "No Refiere"
                : paciente.antecedentesFamiliares.map((bgf) => {
                  if (bgf === "") {
                    return "";
                  }
                  return bgf + " ";
                })}
            </p>
          </div>
        </div>
        <Link to={`/controles/${paciente._id}`} className="btn-lookalike bg-blue">
          Ver Controles de Consultas
        </Link>
      </div>
    </div>
  );
}
