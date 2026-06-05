import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPrint, faUser, faTooth, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import logo from "/plazaDentalLogo.jpg";
import wsapp from "/whatsapp.png";
import instagram from "/instagram.png";
import dayjs from 'dayjs';
import './QuoteCreator.css';

const QuoteCreator = () => {
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
    const [currentServiceId, setCurrentServiceId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [discount, setDescuento] = useState(0);

    const addItem = () => {
        if (!currentServiceId) return;
        const service = listaServicios.find(s => s._id === currentServiceId);
        if (service) {
            const newItem = {
                _id: Date.now(),
                serviceId: service._id,
                nombre: service.nombre,
                precio: service.preciousd,
                cantidad: Number(quantity),
                total: service.preciousd * Number(quantity)
            };
            setItems([...items, newItem]);
            setCurrentServiceId("");
            setQuantity(1);
        }
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item._id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal - Number(discount);

    return (
        <div className="quote-creator-container">
            <div className="quote-editor no-print">
                <h2 className="editor-title"><FontAwesomeIcon icon={faFileInvoiceDollar} /> Nueva Cotización</h2>

                <div className="editor-form-wrapper">
                    <div className="editor-row">
                        <div className="editor-field flex-1">
                            <label><FontAwesomeIcon icon={faUser} /> Seleccionar Paciente</label>
                            <select className="input-modern" onChange={(e) => setSelectedPaciente(listaPacientes.find(p => p._id === e.target.value))}>
                                <option value="">-- Buscar Paciente --</option>
                                {listaPacientes.map(p => (
                                    <option key={p._id} value={p._id}>{p.nombre} {p.apellido} ({p.cedula})</option>
                                ))}
                            </select>
                        </div>

                        <div className="editor-field flex-2">
                            <label><FontAwesomeIcon icon={faTooth} /> Agregar Servicio</label>
                            <div className="adder-row">
                                <select className="input-modern service-select" value={currentServiceId} onChange={(e) => setCurrentServiceId(e.target.value)}>
                                    <option value="">-- Seleccionar Servicio --</option>
                                    {listaServicios.map(s => (
                                        <option key={s._id} value={s._id}>{s.nombre} (${s.preciousd})</option>
                                    ))}
                                </select>
                                <input type="number" className="input-modern qty-input" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Cant." />
                                <button className="btn-modern btn-add" onClick={addItem} title="Agregar"><FontAwesomeIcon icon={faPlus} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="editor-row">
                        <div className="editor-field discount-field">
                            <label>Descuento Especial ($)</label>
                            <input type="number" className="input-modern" value={discount} onChange={(e) => setDescuento(e.target.value)} placeholder="0.00" />
                        </div>
                    </div>
                </div>

                <button className="btn-modern btn-print-main" onClick={handlePrint}>
                    <FontAwesomeIcon icon={faPrint} /> Imprimir Presupuesto
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
                        </div>
                    </div>
                    <div className="social-icons">
                        <img src={wsapp} alt="ws" />
                        <p>(0412) 611.9001</p>
                        <img src={instagram} alt="ig" />
                        <p>@PLAZADENTALVZLA</p>
                    </div>
                </div>

                <div className="quote-main-content">
                    <div className="quote-document-title">
                        <h1>PRESUPUESTO ESTIMADO</h1>
                        <p>Emitido el: {dayjs().format('DD/MM/YYYY')}</p>
                    </div>

                    <div className="quote-info-section">
                        <div className="info-block">
                            <h4>DATOS DEL PACIENTE</h4>
                            <p><strong>Nombre:</strong> {selectedPaciente ? `${selectedPaciente.nombre} ${selectedPaciente.apellido}` : '____________________'}</p>
                            <p><strong>C.I.:</strong> {selectedPaciente ? selectedPaciente.cedula : '____________________'}</p>
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
                                <tr><td colSpan="4" className="empty-row">No hay servicios agregados</td></tr>
                            ) : items.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.nombre}</td>
                                    <td className="txt-center">{item.cantidad}</td>
                                    <td className="txt-right">${item.precio.toFixed(2)}</td>
                                    <td className="txt-right">${item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="quote-totals-summary">
                        <div className="total-row"><span>SUBTOTAL:</span> <strong>${subtotal.toFixed(2)}</strong></div>
                        {discount > 0 && <div className="total-row discount"><span>DESCUENTO:</span> <strong>-${Number(discount).toFixed(2)}</strong></div>}
                        <div className="total-row final"><span>TOTAL ESTIMADO:</span> <strong>${total.toFixed(2)}</strong></div>
                    </div>

                    <div className="quote-signature-footer">
                        <div className="signature-box">
                            <div className="line"></div>
                            <p className="name">{userInfo.nombre} {userInfo.apellido}</p>
                            <p className="role">Profesional a cargo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteCreator;