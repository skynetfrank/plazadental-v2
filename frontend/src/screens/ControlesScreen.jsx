import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { deleteControlPaciente, detailsPaciente } from "../actions/pacienteActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//import the swiper yall
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { deleteControl } from "../actions/controlActions";
import { faFileInvoiceDollar, faMedkit, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ToolTip from "../components/ToolTip";
import ControlAddIcon from "../icons/ControlAddIcon";

export default function ControlesScreen(props) {
  const [controles, setControles] = useState([]);
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
        return Date.parse(objB.control?.fechaControl) - Date.parse(objA.control?.fechaControl);
      });

      setControles(sortedDesc);
    }
  }, [dispatch, pacienteId, paciente]);

  const deleteHandler = (control) => {
    Swal.fire({
      title: "Eliminar Control",
      text: "Esta seguro de Eliminar Este Control?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      let pw = prompt("Ingrese su clave", "");

      if (pw !== "matias01") {
        Swal.fire({
          title: "Clave Erronea, verifique...",
          text: "Ingrese Su Clave de Administrador",
          icon: "warning",
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
          icon: "success",
        });
      }
    });
  };

  const addControlHandler = () => {
    navigate(`/crearcontrol/${paciente._id}?escita1=${"no"}`);
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

      <>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + "</span>";
            },
          }}
        >
          {controles.map((item, ind) => {
            if (!item.control) {
              return "";
            }
            const itemPago = item.control.pago;
            return (
              <SwiperSlide key={ind}>
                <div>
                  <div>
                    <div className="flx jsb pad-0 control-header">
                      <span>{dayjs(new Date(item.control.fechaControl)).format("DD/MM/YYYY")}</span>
                      <p className="pad-0">{paciente.nombre + " " + paciente.apellido}</p>
                      <span>Doctor: {item.control.doctor?.nombre + " " + item.control.doctor?.apellido}</span>
                    </div>
                    <div className="flx jcenter gap-10 pad-0">
                      <ToolTip text="Editar">
                        <button
                          className="circle-btn"
                          onClick={async () => {
                            const { value: pw } = await Swal.fire({
                              title: "Clave de Autorizacion",
                              input: "password",
                              inputAttributes: {
                                maxlength: "10",
                                autocapitalize: "off",
                                autocorrect: "off",
                              },
                            });
                            if (pw !== "matias01") {
                              Swal.fire("Clave Incorrecta! Verifique!");
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
                          onClick={() => navigate(`/printfactura/${item.control._id}?tipo=${"notaentrega"}`)}
                        >
                          <FontAwesomeIcon icon={faFileInvoiceDollar} />
                        </button>
                      </ToolTip>
                      <ToolTip text="Ver Recipe">
                        <button className="circle-btn" onClick={() => navigate(`/printrecipe/${item.control._id}`)}>
                          <FontAwesomeIcon className="small" icon={faMedkit} />
                        </button>
                      </ToolTip>
                      <ToolTip text="Eliminar">
                        <button className="circle-btn" onClick={() => deleteHandler(item.control)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </ToolTip>
                    </div>
                    <div className="slide-content division">
                      <div className="border-bottom">
                        <h4>Evaluacion </h4>
                        <p>{item.control.evaluacion ? item.control.evaluacion : "No se Registro Evaluacion"}</p>
                      </div>
                      <div className="border-bottom">
                        <h4>Tratamiento</h4>
                        <p>{item.control.tratamiento ? item.control.tratamiento : "No se Registro Tratamiento"}</p>
                      </div>
                      <div className="border-bottom">
                        <h4>Recipe</h4>
                        <p>{item.control.recipe ? item.control.recipe : "No se Registro Recipe"}</p>
                      </div>
                      <div className="border-bottom">
                        <h4 className="mb-2">Indicaciones</h4>
                        <p>{item.control.indicaciones ? item.control.indicaciones : "No se Registro Indicaciones"}</p>
                      </div>

                      <div className="border-bottom">
                        <h4>
                          Facturacion {item.control.montoUsd > 0 ? "$" + Number(item.control.montoUsd).toFixed(2) : ""}
                        </h4>
                        <div className="flx column font-x astart show-control-facturacion">
                          <div className="flx">
                            <span className="negrita">Servicios&emsp;:</span>
                            <div>
                              {item.control.serviciosItems.map((item, ndx) => {
                                return (
                                  <div className="font-tiny" key={ndx}>
                                    <span className="negrita ml">
                                      {item.cantidad + " " + item.servicio.nombre + " " + item.montoItemServicio + "$"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <span className="negrita">Laboratorio: ${Number(item.control?.montoLab * 4).toFixed(2)}</span>
                          <span className="negrita">
                            Descuento&ensp;: ${Number(item.control?.descuento).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="border-bottom">
                        <h4>Pago</h4>
                        <div>
                          <p>{itemPago.efectivousd > 0 ? "Efectivo US$: " + item.control.pago.efectivousd : ""}</p>
                          <p>
                            {" "}
                            {itemPago.efectivoeuros > 0 ? "Efectivo Euros: " + item.control.pago.efectivoeuros : ""}
                          </p>
                          <p> {itemPago.efectivobs > 0 ? "Efectivo Bs.: " + item.control.pago.efectivobs : ""}</p>
                          <p>
                            {" "}
                            {itemPago.montopunto > 0
                              ? "Punto Bancario: " +
                                (item.control.pago.montopunto +
                                  item.control.pago.montopunto2 +
                                  item.control.pago.montopunto3)
                              : ""}
                          </p>
                          <p>
                            {" "}
                            {itemPago.pagomovil.montopagomovil > 0
                              ? "Pago Movil: " + item.control.pago.montopagomovil
                              : ""}
                          </p>
                          <p> {itemPago.zelle.montozelle > 0 ? "Zelle: " + item.control.montozelle : ""}</p>
                        </div>
                      </div>
                      <div className="border-bottom">
                        <h4>Comisiones</h4>
                        {item.control.montoComisionPlaza ? (
                          <p>
                            Comision Plaza&ensp;: $
                            {Number(item.control.montoComisionPlaza) > 1
                              ? Number(item.control.montoComisionPlaza).toFixed(2) +
                                " (" +
                                (Number(item.control.tasaComisionPlaza).toFixed(0) + "%)")
                              : Number(item.control.montoComisionPlaza).toFixed(2) +
                                " (" +
                                (Number(item.control.tasaComisionPlaza * 100).toFixed(0) + "%)")}
                          </p>
                        ) : (
                          ""
                        )}
                        {item.control.montoComisionDr ? (
                          <p>
                            Comision Doctor: $
                            {Number(item.control.montoComisionDr) > 1
                              ? Number(item.control.montoComisionDr).toFixed(2) +
                                " (" +
                                (Number(item.control.tasaComisionDr).toFixed(0) + "%)")
                              : Number(item.control.montoComisionDr).toFixed(2) +
                                " (" +
                                (Number(item.control.tasaComisionDr * 100).toFixed(0) + "%)")}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
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
