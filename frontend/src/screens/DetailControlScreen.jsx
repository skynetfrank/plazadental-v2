import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deleteControlPaciente, detailsPaciente } from "../actions/pacienteActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoiceDollar, faMedkit, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ToolTip from "../components/ToolTip";
import { detailsControl } from "../actions/controlActions";
import EditIcon from "../icons/EditIcon";


export default function DetailControlScreen(props) {
  const navigate = useNavigate();
  const params = useParams();
  const { id: controlId } = params;

  const controlDetails = useSelector((state) => state.controlDetails);
  const { control, loading, error } = controlDetails;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!control || (control && control._id !== controlId)) {
      dispatch(detailsControl(controlId));
    }

  }, [control, controlId, dispatch]);

  console.log("detail-control", control)
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>

      <>
        <div>
          <div className="flx column jcenter">
            <div className="flx column jsb pad-0 control-header">
              <span className="font-20">Control del {dayjs(new Date(control.fechaControl)).format("DD/MM/YYYY")}</span>
              <div className="flx">
                <p className="mr font-14">   Paciente: <strong>{control.paciente.nombre + " " + control.paciente.apellido}</strong></p>
                <Link to={`/paciente/${control.paciente._id}/edit`} className="link-to-paciente">
                  <EditIcon />
                </Link>
              </div>

            
            </div>
            <div className="flx jcenter gap-10 pad-0">
              <div className="controles-doctor-container">
                <label>Doctor</label>
                <span>{control.doctor?.nombre + " " + control.doctor?.apellido}</span>
              </div>
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
                      navigate(`/control/${control._id}/edit`);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </ToolTip>
              <ToolTip text="Factura">
                <button
                  className="circle-btn"
                  onClick={() => navigate(`/printfactura/${control._id}?tipo=${"notaentrega"}`)}
                >
                  <FontAwesomeIcon icon={faFileInvoiceDollar} />
                </button>
              </ToolTip>
              <ToolTip text="Ver Recipe">
                <button className="circle-btn" onClick={() => navigate(`/printrecipe/${control._id}`)}>
                  <FontAwesomeIcon className="small" icon={faMedkit} />
                </button>
              </ToolTip>

            </div>
            <div className="slide-content division detail">
              <div className="border-bottom">
                <h4>Evaluacion </h4>
                <p>{control.evaluacion ? control.evaluacion : "No se Registro Evaluacion"}</p>
              </div>
              <div className="border-bottom">
                <h4>Tratamiento</h4>
                <p>{control.tratamiento ? control.tratamiento : "No se Registro Tratamiento"}</p>
              </div>
              <div className="border-bottom">
                <h4>Recipe</h4>
                <p>{control.recipe ? control.recipe : "No se Registro Recipe"}</p>
              </div>
              <div className="border-bottom">
                <h4 className="mb-2">Indicaciones</h4>
                <p>{control.indicaciones ? control.indicaciones : "No se Registro Indicaciones"}</p>
              </div>

              <div className="border-bottom">
                <h4>
                  Facturacion {control.montoUsd > 0 ? "$" + Number(control.montoUsd).toFixed(2) : ""}
                </h4>
                <div className="flx column font-x astart show-control-facturacion">
                  <div className="flx">
                    <span className="negrita">Servicios&emsp;:</span>
                    <div>
                      {control.serviciosItems.map((item, ndx) => {
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
                  <span className="negrita">Laboratorio: ${Number(control?.montoLab * 4).toFixed(2)}</span>
                  <span className="negrita">
                    Descuento&ensp;: ${Number(control?.descuento).toFixed(2)}
                  </span>
                </div>
              </div>


              <div className="border-bottom">
                <h4>Comisiones</h4>
                {control.montoComisionPlaza ? (
                  <p>
                    Comision Plaza&ensp;: $
                    {Number(control.montoComisionPlaza) > 1
                      ? Number(control.montoComisionPlaza).toFixed(2) +
                      " (" +
                      (Number(control.tasaComisionPlaza).toFixed(0) + "%)")
                      : Number(control.montoComisionPlaza).toFixed(2) +
                      " (" +
                      (Number(control.tasaComisionPlaza * 100).toFixed(0) + "%)")}
                  </p>
                ) : (
                  ""
                )}
                {control.montoComisionDr ? (
                  <p>
                    Comision Doctor: $
                    {Number(control.montoComisionDr) > 1
                      ? Number(control.montoComisionDr).toFixed(2) +
                      " (" +
                      (Number(control.tasaComisionDr).toFixed(0) + "%)")
                      : Number(control.montoComisionDr).toFixed(2) +
                      " (" +
                      (Number(control.tasaComisionDr * 100).toFixed(0) + "%)")}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
