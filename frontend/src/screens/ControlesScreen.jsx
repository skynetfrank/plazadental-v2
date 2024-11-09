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
  faBoxes,
  faDollarSign,
  faFileInvoiceDollar,
  faHandHoldingDollar,
  faMedkit,
  faMoneyCheck,
  faPen,
  faPrint,
  faToolbox,
  faTooth,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ToolTip from "../components/ToolTip";
import ControlAddIcon from "../icons/ControlAddIcon";


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
    <div>
      <div className="flx jcenter gap1 pad-0">
        <h2>Controles de Consulta</h2>
        <ToolTip text="Agregar Control">
          <button className="circle-btn m-0" onClick={addControlHandler}>
            <ControlAddIcon />
          </button>
        </ToolTip>
      </div>
      <p className="centrado pad-0">{paciente.nombre + " " + paciente.apellido}</p>

      <>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}

        >
          {controles.map((item, ind) => {
            if (!item.control) {
              return "";
            }

            return (
              <SwiperSlide key={ind}>
                <div className="flx column pad-0">
                  {dayjs(new Date(item.control.fechaControl)).format("DD/MM/YYYY")}
                  <p className="font-x negrita">Atendido por: Dr. {item.control.doctor?.nombre + " " + item.control.doctor?.apellido}</p>
                  <div className="flx gap-10">
                    <ToolTip text="Editar">
                      <button
                        className="circle-btn"
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
                    </ToolTip>
                    <ToolTip text="Factura">
                      <button
                        className="circle-btn"
                        onClick={() =>
                          navigate(
                            `/printfactura/${item.control._id
                            }?tipo=${"notaentrega"}`
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faFileInvoiceDollar} />
                      </button>
                    </ToolTip>
                    <ToolTip text="Recipe">
                      <button
                        className="circle-btn"
                        onClick={() =>
                          navigate(`/printrecipe/${item.control._id}`)
                        }
                      >
                        <FontAwesomeIcon className="small" icon={faMedkit} />
                      </button>
                    </ToolTip>
                    <ToolTip text="Eliminar">
                      <button
                        className="circle-btn"
                        onClick={() => deleteHandler(item.control)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </ToolTip>
                  </div>
                  <div className="slide-content-header">
                    <details>
                      
                    </details>
                  </div>
                  <div className="slide-content"></div>
                </div>


              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    </div>
  );
}
