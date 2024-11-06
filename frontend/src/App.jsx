/* eslint-disable react/react-in-jsx-scope */
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "./actions/userActions";
import LockIcon from "./icons/LockIcon";
import logo from "./assets/logo.png";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SplashSvg from "./components/SplashSvg";

function App() {
  const [productos, setProductos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [hoy] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
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
    fetch("https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/allproductschacao")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        localStorage.setItem("productos", JSON.stringify(data));
      })
      .catch((error) => console.log(error));
    //localStorage.removeItem("cartItems");
    localStorage.removeItem("clienteInfo");
    localStorage.removeItem("tempId");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    fetch("https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/getallusers")
      .then((response) => response.json())
      .then((data) => {
        setVendedores(data);
        localStorage.setItem("vendedores", JSON.stringify(data));
      })
      .catch((error) => console.log(error));
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
                <img src={logo} alt="logo" />
              </Link>
              <div className="flx column pad-0">
                <h2>Demoda Chacao</h2>
                <span className="negrita font-1 header-date">Caracas, {hoy.toLocaleDateString()}</span>
              </div>
            </div>

            <button className="btn-icon-container" onClick={cambioHandler}>
              <span className="header-bcv pad-1">BCV: {Number(localStorage.getItem("cambioBcv")).toFixed(2)}</span>
            </button>

            <div>
              {userInfo ? (
                <div className="flx header-user pad-0 green negrita">
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
            <span>26oct2024</span>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
