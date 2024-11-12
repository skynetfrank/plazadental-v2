import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createControl } from "../actions/controlActions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CONTROL_CREATE_RESET } from "../constants/controlConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { addControlPaciente, detailsPaciente } from "../actions/pacienteActions";
import dayjs from "dayjs";
import Swal from "sweetalert2";

function subtractHours(date, hours) {
  date.setHours(date.getHours() - hours);
  return dayjs(date).format("YYYY-MM-DD");
}

export default function ControlCreateScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const params = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { id: pacienteId } = params;
  const cita1 = new URLSearchParams(search).get("escita1");

  const [doctorId, setDoctorId] = useState("");
  const [servicioId, setServicioId] = useState("");
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
  const [tasaIva, setTasaIva] = useState(0.16);
  const [montoIva, setMontoIva] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [tasaComisionDr, setTasaComisionDr] = useState(40);
  const [tasaComisionPlaza, setTasaComisionPlaza] = useState(60);
  const [montoComisionDr, setMontoComisionDr] = useState(0);
  const [montoComisionPlaza, setMontoComisionPlaza] = useState(0);
  const [materiales, setMateriales] = useState([]);
  const [serviciosItems, setServiciosItems] = useState([]);
  const [qty, setQty] = useState(1);
  const [qtyServ, setQtyServ] = useState(1);
  const [pagoInfo, setPagoInfo] = useState({});
  const [fechaPago, setFechaPago] = useState("");

  const [listaDoctores] = useState(JSON.parse(localStorage.getItem("doctores")));
  const [listaServicios] = useState(JSON.parse(localStorage.getItem("servicios")));

  const pacienteDetails = useSelector((state) => state.pacienteDetails);
  const { paciente } = pacienteDetails;

  const controlCreate = useSelector((state) => state.controlCreate);
  const { error, success, control } = controlCreate;

  const dispatch = useDispatch();

  const bancos = [
    "Venezuela",
    "Banesco",
    "Mercantil",
    "Caribe",
    "BNC",
    "Provincial",
    "Bancamiga",
    "Banco Vzno Cdto",
    "Banco del Tesoro",
  ];

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

  const selCantidad = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    if (!paciente || paciente._id !== pacienteId) {
      dispatch(detailsPaciente(pacienteId));
    }
  }, [dispatch, paciente, pacienteId]);

  useEffect(() => {
    setMontoComisionDr(totalGeneral * (tasaComisionDr / 100));
    setMontoComisionPlaza(totalGeneral * (tasaComisionPlaza / 100));
    setMontoUsd(totalGeneral);
    setMontoBs(montoUsd * cambioBcv);
    setMontoIva(montoBs * tasaIva);

  }, [
    cambioBcv,
    montoBs,
    montoComisionDr,
    montoComisionPlaza,
    montoIva,
    montoUsd,
    tasaComisionDr,
    tasaComisionPlaza,
    tasaIva,
    totalGeneral,
  ]);

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: "Control Registrado con Exito!",
        text: "Registrar Nuevo Control de Citas",
        icon: "success",
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
      setTasaComisionDr(40);
      setTasaComisionPlaza(60);
      setMontoComisionDr(0);
      setMontoComisionPlaza(0);
      setMateriales([]);
      setServiciosItems([]);
      setFechaPago("");
      setRecipe("");
      setIndicaciones("");
      setPagoInfo({});
    }
  }, [dispatch, control, navigate, success, pacienteId]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submitHandler")
    if (!doctorId) {
      Swal.fire({
        title: "Falta El Doctor",
        text: "Seleccionar Doctor",
        icon: "warning",
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
        totalGeneral,
        tasaComisionDr,
        tasaComisionPlaza,
        montoComisionDr,
        montoComisionPlaza,
        pagoInfo
      )
    );
  };

  const handleEvaluacion = (e) => {
    e.preventDefault();
    setEvaluacion((current) => current + e.target.value);
  };

  const handleTratamiento = (e) => {
    e.preventDefault();
    setTratamiento((current) => current + e.target.value);
  };

  const handleServicios = (e) => {
    e.preventDefault();
    const esteServicio = listaServicios.find((x) => x._id === servicioId);
    if (!esteServicio) {
      Swal.fire({
        title: "Falta El Servicio!",
        text: "Seleccionar Servicio",
        icon: "warning",
      });
      return;
    }


    setServiciosItems((current) => [
      ...current,
      {
        cantidad: qtyServ,
        servicio: servicioId,
        precioServ: esteServicio.preciousd,
        montoItemServicio: qtyServ * esteServicio.preciousd,
      },
    ]);
    setQtyServ(1);
  };

  useEffect(() => {
    const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
    const itemsPrice = toPrice(serviciosItems.reduce((a, c) => a + c.cantidad * c.precioServ, 0));

    setTotalGeneral(itemsPrice);
  }, [serviciosItems]);

  const handleEliminarServicio = (e, id) => {
    e.preventDefault();
    const newarray = serviciosItems.filter((x) => x.servicio !== id);
    setServiciosItems(newarray);
  };

  return (

    <div>
      <div className="flx column jcenter">
        <h3 className="centrado">{paciente?.nombre + " " + paciente?.apellido}</h3>
        <h4>Agregar Control</h4>
        <input
          type="date"
          placeholder=" "
          value={fechaControl}
          onChange={(e) => setFechaControl(e.target.value)}
        ></input>
        <div className="flx jcenter gap1 botonera-menu">
          <button className="font-x pad-0 m-0 negrita">Facturar Servicios</button>
          <button className="font-x pad-0 m-0 negrita">Informacion de Pago</button>
          <button className="font-x pad-0 m-0 negrita">Guardar Control</button>
        </div>


        <form onSubmit={submitHandler}>
          <div className="flx jcenter wrap gap1">
            <div className="control-textarea-container">
              <div className="flx">
                <label>Evaluacion</label>
                <select value={doctorId} className="maxw-150 font-x m-05" onChange={(e) => setDoctorId(e.target.value)}>
                  <option value="">Seleccionar Doctor</option>
                  {listaDoctores?.map((x, inx) => (
                    <option key={inx} value={x._id}>
                      {"Doctor " + x.nombre + " " + x.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows="5"
                value={evaluacion}
                onChange={(e) => setEvaluacion(e.target.value)}
              ></textarea>
              <select onChange={(e) => handleEvaluacion(e)}>
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
              <textarea
                rows="5"
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
              ></textarea>
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
              <textarea
                rows="5"
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
              ></textarea>
            </div>
            <div className="control-textarea-container">
              <label>Indicaciones</label>
              <textarea
                rows="5"
                value={indicaciones}
                onChange={(e) => setIndicaciones(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="centrado">
            <button type="submit">
              Registrar Control
            </button>
          </div>

        </form>

      </div>
    </div >

  );
}
