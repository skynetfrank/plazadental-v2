import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "./actions/userActions";
import LockIcon from "./icons/LockIcon";
import logo from "/tiny_logo.jpg";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SplashSvg from "./components/SplashSvg";
import { listPacientes } from "./actions/pacienteActions";
import { listDoctores } from "./actions/doctorActions";
import { listAllServicios, listServicios } from "./actions/servicioActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faPowerOff,
  faSignOut,
  faUnlockAlt,
  faUnlockKeyhole,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

function App() {
  const [hoy] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const pacienteList = useSelector((state) => state.pacienteList);
  const doctorList = useSelector((state) => state.doctorList);
  const servicioAllList = useSelector((state) => state.servicioAllList);

  useEffect(() => {
    dispatch(listPacientes({}));
    dispatch(listDoctores({}));
    dispatch(listServicios({}));
  }, [dispatch]);

  const signoutHandler = () => {
    dispatch(signout());
  };

  const cambioHandler = async () => {
    if (!userInfo) {
      return;
    }
    const { value: cambio } = await Swal.fire({
      input: "text",
      inputLabel: "Cambio BCV",
      inputPlaceholder: "Ingresa el Cambio del Dia",
      showCancelButton: true,
      confirmButtonText: "Actualizar",
    });

    localStorage.setItem("cambioBcv", JSON.stringify(Number(cambio.replace(/,/g, "."))));
    window.location.reload();
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2900);
  }, []);

  return (
    <>
      {loading ? (
        <SplashSvg />
      ) : (
        <div className="grid-container">
          <header className="flx jsb">
            <div className="flx jstart pad-0 mr">
              <Link to="/">
                <img className="logo" src={logo} alt="logo" />
              </Link>
              <div className="flx column pad-0 brand-container ml">
                <h2>Plaza Dental</h2>
                <span className="negrita font-1 header-date">
                  Caracas, {dayjs(hoy.toLocaleDateString()).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            {userInfo ? (
              <button className="btn-bcv" onClick={cambioHandler}>
                <span className="header-bcv pad-1">BCV: {Number(localStorage.getItem("cambioBcv")).toFixed(2)}</span>
              </button>
            ) : (
              ""
            )}

            <div>
              {userInfo ? (
                <div className="flx header-user pad-0 negrita">
                  {userInfo.nombre.substr(0, 12)}
                  <button className="btn-icon-container" onClick={signoutHandler}>
                    <FontAwesomeIcon icon={faPowerOff} />
                  </button>
                </div>
              ) : (
                <Link to="/signin">
                  <button className="btn-icon-container">
                    <FontAwesomeIcon icon={faLock} />
                  </button>
                </Link>
              )}
            </div>
          </header>
          <main>
            <Outlet />
          </main>
          <footer>
            <span className="negrita">27ABRIL2025</span>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
