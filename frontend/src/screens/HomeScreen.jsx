import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DoctorIcon from "../icons/DoctorIcon";
import PacientesIcon from "../icons/PacientesIcon";
import HandDollarIcon from "../icons/HandDollarIcon";
import TuercasIcon from "../icons/TuercasIcon";
import CalendarioIcon from "../icons/CalendarioIcon";
import CardDollarIcon from "../icons/CardDollarIcon";
import ToothPasteIcon from "../icons/ToothPasteIcon";
import SpreadSheetIcon from "../icons/SpreadSheetIcon";

function HomeScreen() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  return (
    <div>
      {userInfo ? (
        <div className="flx wrap jcenter home-buttons pad-0 mtop-3">
          <Link to="/listapacientes">
            <button>
              <PacientesIcon />
              <span>Pacientes</span>
            </button>
          </Link>
          <Link to="/listadoctores">
            <button>
              <DoctorIcon />
              <span>Doctores</span>
            </button>
          </Link>
          <Link to="/listaservicios">
            <button>
              <ToothPasteIcon />
              <span>Servicios</span>
            </button>
          </Link>
          <Link to="/listacuadres">
            <button>
              <HandDollarIcon />
              <span>Cuadre</span>
            </button>
          </Link>{" "}
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
          <Link to="/listagasto">
            <button>
              <CardDollarIcon />
              <span>Gastos</span>
            </button>
          </Link>
          <Link to="/analiticsventas">
            <button>
              <SpreadSheetIcon />
              <span>Dinamica</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="fachada"></div>
      )}
    </div>
  );
}

export default HomeScreen;
