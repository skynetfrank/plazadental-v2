import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import CloseIcon from "../icons/CloseIcon";

function ServiciosForm({ onClose, sendDataToParent, montoServiciosUsd, montoServiciosBs, }) {
  const modalRef = useRef();
  const [data, setData] = useState("");

  const [cambio] = useState(Number(localStorage.getItem("cambioBcv")).toFixed(2));


  const [montopunto, setMontopunto] = useState("");
  const [bancopunto, setBancopunto] = useState("");
  const [bancodestinopunto, setBancodestinopunto] = useState("");
  const [openMix, setOpenMix] = useState("");

  const [memo, setMemo] = useState("");

  const [totalPago, setTotalPago] = useState(0);



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
      <div className="modal-content">
        <div className="flx jsb gap3 pad-0 minw-360">
          <h3 className="font-1">Registrar Pago</h3>
          <h3 className="font-14">{"$" + Number(montoServiciosUsd).toFixed(2)}</h3>
          <h3 className="font-14">{" Bs." + Number(montoServiciosBs).toFixed(2)}</h3>

          <button className="btn-icon-container minw-20 m-0" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>


      </div>
    </div>
  );
}

export default ServiciosForm;
