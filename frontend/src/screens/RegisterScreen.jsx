import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { register } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { USER_REGISTER_RESET } from "../constants/userConstants";
import logo from "../assets/logo.jpg";

export default function RegisterScreen(props) {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActivo, setIsactivo] = useState(true);

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Su confirmacion de Password no coincide... verifique!");
    } else {
      dispatch(register(nombre, email, apellido, cedula, password, telefono));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Ocurrio un Error al Registrase",
        text: "Registro de Nuevo Usuario",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      dispatch({ type: USER_REGISTER_RESET });
    }
  }, [dispatch, error]);
  return (
    <div className="fachada">
      <div className="flx jcenter">
        <form
          className="form flx column bg-color b-radius border-1 pad-2 centrado"
          onSubmit={submitHandler}>
          <h2 className="centrado m-2">Registrar Usuario</h2>
          {loading && <LoadingBox></LoadingBox>}
          <div className="flx column astart pad-0">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="nombre"
              required
              onChange={(e) => setNombre(e.target.value)}></input>
          </div>
          <div className="flx column astart pad-0">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              required
              onChange={(e) => setApellido(e.target.value)}></input>
          </div>

          <div className="flx column astart pad-0">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}></input>
          </div>
          <div className="flx column astart pad-0">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}></input>
          </div>
          <div className="flx column astart pad-0">
            <label htmlFor="confirmPassword">Confirme su Password</label>
            <input
              type="password"
              id="confirmPassword"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}></input>
          </div>
          <div className="flx column astart pad-0">
            <label htmlFor="cedula">Cedula de Identidad</label>
            <input
              type="text"
              id="cedula"
              required
              onChange={(e) => setCedula(e.target.value)}></input>
          </div>
          <div className="flx column astart pad-0">
            <label htmlFor="telefono">Telefono</label>
            <input
              type="text"
              id="telefono"
              required
              onChange={(e) => setTelefono(e.target.value)}></input>
          </div>
          <div>
            <label />
            <button className="pad-1 mtop-2" type="submit">
              Registrar Usuario
            </button>
          </div>
          <div className="flx column">
            <div className="font-12">
              Si ya tienes cuenta:{" "}
              <Link className="subrayado" to={`/signin?redirect=${redirect}`}>
                Inicia Sesion Aqui
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
