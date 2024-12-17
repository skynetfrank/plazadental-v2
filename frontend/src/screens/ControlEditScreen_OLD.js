import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsControl, updateControl } from "../actions/controlActions";
import { listDoctores } from "../actions/doctorActions";
import LoadingBox from "../components/LoadingBox";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CONTROL_UPDATE_RESET } from "../constants/controlConstants";
import MessageBox from "../components/MessageBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { listProducts } from "../actions/productActions";
import { format } from "date-fns";
import { listAllServicios } from "../actions/servicioActions";

export default function ControlEditScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const params = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { id: controlId } = params;
  const cita1 = new URLSearchParams(search).get("escita1");
  const [doctorId, setDoctorId] = useState("");
  const [productId, setProductId] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [user, setUser] = useState(userInfo._id);
  const [fechaControl, setFechaControl] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [esCita1, setEsCita1] = useState(Boolean(cita1));
  const [evaluacion, setEvaluacion] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [recipe, setRecipe] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [montoUsd, setMontoUsd] = useState("");
  const [cambioBcv, setCambioBcv] = useState(
    Number(localStorage.getItem("cambioDia")).toFixed(2)
  );
  const [montoBs, setMontoBs] = useState("");
  const [tasaIva, setTasaIva] = useState(0.16);
  const [montoIva, setMontoIva] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [totalGeneralBs, setTotalGeneralBs] = useState(0);
  const [tasaComisionDr, setTasaComisionDr] = useState(40);
  const [tasaComisionPlaza, setTasaComisionPlaza] = useState(60);
  const [montoComisionDr, setMontoComisionDr] = useState(0);
  const [montoComisionPlaza, setMontoComisionPlaza] = useState(0);
  const [materiales, setMateriales] = useState([]);
  const [serviciosItems, setServiciosItems] = useState([]);
  const [qty, setQty] = useState(1);
  const [qtyServ, setQtyServ] = useState(1);
  const [pagoInfo, setPagoInfo] = useState({});
  const [fechaPago, setFechaPago] = useState(format(new Date(), "yyyy-MM-dd"));
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const [transferencia, setTransferencia] = useState(0);
  const [refTransfer, setRefTransfer] = useState("");
  const [bancoTransfer, setBancoTransfer] = useState("");
  const [montoZelle, setMontoZelle] = useState(0);
  const [refZelle, setRefZelle] = useState("");
  const [cuentaZelle, setCuentaZelle] = useState("");
  const [montoPagoMobil, setMontoPagoMobil] = useState("");
  const [refPagoMobil, setRefPagoMobil] = useState("");
  const [bancoPagoMobil, setBancoPagoMobil] = useState("");
  const [tarjetaDebito, setTarjetaDebito] = useState(0);
  const [refTarjetaDebito, setRefTarjetaDebito] = useState("");
  const [bancoTarjetaDebito, setBancoTarjetaDebito] = useState("");
  const [tarjetaCredito, setTarjetaCredito] = useState(0);
  const [refTarjetaCredito, setRefTarjetaCredito] = useState("");
  const [bancoTarjetaCredito, setBancoTarjetaCredito] = useState("");
  const [brandTarjetaCredito, setBrandTarjetaCredito] = useState("");
  const [detallePago, setDetallePago] = useState("");
  const [memoPago, setMemoPago] = useState("");

  const [togglePago, setTogglePago] = useState(false);
  const [toggleMateriales, setToggleMateriales] = useState(false);
  const [toggleServicios, setToggleServicios] = useState(false);
  const [toggleComisiones, setToggleComisiones] = useState(false);

  const doctorList = useSelector((state) => state.doctorList);
  const { loading: loadingDoctors, doctores } = doctorList;

  const productList = useSelector((state) => state.productList);
  const { loading: loadingProducts, products } = productList;

  const servicioAllList = useSelector((state) => state.servicioAllList);
  const { loading: loadingServicios, servicios } = servicioAllList;

  const controlDetails = useSelector((state) => state.controlDetails);
  const { loading, error, control } = controlDetails;

  const controlUpdate = useSelector((state) => state.controlUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = controlUpdate;

  const dispatch = useDispatch();

  const brandSel = ["Visa", "MasterCard"];
  const tasaSel = [...Array(100).keys()];

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
    /*  if (!control) {
      dispatch(detailsControl(controlId));
    } */
    dispatch(listDoctores({}));
    dispatch(listProducts({}));
    dispatch(listAllServicios({}));
  }, [control, controlId, dispatch]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Informacion Actualizada ok", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch({ type: CONTROL_UPDATE_RESET });
      navigate("/pacientelist");
    }
    if (!control || control._id !== controlId || successUpdate) {
      dispatch({ type: CONTROL_UPDATE_RESET });
      dispatch(detailsControl(controlId));
    } else {
      setDoctorId(control.doctor._id || " ");
      setFechaControl(
        format(new Date(control.fechaControl), "yyyy-MM-dd") || ""
      );
      setEsCita1(control.esCita1 || false);
      setEvaluacion(control.evaluacion || "");
      setTratamiento(control.tratamiento || "");
      setMontoUsd(control.montoUsd || 0);
      setCambioBcv(control.cambioBcv || 0);
      setMontoBs(control.montoBs || 0);
      setTotalGeneralBs(control.totalGeneral || 0);
      setTasaComisionDr(control.tasaComisionDr || 40);
      setTasaComisionPlaza(control.tasaComisionPlaza || 60);
      setMontoComisionDr(control.montoComisionDr || 0);
      setMontoComisionPlaza(control.montoComisionPlaza || 0);
      setMateriales(control.materiales || []);
      setServiciosItems(control.serviciosItems || []);
      setFechaPago(
        format(new Date(control.pagoInfo.fechaPago), "yyyy-MM-dd") ||
          format(new Date(), "yyyy-MM-dd")
      );
      setRecipe(control.recipe || "");
      setIndicaciones(control.indicaciones || "");
      setPagoInfo(control.pagoInfo || {});
      console.log("control:", control);
    }
  }, [control, controlId, dispatch, navigate, successUpdate]);

  useEffect(() => {
    const fecha = fechaPago ? format(new Date(fechaPago), "dd-MM-yyyy") : "";
    const cash = montoEfectivo > 0 ? " - Efectivo: $" + montoEfectivo : "";
    const trf =
      transferencia > 0
        ? " - Transferencia " + bancoTransfer + " ref:" + refTransfer
        : "";
    const pmobil =
      montoPagoMobil > 0
        ? " - Pago Movil " + bancoPagoMobil + " ref:" + refPagoMobil
        : "";
    const tdb =
      tarjetaDebito > 0
        ? " - Tarjeta de Debito " +
          bancoTarjetaDebito +
          " ref:" +
          refTarjetaDebito
        : "";
    const tdc =
      tarjetaCredito > 0
        ? " - Tarjeta de Credito " +
          brandTarjetaCredito +
          " " +
          bancoTarjetaCredito +
          " ref: " +
          refTarjetaCredito
        : "";
    const titular = cuentaZelle ? "titular: " + cuentaZelle : "";
    const zelle =
      montoZelle > 0 ? " Zelle ref:" + refZelle + " " + titular : "";

    const stringPago =
      "Pagado el " + fecha + ": " + cash + trf + pmobil + tdb + tdc + zelle;

    if (!cash && !trf && !pmobil && !tdb && !tdc && !zelle) {
      setPagoInfo({});
    }

    if (cash || trf || pmobil || tdb || tdc || zelle) {
      setPagoInfo({
        status: "pagado",
        fechaPago,
        detallePago: stringPago,
        memoPago,
      });
    }
  }, [
    bancoPagoMobil,
    bancoTarjetaCredito,
    bancoTarjetaDebito,
    bancoTransfer,
    brandTarjetaCredito,
    cuentaZelle,
    detallePago,
    fechaPago,
    memoPago,
    montoEfectivo,
    montoPagoMobil,
    montoZelle,
    refPagoMobil,
    refTarjetaCredito,
    refTarjetaDebito,
    refTransfer,
    refZelle,
    tarjetaCredito,
    tarjetaDebito,
    transferencia,
  ]);

  useEffect(() => {
    setMontoComisionDr(totalGeneral * (tasaComisionDr / 100));
    setMontoComisionPlaza(totalGeneral * (tasaComisionPlaza / 100));
    setMontoUsd(totalGeneral);
    setMontoBs(montoUsd * cambioBcv);
    setMontoIva(montoBs * tasaIva);
    setTotalGeneralBs(montoBs + montoIva);
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

  const submitHandler = (e) => {
    e.preventDefault();

    if (!doctorId) {
      toast.warning("Seleccione Un Doctor", {
        position: "top-center",
        autoClose: 500,
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
        totalGeneral,
        tasaComisionDr,
        tasaComisionPlaza,
        montoComisionDr,
        montoComisionPlaza,
        pagoInfo,
      })
    );
  };

  const ftogglePago = (e) => {
    e.preventDefault();
    setTogglePago(true);
    setToggleMateriales(false);
    setToggleServicios(false);
    setToggleComisiones(false);
  };

  const ftoggleMateriales = (e) => {
    e.preventDefault();
    setTogglePago(false);
    setToggleMateriales(true);
    setToggleServicios(false);
    setToggleComisiones(false);
  };

  const ftoggleServicios = (e) => {
    e.preventDefault();
    setTogglePago(false);
    setToggleMateriales(false);
    setToggleServicios(true);
    setToggleComisiones(false);
  };

  const ftoggleComisiones = (e) => {
    e.preventDefault();
    setTogglePago(false);
    setToggleMateriales(false);
    setToggleServicios(false);
    setToggleComisiones(true);
  };

  const handleMaterials = (e) => {
    e.preventDefault();

    //La funcion setState tiene el ultimo valor de la variable o el array (current)
    //asi que usando el spread operator se agrega todos los valores anteriores y el nuevo a continuacion
    setMateriales((current) => [
      ...current,
      { cantidad: qty, producto: productId },
    ]);
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
    const esteServicio = servicios.find((x) => x._id === servicioId);
    if (!esteServicio) {
      toast.info("Debe Seleccionar un Servicio!", {
        position: "top-center",
        autoClose: 500,
      });
      return;
    }
    //La funcion setState tiene el ultimo valor de la variable o el array (current)
    //asi que usando el spread operator se agrega todos los valores anteriores y el nuevo a continuacion

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
    const itemsPrice = toPrice(
      serviciosItems.reduce((a, c) => a + c.cantidad * c.precioServ, 0)
    );

    setTotalGeneral(itemsPrice);
  }, [serviciosItems]);

  const handleEliminarServicio = (e, id) => {
    e.preventDefault();

    const newarray = serviciosItems.filter((x) => x.servicio !== id);

    setServiciosItems(newarray);
  };
  //console.log('servicios:', servicios);
  return (
    <div className="main-container">
      <h1>Editar Control de Consulta</h1>
      <div>
        <form id="form-control" onSubmit={submitHandler}>
          {loadingDoctors ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="inputs-section center">
              <div
                className="select-wrapper"
                data-title="Atendido por el Doctor"
              >
                <select
                  value={doctorId}
                  className="input select"
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  {doctores?.map((x, inx) => (
                    <option key={inx} value={x._id}>
                      {x.nombre + " " + x.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h2-absolute">
                <h2>
                  {control?.paciente.nombre + " " + control?.paciente.apellido}
                </h2>
              </div>

              <div className="input-group">
                <input
                  type="date"
                  placeholder=" "
                  className="input fecha"
                  min="2020-12-31"
                  max="2030-12-31"
                  value={fechaControl}
                  autoComplete="off"
                  onChange={(e) => setFechaControl(e.target.value)}
                ></input>
                <label className="user-label">Fecha</label>
              </div>
            </div>
          )}

          <div className="inputs-section tablet">
            <div className="select-wrapper" data-title="Evaluacion">
              <textarea
                className="textarea tablet"
                rows="7"
                value={evaluacion}
                onChange={(e) => setEvaluacion(e.target.value)}
              ></textarea>
              <select
                className="input btn-select"
                onChange={(e) => handleEvaluacion(e)}
              >
                <option value="">Seleccionar</option>
                {conceptos.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-wrapper" data-title="Tratamiento">
              <textarea
                className="textarea tablet"
                rows="7"
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
              ></textarea>
              <select
                className="input btn-select"
                onChange={(e) => handleTratamiento(e)}
              >
                <option value="">Seleccionar</option>
                {conceptos.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-wrapper" data-title="Recipe">
              <textarea
                className="textarea tablet"
                rows="7"
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
              ></textarea>
            </div>
            <div className="select-wrapper" data-title="Indicaciones">
              <textarea
                className="textarea tablet"
                rows="7"
                value={indicaciones}
                onChange={(e) => setIndicaciones(e.target.value)}
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
              <button onClick={ftoggleComisiones} className="button">
                Comisiones
              </button>
            </div>

            <div>
              <button onClick={ftogglePago} className="button">
                Pago Info
              </button>
            </div>
          </div>
          {toggleMateriales && (
            <div>
              {loadingProducts ? (
                <LoadingBox></LoadingBox>
              ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
              ) : (
                <div>
                  <div className="inputs-section materiales">
                    <div className="select-wrapper" data-title="Materiales">
                      <select
                        value={productId}
                        className="input select"
                        onChange={(e) => setProductId(e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        {products?.map((x, inx) => (
                          <option key={inx} value={x._id}>
                            {x.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="select-wrapper" data-title="Cantidad">
                      <select
                        className="input select small"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(12).keys()].map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button
                        onClick={(e) => handleMaterials(e)}
                        className="button small"
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </button>
                    </div>
                    {materiales && (
                      <div className="cuadro-detalles">
                        {materiales.map((m) => {
                          const foundit = products.find(
                            (x) => x._id === m.producto
                          );
                          return (
                            <span>{foundit?.nombre + " " + m?.cantidad}</span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {toggleServicios && (
            <div>
              {loadingServicios ? (
                <LoadingBox></LoadingBox>
              ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
              ) : (
                <div>
                  <div className="inputs-section servicios">
                    <div
                      className="select-wrapper"
                      data-title="Servicio Aplicado"
                    >
                      <select
                        value={servicioId}
                        className="input select w340"
                        onChange={(e) => setServicioId(e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        {servicios?.map((x, inx) => (
                          <option key={inx} value={x._id}>
                            {x.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="select-wrapper" data-title="Cant.">
                      <select
                        className="input select qty"
                        value={qtyServ}
                        onChange={(e) => setQtyServ(e.target.value)}
                      >
                        {selCantidad.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="select-wrapper">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        onClick={(e) => handleServicios(e)}
                        className="add-service-icon"
                      />
                    </div>
                    <div className="total-servicios">
                      <span>{totalGeneral.toFixed(2)}</span>
                    </div>
                    {serviciosItems && (
                      <div className="cuadro-detalles">
                        {serviciosItems.map((m, inx) => {
                          let foundit = [];
                          if (m.servicio._id) {
                            foundit = servicios.find(
                              (x) => x._id === m.servicio._id
                            );
                          } else {
                            foundit = servicios.find(
                              (x) => x._id === m.servicio
                            );
                          }

                          return (
                            <div key={inx} className="div-item-detalles">
                              <span className="item-detalles">
                                {foundit?.nombre +
                                  " : " +
                                  m?.cantidad +
                                  " por " +
                                  foundit.preciousd +
                                  " c/u " +
                                  " = " +
                                  m.montoItemServicio +
                                  " $"}
                              </span>
                              <button
                                className="button mini"
                                onClick={(e) =>
                                  handleEliminarServicio(e, m.servicio)
                                }
                              >
                                x
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {toggleComisiones && (
            <div>
              <div
                className="inputs-section comisiones"
                data-title="Comisiones"
              >
                <div className="select-wrapper" data-title="Comision PD">
                  <select
                    className="input select small"
                    value={tasaComisionPlaza}
                    onChange={(e) => setTasaComisionPlaza(e.target.value)}
                  >
                    {tasaSel.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-wrapper" data-title="Comision Dr.">
                  <select
                    className="input select small"
                    value={tasaComisionDr}
                    onChange={(e) => setTasaComisionDr(e.target.value)}
                  >
                    {tasaSel.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>

                <span data-title="Monto Comision PD">{montoComisionPlaza}</span>
                <span data-title="Monto Comision Dr">{montoComisionDr}</span>
              </div>
            </div>
          )}

          {togglePago && (
            <>
              <div
                className="inputs-section show-pago"
                data-titulo="Editar Pago (definir todo)"
              >
                <span className="mostrar-string-pago">
                  {control.pagoInfo.detallePago}
                </span>
              </div>
              <div className="inputs-section">
                <div className="input-group">
                  <input
                    type="date"
                    id="fecha-pago"
                    placeholder=" "
                    className="input"
                    min="2020-12-31"
                    max="2030-12-31"
                    autoComplete="off"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                  ></input>
                  <label className="user-label">Fecha del Pago</label>
                </div>

                <div className="input-group">
                  <input
                    type="number"
                    step={"any"}
                    placeholder=" "
                    className="input"
                    autoComplete="off"
                    maxLength={20}
                    onChange={(e) => setMontoEfectivo(e.target.value)}
                  ></input>
                  <label htmlFor="apellido" className="user-label">
                    Efectivo Dolares $
                  </label>
                </div>

                <div
                  className="payment-group-section"
                  data-title="Transferencia"
                >
                  <select
                    value={bancoTransfer}
                    onChange={(e) => setBancoTransfer(e.target.value)}
                  >
                    <option value="">Banco</option>
                    {bancos.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                  <div className="input-group">
                    <input
                      type="number"
                      step={"any"}
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setTransferencia(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Monto Bs.
                    </label>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setRefTransfer(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Referencia
                    </label>
                  </div>
                </div>
                <div className="payment-group-section" data-title="Pago Mobil">
                  <select
                    value={bancoPagoMobil}
                    onChange={(e) => setBancoPagoMobil(e.target.value)}
                  >
                    <option value="">Banco</option>
                    {bancos.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>

                  <div className="input-group">
                    <input
                      type="number"
                      step={"any"}
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setMontoPagoMobil(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Monto Bs.
                    </label>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setRefPagoMobil(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Referencia
                    </label>
                  </div>
                </div>
                <div
                  className="payment-group-section"
                  data-title="Tarjeta de Debito"
                >
                  <select
                    value={bancoTarjetaDebito}
                    onChange={(e) => setBancoTarjetaDebito(e.target.value)}
                  >
                    <option value="">Banco</option>
                    {bancos.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>

                  <div className="input-group">
                    <input
                      type="number"
                      step={"any"}
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setTarjetaDebito(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Monto Bs.
                    </label>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setRefTarjetaDebito(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Referencia
                    </label>
                  </div>
                </div>
                <div
                  className="payment-group-section"
                  data-title="Tarjeta de Credito"
                >
                  <select
                    value={bancoTarjetaCredito}
                    onChange={(e) => setBancoTarjetaCredito(e.target.value)}
                  >
                    <option value="">Banco</option>
                    {bancos.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>

                  <div className="input-group">
                    <input
                      type="number"
                      step={"any"}
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setTarjetaCredito(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Monto Bs.
                    </label>
                  </div>
                  <select
                    value={brandTarjetaCredito}
                    onChange={(e) => setBrandTarjetaCredito(e.target.value)}
                  >
                    <option value="">Tipo</option>
                    {brandSel.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setRefTarjetaCredito(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Referencia
                    </label>
                  </div>
                </div>
                <div className="payment-group-section" data-title="Zelle">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setMontoZelle(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Monto US$
                    </label>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setRefZelle(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Referencia
                    </label>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder=" "
                      className="input"
                      autoComplete="off"
                      maxLength={20}
                      onChange={(e) => setCuentaZelle(e.target.value)}
                    ></input>
                    <label htmlFor="apellido" className="user-label">
                      Titular
                    </label>
                  </div>
                </div>

                <div className="input-group tablet">
                  <input
                    type="text"
                    placeholder=" "
                    className="input memo-tablet"
                    autoComplete="off"
                    maxLength={100}
                    onChange={(e) => setMemoPago(e.target.value)}
                  ></input>
                  <label htmlFor="apellido" className="user-label">
                    Memo
                  </label>
                </div>
              </div>
            </>
          )}

          <div id="btn-guardar-paciente">
            <button className="button" type="submit">
              Registrar Control
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
