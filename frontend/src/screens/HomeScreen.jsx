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
import { Outpatient } from "../icons/Outpatient";
import { StockIcon } from "../icons/StockIcon";

function HomeScreen() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  console.log("userInfo", userInfo)
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
          {userInfo.email === "rony@admin.com" ? (<a
            href="https://plaza-stock-49ze4p6ks-franklin-bolivars-projects.vercel.app/"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <button>
              <StockIcon />
              <span>Plaza Stock</span>
            </button>
          </a>) : ("")}

        </div>

      ) : (
        <div className="fachada"></div>
      )}
    </div>
  );
}

export default HomeScreen;
