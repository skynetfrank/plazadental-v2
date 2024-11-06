/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { createEmpleado } from "../actions/empleadoActions";
import Swal from "sweetalert2";
import { EMPLEADO_CREATE_RESET } from "../constants/empleadoConstants";
import { cargos } from "../constants/listas";

export default function EmpleadoCreateScreen(props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [cargo, setCargo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [isIvssInscrito, setIsIvssInscrito] = useState(false);
  const [empleadoAvatarUrl, setEmpleadoAvatarUrl] = useState("");
  const [sueldobs, setSueldobs] = useState("");
  const [sueldousd, setSueldousd] = useState("");

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const empleadoCreate = useSelector((state) => state.empleadoCreate);
  const { empleado } = empleadoCreate;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      createEmpleado(
        nombre,
        apellido,
        cedula,
        fechaNacimiento,
        fechaIngreso,
        telefono,
        email,
        direccion,
        sueldobs,
        sueldousd,
        cargo,
        isIvssInscrito,
        empleadoAvatarUrl
      )
    );
  };

  useEffect(() => {
    if (empleado) {
      Swal.fire({
        title: "Empleado Registrado con Exito!",
        text: "Registrar Empleado",
        icon: "success",
      });

      dispatch({ type: EMPLEADO_CREATE_RESET });
      setNombre("");
      setApellido("");
      setCedula("");
      setFechaNacimiento("");
      setFechaIngreso("");
      setTelefono("");
      setEmail("");
      setDireccion("");
      setIsIvssInscrito(false);
      setEmpleadoAvatarUrl("");
      setCargo("");
      setSueldobs("");
      setSueldousd("");
    }
  }, [dispatch, empleado]);

  const uploadFileHandler = async (e) => {
    const image = e.target.files[0];

    const bodyFormData = new FormData();
    bodyFormData.append("file", image);
    bodyFormData.append("upload_preset", "paulshoespreset");
    bodyFormData.append("cloud_name", "reactorsys");
    bodyFormData.append("folder", "productos");
    setLoadingUpload(true);

    try {
      const { data } = await Axios.post(
        "https://api.cloudinary.com/v1_1/reactorsys/image/upload",
        bodyFormData
      );
      setEmpleadoAvatarUrl(data.secure_url);
      setLoadingUpload(false);
    } catch (error) {
      setEmpleadoAvatarUrl("");
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  return (
    <div className="flx column jcenter m-0 pad-0">
      <h2>Registrar Empleado</h2>
      <form
        className="form flx bg-color b-radius border-1 pad-2 centrado mtop-1"
        onSubmit={submitHandler}>
        <div>
          <div className="flx jsb gap pad-0">
            <div className="flx column astart pad-0">
              <label>Nombre</label>
              <input
                type="text"
                value={nombre}
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                required
                onChange={(e) => setNombre(e.target.value)}></input>
            </div>
            <div className="flx column astart pad-0">
              <label>Apellido</label>
              <input
                type="text"
                value={apellido}
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                required
                onChange={(e) => setApellido(e.target.value)}></input>
            </div>
          </div>

          <div className="flx jsb gap pad-0">
            <div className="flx column astart pad-0">
              <label>Cedula</label>
              <input
                type="text"
                value={cedula}
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                maxLength={10}
                pattern="[V|E][0-9]{6,9}"
                required
                onChange={(e) => setCedula(e.target.value)}></input>
            </div>
            <div className="flx column astart pad-0">
              <label>Fecha Nacimiento</label>
              <input
                type="date"
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                min="1950-12-31"
                max="2030-12-31"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}></input>
            </div>
          </div>

          <div className="flx jsb gap pad-0">
            <div className="flx column astart pad-0">
              <label>Telefono</label>
              <input
                type="text"
                value={telefono}
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                onChange={(e) => setTelefono(e.target.value)}></input>
            </div>
            <div className="flx column astart pad-0">
              <label>Email</label>
              <input
                type="email"
                value={email}
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                onChange={(e) => setEmail(e.target.value)}></input>
            </div>
          </div>

          <div className="flx column astart pad-0">
            <label>Direccion</label>
            <input
              type="text"
              className="b-radius border-1 b-radius-05 pad-05 w-full"
              value={direccion}
              required
              onChange={(e) => setDireccion(e.target.value)}></input>
          </div>

          <div className="flx jsb gap pad-0">
            <div className="flx column astart pad-0">
              <label>Fecha Ingreso</label>
              <input
                type="date"
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                min="2021-12-31"
                max="2030-12-31"
                value={fechaIngreso}
                onChange={(e) => setFechaIngreso(e.target.value)}></input>
            </div>
            <div className="flx column astart pad-0">
              <label>Cargo</label>
              <input
                type="text"
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                value={cargo}
                list="cargos"
                required
                onChange={(e) => setCargo(e.target.value)}></input>
              <datalist id="cargos">
                {cargos.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div className="flx jsb gap pad-0">
            <div className="flx column astart pad-0">
              <label>Sueldo Bs. </label>
              <input
                type="text"
                value={sueldobs}
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                onChange={(e) => setSueldobs(e.target.value)}></input>
            </div>
            <div className="flx column astart pad-0">
              <label>Bono US$</label>
              <input
                type="text"
                value={sueldousd}
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                onChange={(e) => setSueldousd(e.target.value)}></input>
            </div>
          </div>

          <div className="pad-2">
            <label>Esta inscrito en el I.V.S.S.?: </label>
            <input
              type="checkbox"
              checked={isIvssInscrito}
              onChange={(e) => setIsIvssInscrito(e.target.checked)}
              className="ivss-inscrito"></input>
          </div>

          <div className="flx column pad-0 mtop-1">
            <img
              src={empleadoAvatarUrl ? empleadoAvatarUrl : "./camera.png"}
              className="tiny-image"
              alt=" imagen1"
            />
            <p className="mtop-2">Foto</p>
            <input
              type="file"
              className="custom-file-input"
              id="foto1"
              onChange={uploadFileHandler}></input>
          </div>
          <div>
            <button className="mtop-2" type="submit">
              Guardar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
