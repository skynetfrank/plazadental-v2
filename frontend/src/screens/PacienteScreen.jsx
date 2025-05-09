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

  const cloudinaryx = "https://res.cloudinary.com/plazasky/image/upload/v1661258482/odontogramas/";

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
        <span className="font-14 negrita mb-03">{paciente.nombre + " " + paciente.apellido}</span>
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
                    if (alergia === " ") {
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
              ? "No refiere"
              : paciente.antecedentesPersonales.map((bgp, inx) => {
                  if (bgp === "") {
                    return "";
                  }
                  return <p key={inx}>{bgp}</p>;
                })}
          </div>
        </div>
        <div className="division">
          <h4>Referencias Medicas</h4>
          <div className="content">
            <p>
              Tratado por Medico por: {paciente.tratadoPorEnfermedad ? paciente.tratadoPorEnfermedad : "No Refiere"}
            </p>
            <p>Toma Medicamentos: {paciente.medicamentos ? paciente.medicamentos : "No Refiere"}</p>
            <p>Dosis: {paciente.dosis ? paciente.dosis : "No Refiere"}</p>
          </div>
        </div>

        <div className="division">
          <h4>Habitos</h4>
          <div className="content">
            <p>{paciente.habitos ? paciente.habitos : "No Refiere"}</p>
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
          <span>{paciente.contacto ? paciente.contacto : "No Disponible"}</span>
        </div>
        <div className="division">
          <h4>Odontograma</h4>
          {paciente?.idPacienteOld ? (
            <div>
              <Link to={`/odontograma/${paciente.nombre}/${paciente.apellido}/${paciente.idPacienteOld}`}>
                <img
                  className="odograma-small"
                  src={cloudinaryx + paciente.idPacienteOld + ".jpg"}
                  alt="Sin Odontograma Asignado"
                />
              </Link>
            </div>
          ) : (
            <div>
              <Link
                to={`/odontograma/${paciente.nombre}/${paciente.apellido}/${paciente.iPacienteOld}`}
                className="btn-lookalike bg-blue"
              >
                Crear Odontograma
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
