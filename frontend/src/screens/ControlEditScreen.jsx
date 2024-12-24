import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsControl, updateControl } from "../actions/controlActions";
import { useNavigate, useParams } from "react-router-dom";
import { CONTROL_UPDATE_RESET } from "../constants/controlConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import PaymentForm from "../components/PaymentForm";
import { listaLabs, tipoLab } from "../constants/listas";
import Loader from "../components/Loader";

function subtractHours(date, hours) {
  date.setHours(date.getHours() - hours);
  return date;
}

export default function ControlEditScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const params = useParams();
  const navigate = useNavigate();
  const { id: controlId } = params;

  const [doctorId, setDoctorId] = useState("");
  const [user] = useState(userInfo._id);
  const [fechaControl, setFechaControl] = useState(subtractHours(new Date(), 6));
  const [esCita1, setEsCita1] = useState(false);
  const [evaluacion, setEvaluacion] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [recipe, setRecipe] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [montoLab, setMontoLab] = useState("");
  const [laboratorio, setLaboratorio] = useState("");
  const [montoServicios, setMontoServicios] = useState("");
  const [montoUsd, setMontoUsd] = useState("");
  const [cambioBcv, setCambioBcv] = useState(Number(localStorage.getItem("cambioBcv")).toFixed(2));
  const [montoBs, setMontoBs] = useState("");
  const [tasaIva] = useState(0.16);
  const [montoIva, setMontoIva] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [tasaComisionDr, setTasaComisionDr] = useState(0.4);
  const [tasaComisionPlaza, setTasaComisionPlaza] = useState(0.6);
  const [montoComisionDr, setMontoComisionDr] = useState(0);
  const [montoComisionPlaza, setMontoComisionPlaza] = useState(0);
  const [materiales, setMateriales] = useState([]);
  const [serviciosItems, setServiciosItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pago, setPago] = useState({});
  const [idServ, setIdServ] = useState("");
  const [precio, setPrecio] = useState(0);
  const [totalPago, setTotalPago] = useState(0);
  const [txtformapago, setTxtformapago] = useState(0);
  const [listaDoctores] = useState(JSON.parse(localStorage.getItem("doctores")));
  const [listaServicios] = useState(JSON.parse(localStorage.getItem("servicios")));
  const [conceptoLaboratorio, setConceptoLaboratorio] = useState("");
  const [nombreDoctor, setNombreDoctor] = useState("");

  const controlDetails = useSelector((state) => state.controlDetails);
  const { loading, error, control } = controlDetails;

  const controlUpdate = useSelector((state) => state.controlUpdate);
  const { success: successUpdate } = controlUpdate;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successUpdate) {
      Swal.fire({
        title: "Informacion Actualizado!",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          navigate(`/controles/${control.paciente._id}`);
        }
      });
      dispatch({ type: CONTROL_UPDATE_RESET });
    }

    if (!control || control._id !== controlId || successUpdate) {
      dispatch({ type: CONTROL_UPDATE_RESET });
      dispatch(detailsControl(controlId));
    } else {
      setDoctorId(control.doctor._id || " ");
      setFechaControl(control.fechaControl);
      setEvaluacion(control.evaluacion || "");
      setTratamiento(control.tratamiento || "");
      setMontoUsd(control.montoUsd || 0);
      setCambioBcv(control.cambioBcv || 0);
      setMontoBs(control.montoBs || 0);
      setTasaComisionDr(control.tasaComisionDr || 40);
      setTasaComisionPlaza(control.tasaComisionPlaza || 60);
      setMontoComisionDr(control.montoComisionDr || 0);
      setMontoComisionPlaza(control.montoComisionPlaza || 0);
      setMateriales(control.materiales || []);
      setServiciosItems(control.serviciosItems || []);
      setRecipe(control.recipe || "");
      setIndicaciones(control.indicaciones || "");
      setPago(control.pago || {});
      setMontoLab(control.montoLab || 0);
      setConceptoLaboratorio(control.conceptoLaboratorio || "");
      setMontoServicios(control.montoServicios || 0);
      setLaboratorio(control.laboratorio || "");
      setDescuento(control.descuento || 0);
      let doc = listaDoctores.find((doc) => doc._id === doctorId)
      console.log("doc", doc)
      setNombreDoctor(
        doc?.nombre + " " + doc?.apellido
      );

    }
  }, [control, controlId, dispatch, navigate, successUpdate]);

  const conceptos = [
    "Profilaxis Dental                       ",
    "1 sesion de Limpieza Ultrsonica         ",
    "Aplicacion de Fluor                     ",
    "Caries Clase I                          ",
    "Caries Clase II                         ",
    "Caries Clase III                        ",
    "Caries Clase IV                         ",
    "Caries Clase V                          ",
    "Instalacion de Brackets Superior        ",
    "Instalacion de Brackets Inferior        ",
    "Blanqueamiento Dental                   ",
    "Control de Ortodoncia                   ",
    "Arco 12 Niti                            ",
    "Arco 14 Niti                            ",
    "Arco 16 Niti                            ",
    "Bracket Caido                           ",
  ];

  const selCantidad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    const doctorFound = listaDoctores.find((x) => x._id === doctorId);
    if (doctorFound) {
      setTasaComisionDr(doctorFound.tasaComisionDoctor);
      setTasaComisionPlaza(1 - doctorFound.tasaComisionDoctor);
    }
  }, [doctorId, listaDoctores]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMontoComisionPlaza(tasaComisionPlaza * montoUsd);
    setMontoComisionDr(tasaComisionDr * montoUsd);
    if (!doctorId) {
      Swal.fire({
        text: "Falta Seleccionar el Doctor",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });
      return;
    }

    dispatch(
      updateControl({
        _id: controlId,
        doctorId,
        user,
        fechaControl,
        esCita1,
        evaluacion,
        tratamiento,
        recipe,
        indicaciones,
        serviciosItems,
        materiales,
        cambioBcv,
        montoUsd,
        montoBs,
        tasaIva,
        montoIva,
        descuento,
        tasaComisionDr,
        tasaComisionPlaza,
        montoComisionDr,
        montoComisionPlaza,
        pago,
        montoLab,
        laboratorio,
        conceptoLaboratorio,
        montoServicios,
      })
    );
  };

  useEffect(() => {
    //TODO: AGREGAR BOTON PARA SERVICIO LABORATORIO
    //TODO:LA DISTRIBUCION DE COMISIONES SE HACE DESPUES DE RESTAR ALGUN SERVICIO DE LABORATORIO
    const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
    const itemsPrice = toPrice(serviciosItems.reduce((a, c) => a + c.cantidad * c.precioServ, 0));
    setMontoServicios(itemsPrice);
    setMontoUsd(itemsPrice + montoLab * 4 - descuento);
    setMontoBs((itemsPrice + montoLab * 4 - descuento) * cambioBcv);
    setMontoIva((itemsPrice + montoLab * 4 - descuento) * cambioBcv * tasaIva);
    setMontoComisionDr((itemsPrice + (montoLab * 4 - montoLab) - descuento) * tasaComisionDr);
    setMontoComisionPlaza((itemsPrice + (montoLab * 4 - montoLab) - descuento) * tasaComisionPlaza);
  }, [cambioBcv, descuento, montoLab, serviciosItems, tasaComisionDr, tasaComisionPlaza, tasaIva]);

  const handleEliminarServicio = (e, id) => {
    e.preventDefault();
    const newarray = serviciosItems.filter((x) => x.servicio !== id);
    setServiciosItems(newarray);
  };

  const getServicio = async () => {
    if (!doctorId) {
      Swal.fire({
        text: "Seleccione el Doctor",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });
      return;
    }
    if (cambioBcv <= 0) {
      Swal.fire({
        text: "Actualice el Cambio BCV",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
        icon: "error",
      });
      return;
    }
    const { value: id } = await Swal.fire({
      input: "select",
      inputOptions: {
        servicios: listaServicios.map((s) => s.nombre),
      },
      inputPlaceholder: "Seleccione un Servicio a Facturar",
      showCancelButton: true,

      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve();
            return;
          }

          resolve();
        });
      },
    });
    setIdServ(listaServicios[Number(id)]._id);
    setPrecio(listaServicios[Number(id)].preciousd);
    const { value: cant } = await Swal.fire({
      input: "select",
      inputOptions: {
        cantidad: selCantidad,
      },
      inputPlaceholder: "Seleccione una Cantidad",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve();
            return;
          }
          resolve();
        });
      },
    });

    if (!cant) {
      return;
    }
    setServiciosItems((prev) => {
      return [
        ...prev,
        {
          cantidad: Number(cant) + 1,
          servicio: listaServicios[Number(id)]._id,
          precioServ: listaServicios[Number(id)].preciousd,
          montoItemServicio: listaServicios[Number(id)].preciousd * (Number(cant) + 1),
        },
      ];
    });
  };

  const getLaboratorio = async () => {
    if (!doctorId) {
      Swal.fire({
        text: "Seleccione el Doctor",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });
      return;
    }
    if (cambioBcv <= 0) {
      Swal.fire({
        text: "Actualice el Cambio BCV",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
        icon: "error",
      });
      return;
    }

    const { value: id } = await Swal.fire({
      input: "select",
      inputOptions: {
        Laboratorios: listaLabs,
      },
      inputPlaceholder: "Seleccione un Laboratorio",
      showCancelButton: true,

      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve();
            return;
          }

          resolve();
        });
      },
    });
    setLaboratorio(listaLabs[Number(id)]);
    const { value: monto } = await Swal.fire({
      title: "Monto Laboratorio",
      input: "number",
      inputLabel: "MontoDescuento",
      inputPlaceholder: "Ingrese un monto",
    });
    if (monto) {
      setMontoLab(Number(monto));
    }
  };

  const dateHandler = (e) => {
    setFechaControl(e);
  };

  const getDescuento = async () => {
    const { value: discount } = await Swal.fire({
      title: "Descuento",
      input: "number",
      inputLabel: "Descuento",
      inputPlaceholder: "Ingrese un monto",
    });
    if (discount) {
      setDescuento(Number(discount));
    }
  };

  const getDoctor = async () => {
    const { value: idDoctor } = await Swal.fire({
      input: "select",
      inputOptions: {
        Doctores: listaDoctores.map((s) => s.nombre + " " + s.apellido),
      },
      inputPlaceholder: "Seleccione un Doctor",
      showCancelButton: true,

      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve();
            return;
          }

          resolve();
        });
      },
    });
    setDoctorId(listaDoctores[Number(idDoctor)]._id);
    setNombreDoctor(listaDoctores[Number(idDoctor)].nombre + " " + listaDoctores[Number(idDoctor)].apellido);
  };

  const handleEvaluacion = (e) => {
    e.preventDefault();
    setEvaluacion((current) => current + e.target.value);
  };

  const handleTratamiento = (e) => {
    e.preventDefault();
    setTratamiento((current) => current + e.target.value);
  };

  const handlePayFromChild = (data, textopago) => {
    setPago(data);
    const bs = Number(data.efectivobs) / Number(cambioBcv);
    const punto = Number(data.punto.montopunto) / Number(cambioBcv);
    const punto2 = Number(data.punto.montopunto2) / Number(cambioBcv);
    const punto3 = Number(data.punto.montopunto3) / Number(cambioBcv);
    const pmobil = Number(data.pagomovil.montopagomovil) / Number(cambioBcv);

    const suma =
      bs +
      punto +
      punto2 +
      punto3 +
      pmobil +
      Number(data.zelle.montozelle) +
      Number(data.efectivousd) +
      Number(data.efectivoeuros);

    setTotalPago(Number(suma));
    setTxtformapago(textopago);
  };

  return (
    <div>
      {loading ? (
        <Loader txt={"Cargando Control"} />
      ) : (
        <>
          <div className="flx column jcenter">
            <div>
              <span className="action-map">Editar Control</span>
              <h3 className="centrado font-12">{control?.paciente?.nombre + " " + control?.paciente?.apellido}</h3>
            </div>
            <input
              type="date"
              value={dayjs(fechaControl).format("YYYY-MM-DD")}
              onChange={(e) => dateHandler(e.target.value)}
            ></input>
            <div className="flx jcenter gap1 botonera-menu">
              <button className="font-x pad-0 m-0 negrita" onClick={() => getDoctor()}>
                Doctores
              </button>
              <button className="font-x pad-0 m-0 negrita" onClick={() => getServicio()}>
                Servicios
              </button>
              <button className="font-x pad-0 m-0 negrita" onClick={() => getLaboratorio()}>
                Laboratorio
              </button>
              {montoUsd > 0 ? (
                <button className="btn-pago font-x pad-0 m-0 negrita centrado" onClick={() => getDescuento()}>
                  Descuento
                </button>
              ) : (
                ""
              )}

              <button form="form-new-control" className="font-x pad-0 m-0 negrita" type="submit">
                Actualizar
              </button>
            </div>
            {montoLab > 0 ? (
              <div className="flx abase pad-0">
                <div className="flx column astart pad-05">
                  <label>Concepto Laboratorio</label>
                  <input
                    type="text"
                    className="b-radius border-1 b-radius-05 pad-05 w-full"
                    value={conceptoLaboratorio}
                    list="tipoLab"
                    required
                    maxLength={50}
                    onChange={(e) => setConceptoLaboratorio(e.target.value)}
                  ></input>
                  <datalist id="tipoLab">
                    {tipoLab.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>
            ) : (
              ""
            )}
            <div>
              {serviciosItems?.length > 0 || montoUsd > 0 ? (
                <div className="show-servicios">
                  {serviciosItems.map((m, inx) => {
                    const foundit = listaServicios.find((x) => x._id === m.servicio._id);

                    return (
                      <div key={inx} className="flx mb03">
                        <span className="minw-10">{m.cantidad}</span>
                        <span className="maxw-200 minw-200">{foundit?.nombre + " ($" + foundit?.preciousd + ")"}</span>

                        <span className="minw-40 txt-align-r">${Number(m.montoItemServicio).toFixed(2)}</span>

                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          onClick={(e) => handleEliminarServicio(e, m.servicio)}
                          className="ml minw-20 txt-align-l"
                        />
                      </div>
                    );
                  })}
                  <hr />
                  <p className="centrado negrita minw-30">
                    Servicios: ${serviciosItems.reduce((sum, s) => sum + s.montoItemServicio, 0)}
                  </p>
                  <p className="centrado negrita minw-30">Laboratorio: ${montoLab * 4}</p>
                  <p className="centrado negrita minw-30">Descuento: ${descuento}</p>
                  <p className="centrado negrita minw-30">Total Neto : ${montoUsd}</p>
                  <div className="centrado">
                    <button
                      className="btn-pago font-x pad-0 m-0 negrita centrado"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      Registrar Pago
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            <form id="form-new-control" onSubmit={submitHandler}>
              <div className="flx jcenter wrap gap1">
                <div className="control-textarea-container">
                  <div className="flx jsb">
                    <label>Evaluacion</label>
                    <span className="nombre-doctor">{nombreDoctor ? "Doctor: " + nombreDoctor : ""}</span>
                  </div>

                  <textarea rows="4" value={evaluacion} onChange={(e) => setEvaluacion(e.target.value)}></textarea>
                  <select className="pos-abs select-btn" onChange={(e) => handleEvaluacion(e)}>
                    <option value="">Seleccionar</option>
                    {conceptos.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="control-textarea-container">
                  <label>Tratamiento</label>
                  <textarea rows="4" value={tratamiento} onChange={(e) => setTratamiento(e.target.value)}></textarea>
                  <select className="pos-abs select-btn" onChange={(e) => handleTratamiento(e)}>
                    <option value="">Seleccionar</option>
                    {conceptos.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="control-textarea-container">
                  <label>Recipe</label>
                  <textarea rows="3" value={recipe} onChange={(e) => setRecipe(e.target.value)}></textarea>
                </div>
                <div className="control-textarea-container">
                  <label>Indicaciones</label>
                  <textarea rows="3" value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)}></textarea>
                </div>
              </div>
            </form>
          </div>
          {showPaymentModal && (
            <PaymentForm
              onClose={() => setShowPaymentModal(false)}
              sendPayToParent={handlePayFromChild}
              montoPagoBs={Number(montoUsd * cambioBcv).toFixed(2)}
              montoPagoUsd={Number(montoUsd).toFixed(2)}
            />
          )}
        </>
      )}
    </div>
  );
}
