import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { detailsQuote, updateQuote } from "../actions/quoteActions";
import { QUOTE_UPDATE_RESET } from "../constants/quoteConstants";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPrint, faSave, faArrowLeft, faFileInvoiceDollar, faEye } from "@fortawesome/free-solid-svg-icons";
import logo from "/plazaDentalLogo.jpg";
import wsapp from "/whatsapp.png";
import instagram from "/instagram.png";
import dayjs from "dayjs";
import ServiceSelectorModal from "./ServiceSelectorModal";
import "./QuoteCreator.css"; // Reutilizamos estilos por consistencia

const QuoteEditScreen = () => {
    const { id: quoteId } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isViewOnly = pathname.includes("/view");

    const dispatch = useDispatch();
    const componentRef = useRef();

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const [listaServicios] = useState(JSON.parse(localStorage.getItem("servicios")) || []);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [items, setItems] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [validity, setValidity] = useState(15);
    const [showServiceModal, setShowServiceModal] = useState(false);

    const triggerPrint = useReactToPrint({ contentRef: componentRef });

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

    const quoteDetails = useSelector((state) => state.quoteDetails) || {};
    const { loading: loadingDetails, error: errorDetails, quote } = quoteDetails;

    const quoteUpdate = useSelector((state) => state.quoteUpdate) || {};
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = quoteUpdate;

    useEffect(() => {
        if (!quote || quote._id !== quoteId) {
            dispatch(detailsQuote(quoteId));
        } else {
            setSelectedPaciente(quote.paciente);
            setItems(quote.items.map((item) => ({ ...item, key: item._id || Math.random() })));
            setDiscount(quote.discount);
            setValidity(quote.validity);
        }
    }, [dispatch, quoteId, quote]);

    useEffect(() => {
        if (successUpdate) {
            Swal.fire("Actualizado", "Cotización actualizada con éxito!", "success");
            dispatch({ type: QUOTE_UPDATE_RESET });
            navigate("/quotelist");
        }
    }, [successUpdate, navigate, dispatch]);

    const handleAddService = (serviceDetails) => {
        const newItem = {
            key: Date.now(),
            serviceId: serviceDetails.serviceId,
            nombre: serviceDetails.nombre,
            precio: serviceDetails.precio,
            cantidad: serviceDetails.cantidad,
            total: serviceDetails.precio * serviceDetails.cantidad,
        };
        setItems([...items, newItem]);
    };

    const removeItem = (key) => {
        Swal.fire({
            title: "¿Eliminar servicio?",
            text: "Esta acción quitará el servicio de la cotización",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                setItems(items.filter((item) => item.key !== key));
            }
        });
    };

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal - parseFloat(discount || 0);

    const handleUpdate = () => {
        if (items.length === 0) {
            Swal.fire("Error", "La cotización debe tener al menos un servicio.", "error");
            return;
        }
        dispatch(
            updateQuote({
                _id: quoteId,
                items,
                discount: parseFloat(discount || 0),
                validity: parseInt(validity || 15),
            }),
        );
    };

    if (loadingDetails) return <div className="centrado pad-2">Cargando datos de cotización...</div>;
    if (errorDetails) return <div className="alert alert-danger">{errorDetails}</div>;

    return (
        <div className="quote-creator-container">
            <div className="quote-editor no-print">
                <div className="flx jsb border-bottom mb-1">
                    <h2 className="editor-title">
                        <FontAwesomeIcon icon={isViewOnly ? faEye : faFileInvoiceDollar} />{" "}
                        {isViewOnly ? "Visualizar Cotización" : "Editar Cotización"}
                    </h2>
                    <Link to="/quotelist" className="font-12 cot-back-link">
                        {"< Volver a Pacientes"}
                    </Link>
                </div>

                <div className="flx gap wrap mb-1"></div>

                <div className="quote-print-preview mt-2" ref={componentRef}>
                    <div className="print-header">
                        <div className="print-header-direccion">
                            <img className="logo recipe" src={logo} alt="logo" />
                            <div className="print-header-direccion-content">
                                <h2>Plaza Dental</h2>
                                <p>Av. Principal, Torre La Previsora, piso 12, Ofic. 12-1</p>
                                <p>Caracas, Distrito Capital.</p>
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
                            <h1>PRESUPUESTO</h1>
                            <p>Emitido el: {dayjs(quote.createdAt).format("DD/MM/YYYY")}</p>
                            <p>
                                <strong>Válido por: </strong>
                                {!isViewOnly ? (
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
                                ) : (
                                    <span>{validity}</span>
                                )}
                                <span className={!isViewOnly ? "no-print" : ""}> días</span>
                                <span className={!isViewOnly ? "print-only" : "hide"}>{validity} días</span>
                            </p>
                        </div>

                        <div className="quote-info-section flx jsb">
                            <div>
                                <p>
                                    <strong>Paciente:</strong> {selectedPaciente?.nombre} {selectedPaciente?.apellido}
                                </p>
                                <p>
                                    <strong>Cedula de Identidad:</strong> {selectedPaciente?.cedula}
                                </p>
                            </div>
                            <div className="flx gap05 no-print">
                                {!isViewOnly && (
                                    <button
                                        className="btn-modern btn-save-quote"
                                        onClick={handleUpdate}
                                        disabled={loadingUpdate}
                                        title="Guardar Cambios"
                                    >
                                        <FontAwesomeIcon icon={faSave} size="2x" />
                                    </button>
                                )}
                                <button className="btn-modern btn-print-main" onClick={handlePrint} title="Imprimir">
                                    <FontAwesomeIcon icon={faPrint} size="2x" />
                                </button>
                            </div>
                        </div>

                        {/* Botón Agregar Servicio reubicado */}
                        {!isViewOnly && (
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
                        )}

                        <table className="quote-items-table">
                            <thead>
                                <tr>
                                    <th>DESCRIPCIÓN</th>
                                    <th className="txt-center">CANT.</th>
                                    <th className="txt-right">PRECIO</th>
                                    <th className="txt-right">TOTAL</th>
                                    {!isViewOnly && <th className="txt-center no-print">ACCIÓN</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.nombre}</td>
                                        <td className="txt-center">{item.cantidad}</td>
                                        <td className="txt-right">${item.precio.toFixed(2)}</td>
                                        <td className="txt-right">${item.total.toFixed(2)}</td>
                                        {!isViewOnly && (
                                            <td className="txt-center no-print">
                                                <button className="btn-clear" onClick={() => removeItem(item.key)}>
                                                    <FontAwesomeIcon icon={faTrash} className="trash-icon" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="3" className="txt-right total-label">
                                        Subtotal:
                                    </td>
                                    <td className="txt-right total-value">${subtotal.toFixed(2)}</td>
                                    {!isViewOnly && <td className="no-print"></td>}
                                </tr>
                                <tr className={parseFloat(discount || 0) <= 0 ? "no-print" : ""}>
                                    <td colSpan="3" className="txt-right total-label">
                                        Descuento:
                                        {!isViewOnly ? (
                                            <input
                                                type="number"
                                                className="input-modern inline-discount-input"
                                                value={discount}
                                                onChange={(e) => setDiscount(e.target.value)}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                    <td className="txt-right total-value">-${parseFloat(discount || 0).toFixed(2)}</td>
                                    {!isViewOnly && <td className="no-print"></td>}
                                </tr>
                                <tr>
                                    <td colSpan="3" className="txt-right total-label total-value">
                                        Total Estimado:
                                    </td>
                                    <td className="txt-right total-value">${total.toFixed(2)}</td>
                                    {!isViewOnly && <td className="no-print"></td>}
                                </tr>
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
                </div>
            </div>
        </div>
    );
};

export default QuoteEditScreen;
