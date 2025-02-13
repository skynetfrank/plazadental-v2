import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { createServicio } from "../actions/servicioActions";
import { SERVICIO_CREATE_RESET } from "../constants/servicioConstants";
import Swal from "sweetalert2";

export default function ServicioCreateScreen(props) {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [area, setArea] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preciobs, setPreciobs] = useState(0);
  const [preciousd, setPreciousd] = useState(0);
  const [cambio, setCambio] = useState(1);
  const [isRegister, setIsRegister] = useState(false);

  const servicioCreate = useSelector((state) => state.servicioCreate);
  const { success, servicio } = servicioCreate;

  const areaArray = [" ", "GENERAL", "ORTODONCIA", "ODONTOPEDIATRIA", "CIRUGIA","ENDODONCIA","PROTESIS","PERIODONCIA"];

  const dispatch = useDispatch();

  useEffect(() => {
    let isCancelled = false;

    if (codigo === "") {
      return;
    }
    const buscarCode = async () => {
      try {
        const { data } = await Axios.get(`/api/servicios/buscar?codigo=${codigo}`);

        if (data.servicio.length > 0) {
          setIsRegister(true);
          Swal.fire({
            text: "Codigo Ya Registrado...Verifique!",
            imageUrl: "/tiny_logo.jpg",
            imageWidth: 70,
            imageHeight: 30,
            imageAlt: "logo",
          });
        }
        if (data.servicio.length === 0) {
          setIsRegister(false);
        }
      } catch (error) {
        console.log("error al buscar codigo con axios", error);
      }
    };
    buscarCode();
    return () => {
      isCancelled = true;
    };
  }, [codigo, isRegister]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isRegister) {
      Swal.fire({
        text: "Codigo Ya Registrado...Verifique!",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });

      return;
    }

    dispatch(createServicio({ codigo, nombre, area, descripcion, preciobs, preciousd, cambio }));
  };

  useEffect(() => {
    if (success) {
      Swal.fire({
        text: "Servicio Registrado OK!",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });
    }
    dispatch({ type: SERVICIO_CREATE_RESET });
    setCodigo("");
    setNombre("");
    setArea("");
    setDescripcion("");
    setPreciobs("");
    setPreciousd("");
  }, [dispatch, servicio, success]);

  const getPrecio = async (e) => {
    try {
      setPreciobs((parseFloat(e) * parseFloat(cambio)).toFixed(2));
      setPreciousd(e);
    } catch (error) {
      console.log("ocurrio un error en getPrecio(): " + error);
    }
  };

  const clearCode = (e) => {
    e.preventDefault();
    setCodigo("");
  };

  return (
    <div className="main-container">
      <h2 className="centrado">Servicio Nuevo</h2>

      <form className="form-servicio" onSubmit={submitHandler}>
        {
          <React.Fragment key={99}>
            <div className="inputs-section">
              <div className="input-group codigo">
                <input
                  id="codigo"
                  value={codigo}
                  type="text"
                  placeholder=" "
                  className="input input-260"
                  autoComplete="off"
                  required
                  onChange={(e) => setCodigo(e.target.value)}
                ></input>
                <label htmlFor="codigo" className="user-label">
                  Codigo
                </label>
              </div>
              <button className="button small" id="btn-codigo" onClick={clearCode}>
                &#9746;
              </button>
              <div className="select-wrapper area" data-title="Area">
                <select
                  id="select-area"
                  className="input select input-280"
                  value={area}
                  placeholder="selecionar"
                  onChange={(e) => setArea(e.target.value)}
                >
                  {areaArray.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group servicio">
                <input
                  id="name"
                  type="text"
                  placeholder=" "
                  className="input servicio input-260"
                  autoComplete="off"
                  value={nombre}
                  maxLength="50"
                  required
                  onChange={(e) => setNombre(e.target.value)}
                ></input>
                <label htmlFor="name" className="user-label">
                  Nombre
                </label>
              </div>
              <div className="input-group">
                <input
                  id="descripcion"
                  type="text"
                  placeholder=" "
                  className="input input-260"
                  autoComplete="off"
                  maxLength="50"
                  required
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                ></input>
                <label htmlFor="descripcion" className="user-label">
                  Descripcion
                </label>
              </div>

              <div className="input-group">
                <input
                  id="preciousd"
                  type="number"
                  placeholder=" "
                  className="input input-260"
                  autoComplete="off"
                  value={preciousd}
                  required
                  onChange={(e) => getPrecio(e.target.value)}
                ></input>
                <label htmlFor="preciousd" className="user-label">
                  Precio US$
                </label>
              </div>

              <div className="input-group">
                <input
                  id="preciobs"
                  type="number"
                  placeholder=" "
                  className="input input-260"
                  autoComplete="off"
                  value={preciobs}
                  required
                  onChange={(e) => setPreciobs(e.target.value)}
                ></input>
                <label htmlFor="preciobs" className="user-label">
                  Precio Bs.
                </label>
              </div>

              <div className="input-group">
                <input
                  id="cambio"
                  type="number"
                  placeholder=" "
                  className="input input-260"
                  autoComplete="off"
                  value={cambio}
                  onChange={(e) => setCambio(e.target.value)}
                ></input>
                <label htmlFor="cambio" className="user-label">
                  cambio Bs/$
                </label>
              </div>
            </div>

            <div className="centrado">
              <button className="button" type="submit">
                Guardar Servicio
              </button>
            </div>
          </React.Fragment>
        }
      </form>
    </div>
  );
}
