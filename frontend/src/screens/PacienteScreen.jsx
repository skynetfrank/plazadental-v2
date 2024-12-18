import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { detailsPaciente } from "../actions/pacienteActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import dayjs from "dayjs";
import PacienteInfoIcon from "../icons/PacienteInfoIcon";

export default function PacienteScreen(props) {
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
    <div className="flx column ">
      <div className="paciente-info-container font-12">
        <PacienteInfoIcon />
        <span className="font-14 negrita">{paciente.nombre + " " + paciente.apellido}</span>
        <span>{paciente.cedula + " - " + paciente.genero}</span>
        <span>{dayjs(new Date(paciente.Nacimiento)).format("DD/MM/YYYY") + " - " + paciente.edad + " años "}</span>
        <span>{paciente.estadoCivil + " " + paciente.peso + " Kgs - " + paciente.estatura + " Mts"}</span>
        <Link to={`/controles/${paciente._id}`} className="btn-lookalike bg-blue">
          Ver Controles de Consultas
        </Link>
        <span className="division"></span>
        <div className="flx column division">
          <h4>Direccion y Telefono</h4>
          <span>{paciente.direccion}</span>
          <span>{paciente.celular + " " + paciente.telefono}</span>
          <span>{paciente.email}</span>
          <span>{paciente.contacto}</span>
        </div>

        <div className="division">
          <h4>Alergias</h4>
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
            {paciente.otrasAlergias ? (
              <div>
                <p>Otras Alergias</p>
                <span>{paciente.otrasAlergias}</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="division">
          <h4>Antecedentes Personales</h4>
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
          <h4>Antecedentes Familiares</h4>
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
        <div className="flx column division">
          <h4>Contacto</h4>
          <span>{paciente.contacto}</span>
        </div>
      </div>
    </div>
  );
}
