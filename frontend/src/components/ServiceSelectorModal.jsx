import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./ServiceSelectorModal.css";

const ServiceSelectorModal = ({ listaServicios, onAddService, onClose }) => {
  const modalRef = useRef();
  const [currentServiceId, setCurrentServiceId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [detalle, setDetalle] = useState("");

  const handleAdd = () => {
    if (!currentServiceId) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Por favor, selecciona un servicio.",
      });
      return;
    }
    const service = listaServicios.find((s) => s._id === currentServiceId);
    if (service) {
      onAddService({
        serviceId: service._id,
        nombre: service.nombre,
        precio: service.preciousd,
        cantidad: Number(quantity),
        total: service.preciousd * Number(quantity),
        detalle: detalle,
      });
      setCurrentServiceId("");
      setQuantity(1);
      setDetalle("");
      onClose(); // Close modal after adding
    }
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" ref={modalRef} onClick={closeModal}>
      <div className="service-selector-modal-content">
        <div className="modal-header">
          <h3>Seleccionar Servicio</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-row wrap">
            <div className="editor-field flex-grow">
              <label>Servicio</label>
              <select
                className="input-modern w-300"
                value={currentServiceId}
                onChange={(e) => setCurrentServiceId(e.target.value)}
              >
                <option value="">-- Seleccionar Servicio --</option>
                {listaServicios.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.nombre} (${s.preciousd})
                  </option>
                ))}
              </select>
            </div>
            <div className="editor-field">
              <label>Cant.</label>
              <input
                type="number"
                className="input-modern qty-input-small"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-row mtop-1">
            <div className="editor-field w-100pc">
              <label>Detalle adicional (opcional)</label>
              <input
                type="text"
                className="input-modern w-100pc"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                maxLength={80}
                placeholder="Ej: Especificaciones del tratamiento, materiales, etc."
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-modern btn-add-service" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} /> Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectorModal;
