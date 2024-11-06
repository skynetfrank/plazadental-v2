import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signin } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { USER_SIGNIN_RESET } from "../constants/userConstants";
import MessageBox from "../components/MessageBox";
import Loader from "../components/Loader";

export default function SigninScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: error,
        text: "Inicio de Sesion",
      });
      dispatch({ type: USER_SIGNIN_RESET });
    }
  }, [dispatch, error]);

  return loading ? (
    <Loader />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="flx jcenter">
      <form className="form flx column bg-color b-radius border-1 pad-2 centrado" onSubmit={submitHandler}>
        <h2 className="centrado m-2">Iniciar Sesion</h2>
        <div className="flx column astart">
          <label htmlFor="email">Usuario</label>
          <input
            className="b-radius border-1 pad-1 w-200"
            type="email"
            id="email"
            placeholder="Ingrese su Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="flx column astart">
          <label htmlFor="password">Password</label>
          <input
            className="b-radius border-1 pad-1 w-200"
            type="password"
            placeholder="Ingrese su Clave"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <button type="submit" className="centrado">
            Entrar
          </button>
        </div>
        <div className="centrado m-2">
          <Link to={`/register?redirect=${redirect}`}>Crear Cuenta</Link>
        </div>
      </form>
    </div>
  );
}
