import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DoctorIcon from "../icons/DoctorIcon";
import PacientesIcon from "../icons/PacientesIcon";
import HandDollarIcon from "../icons/HandDollarIcon";
import TuercasIcon from "../icons/TuercasIcon";

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
              <DoctorIcon />
              <span>Servicios</span>
            </button>
          </Link>
          <Link to="/listacuadres">
            <button>
              <HandDollarIcon />
              <span>Cuadre</span>
            </button>
          </Link>{" "}

          <Link to="/listagasto">
            <button>
              <TuercasIcon />
              <span>Calendario</span>
            </button>
          </Link>
          <Link to="/listagasto">
            <button>
              <TuercasIcon />
              <span>Gastos</span>
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
