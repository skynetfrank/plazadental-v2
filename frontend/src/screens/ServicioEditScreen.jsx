import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsServicio, updateServicio } from "../actions/servicioActions";
import { useNavigate, useParams } from "react-router-dom";
import { SERVICIO_UPDATE_RESET } from "../constants/servicioConstants";
import Swal from "sweetalert2";

export default function ServicioEditScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { id: servicioId } = params;
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [area, setArea] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preciobs, setPreciobs] = useState(0);
  const [preciousd, setPreciousd] = useState(0);
  const [cambio, setCambio] = useState(1);
  const [isRegister, setIsRegister] = useState(false);

  const servicioDetails = useSelector((state) => state.servicioDetails);
  const { loading, error, servicio } = servicioDetails;

  const servicioUpdate = useSelector((state) => state.servicioUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = servicioUpdate;

  const areaArray = [
    " ",
    "GENERAL",
    "ORTODONCIA",
    "ODONTOPEDIATRIA",
    "CIRUGIA",
    "ENDODONCIA",
    "PROTESIS",
    "PERIODONCIA",
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: SERVICIO_UPDATE_RESET });
      Swal.fire({
        text: "Datos Actualizados!",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });
      navigate("/listaservicios");
    }
    if (!servicio || servicio._id !== servicioId || successUpdate) {
      dispatch(detailsServicio(servicioId));
    } else {
      setCodigo(servicio.codigo || "");
      setNombre(servicio.nombre || "");
      setArea(servicio.area || "");
      setDescripcion(servicio.descripcion || "");
      setPreciobs(servicio.preciobs || "");
      setPreciousd(servicio.preciousd || "");
    }
  }, [dispatch, navigate, servicio, servicioId, successUpdate]);

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

    dispatch(updateServicio({ _id: servicioId, codigo, nombre, area, descripcion, preciobs, preciousd, cambio }));
  };

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
      <h2 className="centrado">Editar Servicio</h2>

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
            </div>

            <div className="centrado">
              <button className="button" type="submit">
                Actualizar Servicio
              </button>
            </div>
          </React.Fragment>
        }
      </form>
    </div>
  );
}
