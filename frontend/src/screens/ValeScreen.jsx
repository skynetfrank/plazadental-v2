/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { add, format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { EMPLEADO_ADDVALE_RESET, EMPLEADO_DETAILS_RESET, EMPLEADO_LIST_RESET } from "../constants/empleadoConstants";
import { addVale, detailsEmpleado } from "../actions/empleadoActions";

export default function ValeScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { id: empleadoId } = params;
  const [fechaEntrega, setFechaEntrega] = useState(format(new Date(), "yyyy-MM-dd"));
  const [montousd, setMontousd] = useState("");
  const [montobs, setMontobs] = useState("");
  const [cambiodia, setCambiodia] = useState(Number(localStorage.getItem("cambioDia")).toFixed(2));
  const [concepto, setConcepto] = useState("");
  const empleadoDetails = useSelector((state) => state.empleadoDetails);
  const { error: errorGet, empleado } = empleadoDetails;

  const dispatch = useDispatch();

  const empleadoAddVale = useSelector((state) => state.empleadoAddVale);
  const { success } = empleadoAddVale;

  useEffect(() => {
    const nuevaFecha = add(new Date(fechaEntrega), {
      days: 1,
    });
    const dia = Number(fechaEntrega.slice(-2));
    const month = nuevaFecha.toLocaleString("default", { month: "long" });
    const year = nuevaFecha.getFullYear();

    if (dia < 16) {
      setConcepto("1Q-" + month + year);
    } else {
      setConcepto("2Q-" + month + year);
    }
  }, [fechaEntrega]);

  useEffect(() => {
    if (success) {
      toast.success("Vale Registrado!", {
        position: "top-center",
        autoClose: 1000,
      });
      dispatch({ type: EMPLEADO_ADDVALE_RESET });
      dispatch(detailsEmpleado(empleadoId));
      setFechaEntrega(format(new Date(), "yyyy-MM-dd"));
      setMontousd("");
      setMontobs("");
    }
    if (!empleado || empleado._id !== empleadoId) {
      dispatch(detailsEmpleado(empleadoId));
    }
  }, [empleado, dispatch, empleadoId, success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(addVale(empleadoId, { fechaEntrega, montousd, montobs, cambiodia, concepto }));
  };

  const handleMontobs = (e) => {
    e.preventDefault();
    setMontousd((parseFloat(e.target.value) / parseFloat(cambiodia)).toFixed(2));
    setMontobs(e.target.value);
  };

  const handleMontousd = (e) => {
    e.preventDefault();
    setMontobs((parseFloat(e.target.value) * parseFloat(cambiodia)).toFixed(2));
    setMontousd(e.target.value);
  };

  const handleCambio = (e) => {
    e.preventDefault();
    setMontobs((parseFloat(montousd) * parseFloat(e.target.value)).toFixed(2));
    setCambiodia(e.target.value);
  };

  return (
    <div>
      <div className="empleado-header">
        <div className="flx column">
          <img className="avatar-img" src={empleado?.empleadoAvatarUrl}></img>
          <p>{empleado?.nombre + " " + empleado?.apellido}</p>
          <p>{empleado?.cedula}</p>
        </div>
      </div>
      <div className="screen-offset">
        <form className="form vale" onSubmit={submitHandler}>
          <h1>Vale de Nomina</h1>
          <div className="flx gap wrapped">
            <div className="input__div vale">
              <input
                type="date"
                className="input-midget"
                value={fechaEntrega}
                required
                onChange={(e) => setFechaEntrega(e.target.value)}
              ></input>
            </div>
            <div className="input__div">
              <input type="text" className="input-medium labelup" value={concepto} readOnly></input>
              <label>Periodo</label>
            </div>

            <div className="flx vale">
              <div className="input__div">
                <input
                  type="number"
                  className="input-small"
                  value={montousd}
                  required
                  onChange={(e) => handleMontousd(e)}
                ></input>
                <label>Monto US$</label>
              </div>

              <div className="input__div">
                <input
                  type="number"
                  className="input-very-tiny"
                  value={cambiodia}
                  required
                  onChange={(e) => handleCambio(e)}
                ></input>
                <label>Cambio</label>
              </div>

              <div className="input__div">
                <input
                  type="number"
                  className="input-small"
                  value={montobs}
                  required
                  onChange={(e) => handleMontobs(e)}
                ></input>
                <label>Monto Bs.</label>
              </div>
            </div>
          </div>

          <div>
            <button className="btn-submit" type="submit">
              Registrar
            </button>
          </div>
        </form>
        <div>
          <button onClick={() => navigate(`/valeslist/${empleado._id}`)} className="btn-historial">
            Ver Historial de vales
          </button>
        </div>
      </div>
    </div>
  );
}
