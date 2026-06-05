import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { detailsQuote, updateQuote } from '../actions/quoteActions';
import { QUOTE_UPDATE_RESET } from '../constants/quoteConstants';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPrint, faSave, faArrowLeft, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import logo from "/plazaDentalLogo.jpg";
import wsapp from "/whatsapp.png";
import instagram from "/instagram.png";
import dayjs from 'dayjs';
import ServiceSelectorModal from './ServiceSelectorModal';
import './QuoteCreator.css'; // Reutilizamos estilos por consistencia

const QuoteEditScreen = () => {
    const { id: quoteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const componentRef = useRef();
    const handlePrint = useReactToPrint({ contentRef: componentRef });

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const [listaServicios] = useState(JSON.parse(localStorage.getItem("servicios")) || []);
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [items, setItems] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [validity, setValidity] = useState(15);
    const [showServiceModal, setShowServiceModal] = useState(false);

    const quoteDetails = useSelector((state) => state.quoteDetails) || {};
    const { loading: loadingDetails, error: errorDetails, quote } = quoteDetails;

    const quoteUpdate = useSelector((state) => state.quoteUpdate) || {};
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = quoteUpdate;

    useEffect(() => {
        if (!quote || quote._id !== quoteId) {
            dispatch(detailsQuote(quoteId));
        } else {
            setSelectedPaciente(quote.paciente);
            setItems(quote.items.map(item => ({ ...item, key: item._id || Math.random() })));
            setDiscount(quote.discount);
            setValidity(quote.validity);
        }
    }, [dispatch, quoteId, quote]);

    useEffect(() => {
        if (successUpdate) {
            Swal.fire('Actualizado', 'Cotización actualizada con éxito!', 'success');
            dispatch({ type: QUOTE_UPDATE_RESET });
            navigate('/quotelist');
        }
    }, [successUpdate, navigate, dispatch]);

    const handleAddService = (serviceDetails) => {
        const newItem = {
            key: Date.now(),
            serviceId: serviceDetails.serviceId,
            nombre: serviceDetails.nombre,
            precio: serviceDetails.precio,
            cantidad: serviceDetails.cantidad,
            total: serviceDetails.precio * serviceDetails.cantidad
        };
        setItems([...items, newItem]);
    };

    const removeItem = (key) => {
        Swal.fire({
            title: '¿Eliminar servicio?',
            text: "Esta acción quitará el servicio de la cotización",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                setItems(items.filter(item => item.key !== key));
            }
        });
    };

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal - parseFloat(discount || 0);

    const handleUpdate = () => {
        if (items.length === 0) {
            Swal.fire('Error', 'La cotización debe tener al menos un servicio.', 'error');
            return;
        }
        dispatch(updateQuote({
            _id: quoteId,
            items,
            discount: parseFloat(discount || 0),
            validity: parseInt(validity || 15)
        }));
    };

    if (loadingDetails) return <div className="centrado pad-2">Cargando datos de cotización...</div>;
    if (errorDetails) return <div className="alert alert-danger">{errorDetails}</div>;

    return (
        <div className="quote-creator-container">
            <div className="quote-editor no-print">
                <h2 className="editor-title m-0 mb-1"><FontAwesomeIcon icon={faFileInvoiceDollar} /> Editar Cotización</h2>

                <div className="flx gap wrap mb-1">
                    <Link to="/quotelist" className="btn-modern btn-back flex-1 centrado"><FontAwesomeIcon icon={faArrowLeft} /> Volver</Link>
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
                    <button className="btn-modern btn-save-quote flex-1" onClick={handleUpdate} disabled={loadingUpdate}>
                        <FontAwesomeIcon icon={faSave} /> {loadingUpdate ? 'Actualizando...' : 'Guardar Cambios'}
                    </button>
                    <button className="btn-modern btn-print-main flex-1" onClick={handlePrint}>
                        <FontAwesomeIcon icon={faPrint} /> Imprimir
                    </button>
                </div>

                <div className="editor-row">
                    <div className="editor-field" style={{ maxWidth: '200px' }}>
                        <label>Validez de la oferta (días)</label>
                        <select className="input-modern" value={validity} onChange={(e) => setValidity(e.target.value)}>
                            {[...Array(90)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1} días</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="quote-totals-summary no-print editor-discount-section mt-2">
                    <div className="total-row"><span>SUBTOTAL:</span> <strong>${subtotal.toFixed(2)}</strong></div>
                    <div className="total-row"><span>DESCUENTO:</span> <input type="number" className="input-modern inline-discount-input" value={discount} onChange={(e) => setDiscount(e.target.value)} /></div>
                    <div className="total-row final"><span>TOTAL ESTIMADO:</span> <strong>${total.toFixed(2)}</strong></div>
                </div>

                <div className="quote-print-preview mt-2" ref={componentRef}>
                    <div className="print-header">
                        <div className="print-header-direccion">
                            <img className="logo recipe" src={logo} alt="logo" />
                            <div className="print-header-direccion-content">
                                <h2>Plaza Dental</h2>
                                <p>Av. Principal, Torre La Previsora, piso 12, Ofic. 12-1</p>
                                <p>Caracas, Distrito Capital.</p>
                            </div>
                        </div>
                        <div className="social-icons">
                            <div className="social-item"><img src={wsapp} alt="ws" /><p>(0412) 611.9001</p></div>
                            <div className="social-item"><img src={instagram} alt="ig" /><p>@PLAZADENTALVZLA</p></div>
                        </div>
                    </div>

                    <div className="quote-main-content">
                        <div className="quote-document-title">
                            <h1>PRESUPUESTO ACTUALIZADO</h1>
                            <p>Emitido el: {dayjs(quote.createdAt).format('DD/MM/YYYY')}</p>
                            <p><strong>Válido por:</strong> {validity} días</p>
                        </div>

                        <div className="quote-info-section">
                            <h4>DATOS DEL PACIENTE</h4>
                            <p><strong>Nombre:</strong> {selectedPaciente?.nombre} {selectedPaciente?.apellido}</p>
                            <p><strong>C.I.:</strong> {selectedPaciente?.cedula}</p>
                        </div>

                        <table className="quote-items-table">
                            <thead>
                                <tr>
                                    <th>DESCRIPCIÓN</th>
                                    <th className="txt-center">CANT.</th>
                                    <th className="txt-right">P. UNIT.</th>
                                    <th className="txt-right">TOTAL</th>
                                    <th className="txt-center no-print">ACCIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.nombre}</td>
                                        <td className="txt-center">{item.cantidad}</td>
                                        <td className="txt-right">${item.precio.toFixed(2)}</td>
                                        <td className="txt-right">${item.total.toFixed(2)}</td>
                                        <td className="txt-center no-print">
                                            <button className="btn-clear" onClick={() => removeItem(item.key)}><FontAwesomeIcon icon={faTrash} className="trash-icon" /></button>
                                        </td>
                                    </tr>
                                ))}
                                <tr><td colSpan="3" className="txt-right total-label">Subtotal:</td><td className="txt-right total-value">${subtotal.toFixed(2)}</td><td className="no-print"></td></tr>
                                {discount > 0 && <tr><td colSpan="3" className="txt-right total-label">Descuento:</td><td className="txt-right total-value">-${parseFloat(discount).toFixed(2)}</td><td className="no-print"></td></tr>}
                                <tr><td colSpan="3" className="txt-right total-label total-value">Total Estimado:</td><td className="txt-right total-value">${total.toFixed(2)}</td><td className="no-print"></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="quote-signature-footer"><div className="signature-box"><div className="line"></div><p className="name">{userInfo.nombre} {userInfo.apellido}</p><p className="role">Profesional a cargo</p></div></div>
                </div>
            </div>
        </div>
    );
};

export default QuoteEditScreen;