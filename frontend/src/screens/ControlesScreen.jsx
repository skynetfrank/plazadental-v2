import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteControlPaciente,
  detailsPaciente,
} from "../actions/pacienteActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//import the swiper yall
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { deleteControl } from "../actions/controlActions";
import {
  faFileInvoiceDollar,
  faPen,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";


export default function ControlesScreen(props) {
  const [controles, setControles] = useState([]);
  const [togglePago, setTogglePago] = useState(false);
  const [toggleMateriales, setToggleMateriales] = useState(false);
  const [toggleServicios, setToggleServicios] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const { id: pacienteId } = params;

  const pacienteDetails = useSelector((state) => state.pacienteDetails);
  const { paciente, loading, error } = pacienteDetails;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!paciente || (paciente && paciente._id !== pacienteId)) {
      dispatch(detailsPaciente(pacienteId));
    }
    if (paciente) {
      const controlesOrdenados = paciente.controles.map((item) => item);

      const sortedDesc = controlesOrdenados.sort((objA, objB) => {
        return (
          Date.parse(objB.control?.fechaControl) -
          Date.parse(objA.control?.fechaControl)
        );
      });

      setControles(sortedDesc);
    }
  }, [dispatch, pacienteId, paciente]);

  const deleteHandler = (control) => {
    let confirmacion = window.confirm("ESTA SEGURO DE ELIMINAR ESTE CONTROL?");
    if (confirmacion) {
      let pw = prompt("Ingrese su clave", "");

      if (pw !== "matias01") {
        Swal.fire({
          title: "Clave Erronea, verifique...",
          text: "Ingrese Su Clave de Administrador",
          icon: "warning"
        });
        return;
      }
      if (pw === "matias01") {
        dispatch(deleteControl(control._id));
        dispatch(deleteControlPaciente(pacienteId, { controlID: control._id }));
        dispatch(detailsPaciente(pacienteId));
        Swal.fire({
          title: "Control Eliminado con Exito!",
          text: "Eliminar Control",
          icon: "success"
        });

      }
    } else {
      return;
    }
  };

  const addControlHandler = () => {
    navigate(`/crearcontrol/${paciente._id}?escita1=${"no"}`);
  };

  const ftogglePago = () => {
    setTogglePago(true);
    setToggleMateriales(false);
    setToggleServicios(false);
  };

  const ftoggleMateriales = () => {
    setTogglePago(false);
    setToggleMateriales(true);
    setToggleServicios(false);
  };

  const ftoggleServicios = () => {
    setTogglePago(false);
    setToggleMateriales(false);
    setToggleServicios(true);
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="main-container control">
      <div className="barra-botones control">
        <button className="icon-btn add-btn" onClick={addControlHandler}>
          <div className="add-icon"></div>
          <div className="btn-txt">Agregar Nuevo Control</div>
        </button>
        <div>
          <h2>Control de Consultas</h2>
          <h2>{paciente.nombre + " " + paciente.apellido}</h2>
        </div>
      </div>
      <div>
        {paciente.controles.length === 0 && <h2>PACIENTE NO POSEE CONTROL</h2>}
      </div>
      <>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
        >
          {controles.map((item, ind) => {
            if (!item.control) {
              return "";
            }

            return (
              <SwiperSlide key={ind}>
                <div className="slide-control-container">
                  <div className="slide-titulo">
                    <div className="slide-action-btns">
                      <button
                        className="btn-circle"
                        onClick={() => deleteHandler(item.control)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="btn-circle"
                        onClick={() => {
                          let pw = prompt("Ingrese su clave para Editar", "");

                          if (!pw) {
                            return;
                          }

                          if (pw !== "matias01") {
                            Swal.fire({
                              title: "Clave Erronea, verifique...",
                              text: "Ingrese Su Clave de Administrador",
                              icon: "warning"
                            });
                            return;
                          }
                          if (pw === "matias01") {
                            navigate(`/control/${item.control._id}/edit`);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    </div>

                    <div className="slide-fecha-control">
                      <h1 id="fecha-control">
                        {new Date(item.control.fechaControl)
                          .toUTCString()
                          .substring(4, 16)}
                      </h1>
                      <p>Atendido por: Dr. {item.control.doctor?.nombre}</p>
                    </div>

                    <div className="slide-action-btns">
                      <button
                        className="btn-circle"
                        onClick={() =>
                          navigate(
                            `/printfactura/${item.control._id
                            }?tipo=${"notaentrega"}`
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faFileInvoiceDollar} />
                      </button>
                      <p>Factura</p>
                    </div>
                  </div>
                  <div className="slide-info">
                    <div className="div-textarea">
                      <span
                        className="textarea-titulo"
                        data-title="Evaluacion"
                      ></span>
                      <textarea
                        className="textarea"
                        placeholder="Evaluacion..."
                        cols="25"
                        rows="5"
                        readOnly
                        value={item.control.evaluacion}
                        data-title="Evaluacion"
                      ></textarea>
                    </div>
                    <div className="div-textarea">
                      <span
                        className="textarea-titulo"
                        data-title="Tratamiento"
                      ></span>
                      <textarea
                        className="textarea"
                        placeholder="Tratamiento..."
                        cols="25"
                        rows="5"
                        readOnly
                        value={item.control.tratamiento}
                      ></textarea>
                    </div>
                    <div className="div-textarea">
                      <span
                        className="textarea-titulo"
                        data-title="Recipe"
                      ></span>
                      <textarea
                        className="textarea"
                        placeholder="Recipe..."
                        cols="25"
                        rows="3"
                        readOnly
                        value={item.control.recipe}
                      ></textarea>
                      <button
                        className="input btn-select"
                        onClick={() =>
                          navigate(`/printrecipe/${item.control._id}`)
                        }
                      >
                        <FontAwesomeIcon className="small" icon={faPrint} />
                      </button>
                    </div>
                    <div className="div-textarea">
                      <span
                        className="textarea-titulo"
                        data-title="Indicaciones"
                      ></span>
                      <textarea
                        className="textarea"
                        placeholder="Recipe..."
                        cols="25"
                        rows="3"
                        readOnly
                        value={item.control.indicaciones}
                      ></textarea>
                    </div>
                  </div>
                  <div className="sections-hider">
                    <div>
                      <button onClick={ftoggleServicios} className="button">
                        Servicios
                      </button>
                    </div>
                    <div>
                      <button onClick={ftoggleMateriales} className="button">
                        Materiales
                      </button>
                    </div>
                    <div>
                      <button onClick={ftogglePago} className="button">
                        Ver Pago
                      </button>
                    </div>
                  </div>

                  <div className="div-two-colums">
                    {toggleMateriales && (
                      <div className="slide-materiales-info">
                        <span className="slide-span-pago">
                          Informacion sobre Materiales Aqui (en costruccion)
                        </span>
                        <span className="slide-span-pago">
                          Informacion sobre Materiales Aqui (en construccion)
                        </span>
                      </div>
                    )}

                    {toggleServicios && (
                      <>
                        <div className="slide-materiales-info">
                          {item.control.serviciosItems.map((item, ndx) => {
                            let total = +item.montoItemServicio;
                            return (
                              <span key={ndx}>
                                {item.cantidad +
                                  " " +
                                  item.servicio.nombre +
                                  " " +
                                  item.precioServ +
                                  "$ = " +
                                  " " +
                                  item.montoItemServicio +
                                  "$"}
                              </span>
                            );
                          })}
                          {item.control.montoUsd ? (
                            <span>
                              {" "}
                              Total Servicios: US${" "}
                              {item.control.montoUsd.toFixed(2)}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    )}

                    {togglePago && (
                      <>
                        {item.control.pagoInfo.status === "pagado" ? (
                          <div
                            className="slide-pago-info show"
                            data-title="Informacion del Pago"
                          >
                            {item.control.pagoInfo.detallePago && (
                              <span>{item.control.pagoInfo.detallePago}</span>
                            )}
                            {item.control.pagoInfo.memoPago && (
                              <span>
                                MEMO: {item.control.pagoInfo.memoPago}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div
                            className="slide-pago-info show"
                            data-title="Informacion del Pago"
                          >
                            'Consulta No tiene Informacion de Pago Registrada'
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    </div>
  );
}
