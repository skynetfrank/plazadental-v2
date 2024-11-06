/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import Swal from "sweetalert2";
import {
  EMPLEADO_LIST_RESET,
  EMPLEADO_UPDATE_RESET,
} from "../constants/empleadoConstants";
import { useNavigate, useParams } from "react-router-dom";
import { updateEmpleado, detailsEmpleado } from "../actions/empleadoActions";
import dayjs from "dayjs";

export default function EmpleadoEditScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { id: empleadoId } = params;
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [isIvssInscrito, setIsIvssInscrito] = useState(false);
  const [empleadoAvatarUrl, setEmpleadoAvatarUrl] = useState("");

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const empleadoDetails = useSelector((state) => state.empleadoDetails);
  const { error, empleado } = empleadoDetails;

  const empleadoUpdate = useSelector((state) => state.empleadoUpdate);
  const { success: successUpdate } = empleadoUpdate;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      Swal.fire({
        title: "Informacion Actualizada!",
        text: "Editar Empleado",
        icon: "success",
      });
      dispatch({ type: EMPLEADO_LIST_RESET });
      navigate("/empleadolist");
    }
    if (!empleado || empleado._id !== empleadoId || successUpdate) {
      dispatch({ type: EMPLEADO_UPDATE_RESET });
      dispatch(detailsEmpleado(empleadoId));
    } else {
      setFechaNacimiento(
        dayjs(empleado.fechaNacimiento).format("YYYY-MM-DD") || ""
      );
      setNombre(empleado.nombre || "");
      setApellido(empleado.apellido || "");
      setCedula(empleado.cedula || "");
      setEmail(empleado.email || "");
      setTelefono(empleado.telefono || "");
      setDireccion(empleado.direccion || "");
      setIsIvssInscrito(empleado.isIvssInscrito);
      setEmpleadoAvatarUrl(empleado.empleadoAvatarUrl || "");
    }
  }, [empleado, dispatch, empleadoId, successUpdate, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      updateEmpleado({
        _id: empleadoId,
        nombre,
        apellido,
        cedula,
        fechaNacimiento,
        telefono,
        email,
        direccion,
        isIvssInscrito,
        empleadoAvatarUrl,
      })
    );
  };

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
      <h2>Agregar Empleado</h2>
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
          <div className="pad-2">
            <label>Inscrito en el I.V.S.S.</label>
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
