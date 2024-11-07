import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUserProfile } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import Swal from "sweetalert2";
import logo from "../assets/logo.jpg";

export default function ProfileScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = userUpdateProfile;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setNombre(user.nombre || " ");
      setEmail(user.email || " ");
      setApellido(user.apellido || " ");
      setCedula(user.cedula || " ");
      setTelefono(user.telefono || " ");
    }
  }, [dispatch, userInfo._id, user]);
  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password and Confirm Password Are Not Matched");
    } else {
      dispatch(
        updateUserProfile({
          userId: user._id,
          nombre,
          email,
          password,
          apellido,
          cedula,
          telefono,
        })
      );
    }
  };
  useEffect(() => {
    if (successUpdate) {
      Swal.fire({
        title: "Datos Actualizado con Exito!",
        text: "Editar Perfil",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
    }
  }, [dispatch, successUpdate]);

  useEffect(() => {
    if (errorUpdate) {
      Swal.fire({
        title: "error",
        text: "Editar Perfil",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, errorUpdate]);

  useEffect(() => {
    if (error) {
      Swal.fire("Ocurrio un Error al Actualizar!", "", error);
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error]);

  return (
    <div>
      <div></div>
      <form className="form" onSubmit={submitHandler}>
        <h1>Perfil de Usuario</h1>

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            <div className="flexor">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Enter name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              ></input>
            </div>
            <div className="flexor">
              <label htmlFor="apellido">Apellido</label>
              <input id="apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}></input>
            </div>
            <div className="flexor">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div className="flexor">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Solo si desea cambiar su clave actual"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="flexor">
              <label htmlFor="confirmPassword">Confirme su Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Vuelva a escribir la nueva clave"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>
            <div className="flexor">
              <label htmlFor="cedula">Cedula</label>
              <input id="cedula" type="text" value={cedula} onChange={(e) => setCedula(e.target.value)}></input>
            </div>
            <div className="flexor">
              <label htmlFor="telefono">Telefono</label>
              <input id="telefono" type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)}></input>
            </div>
            <div className="flx column">
              <label />
              <button type="submit">Actualizar Perfil</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
