import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useDispatch } from "react-redux";
import { createQuote } from "../actions/quoteActions";
import { QUOTE_CREATE_RESET } from "../constants/quoteConstants";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faPlus, faTrash, faPrint, faUser, faFileInvoiceDollar, faSave } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import logo from "/plazaDentalLogo.jpg";
import wsapp from "/whatsapp.png";
import instagram from "/instagram.png";
import dayjs from "dayjs";
import ServiceSelectorModal from "./ServiceSelectorModal"; // Import the new modal
import "./QuoteCreator.css";

const QuoteCreator = () => {
  const { id: pacienteId } = useParams();
  const navigate = useNavigate(); // For navigation if needed, e.g., back button
  const dispatch = useDispatch();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  // Obtenemos datos de localStorage para mantener consistencia con otras pantallas
  const [listaPacientes] = useState(JSON.parse(localStorage.getItem("pacientes")) || []);
  const [listaServicios] = useState(JSON.parse(localStorage.getItem("servicios")) || []);

  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [validity, setValidity] = useState(15); // Default validity in days

  const quoteCreate = useSelector((state) => state.quoteCreate) || {};
  const { success: createSuccess, loading: createLoading, error: createError, quote: createdQuote } = quoteCreate;

  useEffect(() => {
    if (pacienteId) {
      const found = listaPacientes.find((p) => p._id === pacienteId);
      if (found) {
        setSelectedPaciente(found);
      }
    }
  }, [pacienteId, listaPacientes]);

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

  return (
    <div className="quote-creator-container">
      <div className="quote-editor no-print">
        <h2 className="editor-title">
          <FontAwesomeIcon icon={faFileInvoiceDollar} /> Nueva Cotización
        </h2>

        <div className="flx gap wrap mb-1">
          <button className="btn-modern btn-add-service-modal flex-1" onClick={() => setShowServiceModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Agregar Servicio
          </button>
          {showServiceModal && (
            <ServiceSelectorModal
              listaServicios={listaServicios}
              onAddService={handleAddService}
              onClose={() => setShowServiceModal(false)}
            />
          )}
          <Link to="/listapacientes" className="btn-modern btn-back flex-1 centrado">
            Volver a Pacientes
          </Link>
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
            </div>

            <div className="quote-info-section">
              <div className="info-block">
                <h4>DATOS DEL PACIENTE</h4>
                <p>
                  <strong>Nombre:</strong>{" "}
                  {selectedPaciente
                    ? `${selectedPaciente.nombre} ${selectedPaciente.apellido}`
                    : "____________________"}
                </p>
                <p>
                  <strong>C.I.:</strong> {selectedPaciente ? selectedPaciente.cedula : "____________________"}
                </p>
              </div>
            </div>

            <table className="quote-items-table">
              <thead>
                <tr>
                  <th>DESCRIPCIÓN</th>
                  <th className="txt-center">CANT.</th>
                  <th className="txt-right">PRECIO UNIT.</th>
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
                      <td className="txt-right">${item.precio.toFixed(2)}</td>
                      <td className="txt-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))
                )}
                {items.length > 0 && (
                  <tr>
                    <td colSpan="3" className="txt-right total-label">
                      Subtotal:
                    </td>
                    <td className="txt-right total-value">${subtotal.toFixed(2)}</td>
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
                    <td className="txt-right total-value">-${parseFloat(discount || 0).toFixed(2)}</td>
                  </tr>
                )}
                {items.length > 0 && (
                  <tr>
                    <td colSpan="3" className="txt-right total-label total-value">
                      Total Estimado:
                    </td>
                    <td className="txt-right total-value">${total.toFixed(2)}</td>
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
              <p className="role">Profesional a cargo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCreator;
