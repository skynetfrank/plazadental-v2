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
import { listAllServicios } from "./actions/servicioActions";

function App() {
  const [hoy] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const pacienteList = useSelector((state) => state.pacienteList);
  const { pacientes } = pacienteList;

  const doctorList = useSelector((state) => state.doctorList);
  const { doctores } = doctorList;

  const servicioAllList = useSelector((state) => state.servicioAllList);
  const { servicios } = servicioAllList;

  useEffect(() => {
    dispatch(listPacientes({}));
    dispatch(listDoctores({}));
    dispatch(listAllServicios({}));
  }, [dispatch]);

  useEffect(() => {
    if (pacientes) {
      localStorage.setItem("pacientes", JSON.stringify(pacientes));
    }
    if (doctores) {
      localStorage.setItem("doctores", JSON.stringify(doctores));
    }
    if (servicios) {
      localStorage.setItem("servicios", JSON.stringify(servicios));
    }
  }, [dispatch, doctores, pacientes, servicios]);

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
                <span className="negrita font-1 header-date">Caracas, {hoy.toLocaleDateString()}</span>
              </div>
            </div>

            <button className="btn-bcv" onClick={cambioHandler}>
              <span className="header-bcv pad-1">BCV: {Number(localStorage.getItem("cambioBcv")).toFixed(2)}</span>
            </button>

            <div>
              {userInfo ? (
                <div className="flx header-user pad-0 negrita">
                  {userInfo.nombre.substr(0, 12)}
                  <button className="btn-icon-container" onClick={signoutHandler}>
                    <LockIcon />
                  </button>
                </div>
              ) : (
                <Link to="/signin">
                  <button className="btn-icon-container">
                    <LockIcon />
                  </button>
                </Link>
              )}
            </div>
          </header>
          <main>
            <Outlet />
          </main>
          <footer>
            <span>v26DIC2024-alphax</span>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
