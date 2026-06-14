import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listDoctores } from "../actions/doctorActions";
import { listServicios } from "../actions/servicioActions";
import DoctorIcon from "../icons/DoctorIcon";
import PacientesIcon from "../icons/PacientesIcon";
import HandDollarIcon from "../icons/HandDollarIcon";
import CalendarioIcon from "../icons/CalendarioIcon";
import CardDollarIcon from "../icons/CardDollarIcon";
import ToothPasteIcon from "../icons/ToothPasteIcon";
import SpreadSheetIcon from "../icons/SpreadSheetIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopFile } from "@fortawesome/free-solid-svg-icons";
import { Outpatient } from "../icons/Outpatient";
import { StockIcon } from "../icons/StockIcon";

function HomeScreen() {
  const dispatch = useDispatch();
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const doctorList = useSelector((state) => state.doctorList) || {};
  const { doctores } = doctorList;

  const servicioList = useSelector((state) => state.servicioList) || {};
  const { servicios } = servicioList;

  // 1. Efecto para disparar la carga si los datos no están en localStorage
  useEffect(() => {
    if (userInfo) {
      if (!localStorage.getItem("doctores")) {
        dispatch(listDoctores());
      }
      if (!localStorage.getItem("servicios")) {
        dispatch(listServicios());
      }
    }
  }, [dispatch, userInfo]);

  // 2. Efecto para guardar en localStorage una vez que el estado de Redux se actualiza
  useEffect(() => {
    if (doctores) {
      localStorage.setItem("doctores", JSON.stringify(doctores));
    }
  }, [doctores]);

  useEffect(() => {
    if (servicios) {
      localStorage.setItem("servicios", JSON.stringify(servicios));
    }
  }, [servicios]);

  return (
    <div>
      {userInfo ? (
        <div className="flx wrap jcenter home-buttons pad-0 mtop-2">
          <Link to="/listapacientes">
            <button>
              <PacientesIcon />
              <span>Pacientes</span>
            </button>
          </Link>
          {userInfo.isAdmin ? (
            <Link to="/listadoctores">
              <button>
                <DoctorIcon />
                <span>Doctores</span>
              </button>
            </Link>
          ) : (
            ""
          )}
          <Link to="/listaservicios">
            <button>
              <ToothPasteIcon />
              <span>Servicios</span>
            </button>
          </Link>

          {userInfo.isAdmin ? (
            <Link to="/listacontroles">
              <button>
                <Outpatient />
                <span>Controles</span>
              </button>
            </Link>
          ) : (
            ""
          )}
          {userInfo.isAdmin ? (
            <Link to="/listacuadres">
              <button>
                <HandDollarIcon />
                <span>Cuadre</span>
              </button>
            </Link>
          ) : (
            ""
          )}

          {userInfo.isAdmin ? (
            <Link to="/quotelist">
              <button>
                <FontAwesomeIcon className="cotizacion-icon" icon={faLaptopFile} />
                <span>Cotizaciones</span>
              </button>
            </Link>
          ) : (
            ""
          )}

          <a
            href="https://planner-plaza-9tp7wnvii-tyrant7995gmailcoms-projects.vercel.app/"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <button>
              <CalendarioIcon />
              <span>Planificacion</span>
            </button>
          </a>

          {userInfo.isAdmin ? (
            <Link to="/listagasto">
              <button>
                <CardDollarIcon />
                <span>Gastos</span>
              </button>
            </Link>
          ) : (
            ""
          )}
          {userInfo.isAdmin ? (
            <Link to="/analiticsventas">
              <button>
                <SpreadSheetIcon />
                <span>Dinamica</span>
              </button>
            </Link>
          ) : (
            ""
          )}
          {userInfo.email === "rony@gmail.com" ? (
            <a
              href="https://plaza-stock-49ze4p6ks-franklin-bolivars-projects.vercel.app/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              <button>
                <StockIcon />
                <span>Plaza Stock</span>
              </button>
            </a>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="fachada"></div>
      )}
    </div>
  );
}

export default HomeScreen;
