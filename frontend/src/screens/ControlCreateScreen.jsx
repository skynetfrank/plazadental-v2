import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createControl } from "../actions/controlActions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CONTROL_CREATE_RESET } from "../constants/controlConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { addControlPaciente, detailsPaciente } from "../actions/pacienteActions";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import PaymentForm from "../components/PaymentForm";

function subtractHours(date, hours) {
  date.setHours(date.getHours() - hours);
  return date;
}

export default function ControlCreateScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const params = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { id: pacienteId } = params;

  const [doctorId, setDoctorId] = useState("");
  const [user] = useState(userInfo._id);
  const [fechaControl, setFechaControl] = useState(subtractHours(new Date(), 6));
  const [esCita1, setEsCita1] = useState(false);
  const [evaluacion, setEvaluacion] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [recipe, setRecipe] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [montoUsd, setMontoUsd] = useState("");
  const [cambioBcv, setCambioBcv] = useState(Number(localStorage.getItem("cambioBcv")).toFixed(2));
  const [montoBs, setMontoBs] = useState("");
  const [tasaIva] = useState(0.16);
  const [montoIva, setMontoIva] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [tasaComisionDr, setTasaComisionDr] = useState(0.40);
  const [tasaComisionPlaza, setTasaComisionPlaza] = useState(0.60);
  const [montoComisionDr, setMontoComisionDr] = useState(0);
  const [montoComisionPlaza, setMontoComisionPlaza] = useState(0);
  const [materiales, setMateriales] = useState([]);
  const [serviciosItems, setServiciosItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pago, setPago] = useState({});
  const [idServ, setIdServ] = useState("");
  const [precio, setPrecio] = useState(0);
  const [setTotalPago] = useState(0);
  const [setTxtformapago] = useState(0);
  const [listaDoctores] = useState(JSON.parse(localStorage.getItem("doctores")));
  const [listaServicios] = useState(JSON.parse(localStorage.getItem("servicios")));

  const pacienteDetails = useSelector((state) => state.pacienteDetails);
  const { paciente } = pacienteDetails;

  const controlCreate = useSelector((state) => state.controlCreate);
  const { success, control } = controlCreate;

  const dispatch = useDispatch();

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
    if (!paciente || paciente._id !== pacienteId) {
      dispatch(detailsPaciente(pacienteId));
    }
  }, [dispatch, paciente, pacienteId]);


  useEffect(() => {
    const doctorFound = listaDoctores.find((x) => x._id === doctorId)
    if (doctorFound) {
      setTasaComisionDr(doctorFound.tasaComisionDoctor)
      setTasaComisionPlaza(1 - doctorFound.tasaComisionDoctor)
    }
  }, [doctorId, listaDoctores])


  useEffect(() => {
    if (success) {
      Swal.fire({
        title: "Control Registrado con Exito!",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });
      dispatch(addControlPaciente(pacienteId, { controlID: control._id }));
      dispatch({ type: CONTROL_CREATE_RESET });
      dispatch(detailsPaciente(pacienteId));
      setDoctorId("");
      setFechaControl("");
      setEsCita1(false);
      setEvaluacion("");
      setTratamiento("");
      setMontoUsd(0);
      setCambioBcv(0);
      setMontoBs(0);
      setTasaComisionDr(0.40);
      setTasaComisionPlaza(0.60);
      setMontoComisionDr(0);
      setMontoComisionPlaza(0);
      setMateriales([]);
      setServiciosItems([]);
      setRecipe("");
      setIndicaciones("");
      setPago({})
    }
  }, [dispatch, control, navigate, success, pacienteId]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMontoComisionPlaza(tasaComisionPlaza * montoUsd)
    setMontoComisionDr(tasaComisionDr * montoUsd)
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
      createControl(
        pacienteId,
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
        pago
      )
    );
  };

  useEffect(() => {
    //TODO: AGREGAR BOTON PARA SERVICIO LABORATORIO
    //TODO:LA DISTRIBUCION DE COMISIONES SE HACE DESPUES DE RESTAR ALGUN SERVICIO DE LABORATORIO
    const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
    const itemsPrice = toPrice(serviciosItems.reduce((a, c) => a + c.cantidad * c.precioServ, 0));
    setMontoUsd(itemsPrice)
    setMontoBs(itemsPrice * cambioBcv)
    setMontoIva((itemsPrice * cambioBcv) * tasaIva)
    setMontoComisionDr((itemsPrice - descuento) * tasaComisionDr);
    setMontoComisionPlaza((itemsPrice - descuento) * tasaComisionPlaza);
  }, [cambioBcv, descuento, serviciosItems, tasaComisionDr, tasaComisionPlaza, tasaIva]);

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

  const dateHandler = (e) => {
    setFechaControl(e)
  }

  const getDescuento = async () => {
    const { value: discount } = await Swal.fire({
      title: "Descuento",
      input: "number",
      inputLabel: "Descuento",
      inputPlaceholder: "Ingrese un monto"

    });
    if (discount) {
      setDescuento(Number(discount))
    }
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
    console.log("data from payment", data, textopago)
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
      <div className="flx column jcenter">
        <div>
          <span className="action-map">Agregar Control</span>
          <h3 className="centrado font-12">{paciente?.nombre + " " + paciente?.apellido}</h3>
        </div>
        <input
          type="date"
          value={dayjs(fechaControl).format("YYYY-MM-DD")}
          onChange={(e) => dateHandler(e.target.value)}
        ></input>
        <div className="flx jcenter gap1 botonera-menu">
          <button className="font-x pad-0 m-0 negrita" onClick={() => getServicio()}>
            Servicios
          </button>
          {serviciosItems?.length > 0 ? (
            <button className="btn-pago font-x pad-0 m-0 negrita centrado" onClick={() => getDescuento()}>
              Descuento
            </button>
          ) : (
            ""
          )}

          <button form="form-new-control" className="font-x pad-0 m-0 negrita" type="submit">
            Guardar
          </button>
        </div>
        <div>
          {serviciosItems?.length > 0 ? (
            <div className="show-servicios">
              {serviciosItems.map((m, inx) => {
                const foundit = listaServicios.find((x) => x._id === m.servicio);

                return (
                  <div key={inx} className="flx mb03">
                    <span className="minw-10">{m.cantidad}</span>
                    <span className="maxw-200 minw-200">{foundit?.nombre + " ($" + foundit?.preciousd + ")"}</span>

                    <span className="minw-30 txt-align-r">${Number(m.montoItemServicio).toFixed(2)}</span>

                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={(e) => handleEliminarServicio(e, m.servicio)}
                      className="ml minw-20 txt-align-l"
                    />
                  </div>
                );
              })}
              <hr />
              <p className="centrado negrita minw-30">Descuento: ${descuento}</p>
              <p className="centrado negrita minw-30">Total Neto : ${montoUsd - descuento}</p>
              <div className="centrado">
                <button className="btn-pago font-x pad-0 m-0 negrita centrado" onClick={() => setShowPaymentModal(true)}>
                  Registrar Pago
                </button>
              </div>


            </div>
          ) : (
            ""
          )}
        </div>
        <div className="flx jcenter gap1 botonera-menu">
          <button className="font-x pad-0 m-0 negrita" onClick={() => getServicio()}>
            Laboratorio
          </button>
        </div>
        <form id="form-new-control" onSubmit={submitHandler}>
          <div className="flx jcenter wrap gap1">
            <div className="control-textarea-container">
              <div className="flx">
                <label>Evaluacion</label>
                <select value={doctorId} className="maxw-150 font-x ml" onChange={(e) => setDoctorId(e.target.value)}>
                  <option value="">Seleccionar Doctor</option>
                  {listaDoctores?.map((x, inx) => (
                    <option key={inx} value={x._id}>
                      {"Doctor " + x.nombre + " " + x.apellido}
                    </option>
                  ))}
                </select>
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
    </div>
  );
}
