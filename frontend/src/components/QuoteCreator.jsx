import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useDispatch } from "react-redux";
import { createQuote } from "../actions/quoteActions";
import { QUOTE_CREATE_RESET } from "../constants/quoteConstants";
import Swal from "sweetalert2";
import { detailsPaciente } from "../actions/pacienteActions";
import Loader from "./Loader";
import { listServicios } from "../actions/servicioActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import {
  faPlus,
  faTrash,
  faPrint,
  faUser,
  faFileInvoiceDollar,
  faSave,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import logo from "/plazaDentalLogo.jpg";
import wsapp from "/whatsapp.png";
import instagram from "/instagram.png";
import terminos from "../assets/terminos.png";
import dayjs from "dayjs";
import ServiceSelectorModal from "./ServiceSelectorModal"; // Import the new modal
import "./QuoteCreator.css";

const QuoteCreator = () => {
  const { id: pacienteId } = useParams();
  const navigate = useNavigate(); // For navigation if needed, e.g., back button
  const dispatch = useDispatch();
  const componentRef = useRef();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const pacienteDetails = useSelector((state) => state.pacienteDetails);
  const { loading: loadingPaciente, error: errorPaciente, paciente } = pacienteDetails;

  const servicioList = useSelector((state) => state.servicioList);
  const { loading: loadingServicios, error: errorServicios, servicios: listaServicios } = servicioList;

  const [cambioBcv, setCambioBcv] = useState(Number(localStorage.getItem("cambioBcv")) || 0);
  const handleUpdateBcv = async () => {
    const { value: rate } = await Swal.fire({
      title: "Actualizar Tasa BCV",
      input: "number",
      inputLabel: "Ingrese la tasa de cambio actual",
      inputValue: cambioBcv,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return "¡Debe ingresar una tasa válida!";
        }
      },
    });

    if (rate) {
      localStorage.setItem("cambioBcv", rate);
      setCambioBcv(Number(rate));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Tasa actualizada",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const [currency, setCurrency] = useState("USD");

  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [validity, setValidity] = useState(15); // Default validity in days

  const triggerPrint = useReactToPrint({
    contentRef: componentRef,
  });

  const handlePrint = () => {
    if (items.length === 0) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "No hay servicios para imprimir",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    triggerPrint();
  };

  const quoteCreate = useSelector((state) => state.quoteCreate) || {};
  const { success: createSuccess, loading: createLoading, error: createError, quote: createdQuote } = quoteCreate;

  useEffect(() => {
    if (pacienteId) {
      dispatch(detailsPaciente(pacienteId));
    }
  }, [dispatch, pacienteId]);

  useEffect(() => {
    if (paciente) {
      setSelectedPaciente(paciente);
    }
  }, [paciente]);

  useEffect(() => {
    if (!listaServicios || listaServicios.length === 0) {
      dispatch(listServicios());
    }
  }, [dispatch, listaServicios]);

  const handleAddService = (serviceDetails) => {
    const newItem = {
      key: Date.now(), // ID temporal para React y manejo local
      serviceId: serviceDetails.serviceId,
      nombre: serviceDetails.nombre,
      precio: serviceDetails.precio,
      cantidad: serviceDetails.cantidad,
      total: serviceDetails.precio * serviceDetails.cantidad,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.key !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.total, 0); // Use parseFloat for discount
  const total = subtotal - parseFloat(discount || 0); // Ensure discount is parsed as float

  const handleSaveQuote = () => {
    if (!selectedPaciente || items.length === 0) {
      Swal.fire("Error", "Debe seleccionar un paciente y agregar al menos un servicio.", "error");
      return;
    }

    const quoteData = {
      paciente: selectedPaciente,
      items,
      discount: parseFloat(discount || 0),
      validity: parseInt(validity || 15),
      cambioBcv: Number(cambioBcv),
      // subtotal and total will be calculated on backend
    };
    dispatch(createQuote(quoteData));
  };

  useEffect(() => {
    if (createSuccess) {
      Swal.fire("Guardado", "Cotización guardada con éxito!", "success");
      dispatch({ type: QUOTE_CREATE_RESET });
      navigate("/quotelist"); // Navigate to the list of quotes
    }
    if (createError) {
      Swal.fire("Error", createError, "error");
    }
  }, [createSuccess, createError, dispatch, navigate]);

  if (loadingPaciente) return <Loader txt="Cargando datos del paciente..." />;
  if (errorPaciente) return <div className="alert alert-danger">{errorPaciente}</div>;

  return (
    <div className="quote-creator-container">
      <Link to="/listapacientes" className="font-12 ml cot-back-link">
        {"Volver a Pacientes"}
      </Link>
      <div className="quote-editor no-print">
        <div className="quote-print-preview" ref={componentRef}>
          <div className="print-header">
            <div className="print-header-direccion">
              <img className="logo recipe" src={logo} alt="logo" />
              <div className="print-header-direccion-content">
                <h2>Plaza Dental</h2>
                <p>Av. Principal, Edificio Torre La Previsora, piso 12, Ofic. 12-1</p>
                <p>Urb. plaza Venezuela, Caracas, Distrito Capital.</p>
                <p>Email: plazadentalvenezuela@gmail.com</p>
                <div className="flx gap wrap">
                  <div className="social-item">
                    <img src={wsapp} alt="ws" />
                    <p>(0412) 611.9001</p>
                  </div>
                  <div className="social-item">
                    <img src={instagram} alt="ig" />
                    <p>@PLAZADENTALVZLA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="quote-main-content">
            <div className="quote-document-title">
              <div className="flx jcenter gap1 no-print mb-1">
                <button
                  className={`btn-modern ${currency === "USD" ? "bg-blue" : ""}`}
                  style={{ padding: "5px 15px", fontSize: "1.2rem" }}
                  onClick={() => setCurrency("USD")}
                >
                  Ver en Dólares ($)
                </button>
                <button
                  className={`btn-modern ${currency === "BS" ? "bg-blue" : ""}`}
                  style={{ padding: "5px 15px", fontSize: "1.2rem" }}
                  onClick={() => {
                    if (cambioBcv <= 0) {
                      Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "warning",
                        title: "Debe actualizar la tasa BCV para ver en Bolívares",
                        showConfirmButton: false,
                        timer: 3000,
                      });
                    } else {
                      setCurrency("BS");
                    }
                  }}
                >
                  Ver en Bolívares (Bs.)
                </button>
              </div>
              <h1>PRESUPUESTO ESTIMADO</h1>
              <p>Emitido el: {dayjs().format("DD/MM/YYYY")}</p>
              <p>
                <strong>Válido por: </strong>
                <select
                  className="select-validity-tiny no-print"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                >
                  {[...Array(90)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span className="no-print"> días</span>
                <span className="print-only">{validity} días</span>
              </p>
              {currency === "BS" && (
                <p className="font-12 mt-1">
                  Tasa de cambio BCV: <strong>{cambioBcv.toFixed(2)} Bs/$</strong>
                  <button className="btn-clear no-print ml-05" onClick={handleUpdateBcv} title="Actualizar Tasa">
                    <FontAwesomeIcon icon={faSyncAlt} className="azul-brand" size="xs" />
                  </button>
                </p>
              )}
            </div>

            <div className="quote-info-section flx jsb">
              <div className="info-block">
                <p>
                  <strong>Paciente:</strong>{" "}
                  {selectedPaciente
                    ? `${selectedPaciente.nombre} ${selectedPaciente.apellido}`
                    : "____________________"}
                </p>
                <p>
                  <strong>Cedula de Identidad:</strong>{" "}
                  {selectedPaciente ? selectedPaciente.cedula : "____________________"}
                </p>
              </div>
              <div className="flx gap05 no-print">
                <button
                  className="btn-modern btn-save-quote"
                  onClick={handleSaveQuote}
                  disabled={createLoading}
                  title="Guardar Cotización"
                >
                  <FontAwesomeIcon icon={faSave} size="2x" />
                </button>
                <button className="btn-modern btn-print-main" onClick={handlePrint} title="Imprimir">
                  <FontAwesomeIcon icon={faPrint} size="2x" />
                </button>
              </div>
            </div>

            {/* Botón Agregar Servicio reubicado */}
            <div className="flx jstart no-print mt-1 mb-1">
              <button className="btn-modern btn-add-service-modal" onClick={() => setShowServiceModal(true)}>
                <FontAwesomeIcon icon={faPlus} /> Agregar Servicio
              </button>
              {showServiceModal && (
                <ServiceSelectorModal
                  listaServicios={listaServicios}
                  onAddService={handleAddService}
                  onClose={() => setShowServiceModal(false)}
                />
              )}
            </div>

            <table className="quote-items-table">
              <thead>
                <tr>
                  <th>DESCRIPCIÓN</th>
                  <th className="txt-center">CANT.</th>
                  <th className="txt-right">PRECIO</th>
                  <th className="txt-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-row">
                      No hay servicios agregados
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.key}>
                      <td>{item.nombre}</td>
                      <td className="txt-center">{item.cantidad}</td>
                      <td className="txt-right">
                        {currency === "USD"
                          ? `$${item.precio.toFixed(2)}`
                          : `Bs. ${(item.precio * cambioBcv).toLocaleString("de-DE", {
                              minimumFractionDigits: 2,
                            })}`}
                      </td>
                      <td className="txt-right">
                        {currency === "USD"
                          ? `$${item.total.toFixed(2)}`
                          : `Bs. ${(item.total * cambioBcv).toLocaleString("de-DE", {
                              minimumFractionDigits: 2,
                            })}`}
                      </td>
                    </tr>
                  ))
                )}
                {items.length > 0 && (
                  <tr>
                    <td colSpan="3" className="txt-right total-label">
                      Subtotal:
                    </td>
                    <td className="txt-right total-value">
                      {currency === "USD"
                        ? `$${subtotal.toFixed(2)}`
                        : `Bs. ${(subtotal * cambioBcv).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`}
                    </td>
                  </tr>
                )}
                {items.length > 0 && (
                  <tr className={parseFloat(discount || 0) <= 0 ? "no-print" : ""}>
                    <td colSpan="3" className="txt-right total-label">
                      Descuento:
                      <input
                        type="number"
                        className="input-modern inline-discount-input"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />
                    </td>
                    <td className="txt-right total-value">
                      {currency === "USD"
                        ? `-$${parseFloat(discount || 0).toFixed(2)}`
                        : `-Bs. ${(parseFloat(discount || 0) * cambioBcv).toLocaleString("de-DE", {
                            minimumFractionDigits: 2,
                          })}`}
                    </td>
                  </tr>
                )}
                {items.length > 0 && (
                  <tr>
                    <td colSpan="3" className="txt-right total-label total-value">
                      Total Estimado:
                    </td>
                    <td className="txt-right total-value">
                      {currency === "USD"
                        ? `$${total.toFixed(2)}`
                        : `Bs. ${(total * cambioBcv).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="quote-signature-footer">
            <div className="signature-box">
              <div className="line"></div>
              <p className="name">
                {userInfo.nombre} {userInfo.apellido}
              </p>
              <p className="role">Elaborado por</p>
            </div>
          </div>
          <div className="quote-terms-section">
            <img src={terminos} alt="Términos y Condiciones" className="quote-terms-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCreator;
