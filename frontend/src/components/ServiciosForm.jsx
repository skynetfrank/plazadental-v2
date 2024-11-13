import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import CloseIcon from "../icons/CloseIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TrashIcon from "../icons/TrashIcon";

function ServiciosForm({ onClose, sendDataToParent, montoServiciosUsd, montoServiciosBs, }) {
  const modalRef = useRef();
  const [cambio] = useState(Number(localStorage.getItem("cambioBcv")).toFixed(2));
  const [listaServicios] = useState(JSON.parse(localStorage.getItem("servicios")));
  const [servicioId, setServicioId] = useState("");
  const [serviciosItems, setServiciosItems] = useState([]);
  const [qtyServ, setQtyServ] = useState(1);
  const [totalGeneral, setTotalGeneral] = useState(0);

  const selCantidad = [1, 2, 3, 4, 5, 6];

  const handleServicios = (e) => {
    e.preventDefault();
    const esteServicio = listaServicios.find((x) => x._id === servicioId);
    if (!esteServicio) {
      Swal.fire({
        title: "Debe Seleccionar un Servicio",
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


  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  function handleClick() {
    const servicioObject = {}
    sendDataToParent(servicioObject);
    onClose();
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="modal-container">
      <div className="modal-content servicios">
        <div className="flx jsb minw-360">
          <h3 className="font-1">Registrar Servicio</h3>
          <button className="btn-icon-container minw-20 m-0" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="flx jsb gap3 pad-0 minw-360">
          <div className="flx jsb minw-360">
            <div>
              <select
                value={servicioId}
                className="maxw-150 font-x"
                onChange={(e) => setServicioId(e.target.value)}
              >
                <option value="">Seleccionar</option>
                {listaServicios?.map((x, inx) => (
                  <option key={inx} value={x._id}>
                    {x.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-wrapper" data-title="Cant.">
              <select
                className="font-x"
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

          </div>
        </div>
        {serviciosItems && (
          <div className="flx column">
            {serviciosItems.map((m, inx) => {
              const foundit = listaServicios.find(
                (x) => x._id === m.servicio
              );

              return (
                <div key={inx} className="flx jsb font-x minw-360 pad-1">
                  <span>
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

                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={(e) =>
                      handleEliminarServicio(e, m.servicio)
                    }
                    className="fa-trash"
                  />

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default ServiciosForm;
