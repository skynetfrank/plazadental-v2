import { Link } from "react-router-dom";
import ProductoIcon from "../icons/ProductoIcon";
import VentasIcon from "../icons/VentasIcon";
import UsersIcon from "../icons/UsersIcon";
import BcvIcon from "../icons/BcvIcon";
import CuadreIcon from "../icons/CuadreIcon";
import CommentsIcon from "../icons/CommentsIcon";
import ToolsIcon from "../icons/ToolsIcon";
import ReposicionIcon from "../icons/ReposicionIcon";
import DashboardIcon from "../icons/DashboardIcon";
import CalendarioIcon from "../icons/CalendarioIcon";
import GastosIcon from "../icons/GastosIcon";
import StarIcon from "../icons/StarIcon";
import EmpleadosIcon from "../icons/EmpleadosIcon";
import CloudSearch from "../icons/CloudSearchIcon";
import ShoeIcon from "../icons/ShoeIcon";
import { useSelector } from "react-redux";
import ClockIcon from "../icons/ClockIcon";
import casheaimg from "../assets/cashea.jpg";

function HomeScreen() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  return (
    <div>
      {userInfo ? (
        <div className="flx wrap jcenter home-buttons pad-0 mtop-3">
          <Link to="/facturacion">
            <button>
              <BcvIcon />
              <span>Facturacion</span>
            </button>
          </Link>
          <Link to="/listacuadres">
            <button>
              <CuadreIcon />
              <span>Cuadre</span>
            </button>
          </Link>{" "}
          <Link to="/verproductos">
            <button>
              <ProductoIcon />
              <span>Productos</span>
            </button>
          </Link>
          <Link to="/listaventas">
            <button>
              <VentasIcon />
              <span>Ventas</span>
            </button>
          </Link>
          <Link to="/reportecashea">
            <button>
              <img className="cashea-img" src={casheaimg} alt="cashea" />
              <span className="span-cashea">Reporte</span>
            </button>
          </Link>
          <Link to="/buscarproducto">
            <button>
              <CloudSearch />
              <span>Busqueda</span>
            </button>{" "}
          </Link>
          <Link to="/top20">
            <button>
              <StarIcon />
              <span>
                <p>Top-20</p>
              </span>
            </button>
          </Link>
          <Link to="/reporteclientes">
            <button>
              <UsersIcon />
              <span>Clientes</span>
            </button>
          </Link>
          <a
            href="https://intranet-v2-9drcsb58h-tyrant7995gmailcoms-projects.vercel.app/"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            {" "}
            <button>
              <CommentsIcon />
              <span>Intranet</span>
            </button>
          </a>
          <Link to="/ajustelist">
            <button>
              <ToolsIcon />
              <span>Ajustes</span>
            </button>
          </Link>
          <Link to="/reposicionlist">
            <button>
              <ReposicionIcon />
              <span>Reposiciones</span>
            </button>
          </Link>
          <Link to="/dashboard">
            <button>
              <DashboardIcon />
              <span>Dashboard</span>
            </button>
          </Link>
          <Link to="/listagasto">
            <button>
              <GastosIcon />
              <span>Gastos</span>
            </button>
          </Link>
          <a
            href="https://planner-b4ey3we1w-tyrant7995gmailcoms-projects.vercel.app/"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <button>
              <CalendarioIcon />
              <span>Planificacion</span>
            </button>
          </a>
          <a
            href="https://horario-p9wma9x58-franklin-bolivars-projects.vercel.app/"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <button>
              <ClockIcon />
              <span>Horarios</span>
            </button>
          </a>
          <Link to="/listaempleados">
            <button>
              <EmpleadosIcon />
              <span>Empleados</span>
            </button>
          </Link>
          <a
            href="https://wally-7f2vxk9rz-tyrant7995gmailcoms-projects.vercel.app/"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <button>
              <ShoeIcon />
              <span>Colecciones</span>
            </button>
          </a>
        </div>
      ) : (
        <div className="fachada"></div>
      )}
    </div>
  );
}

export default HomeScreen;
