import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import CloseIcon from "../icons/CloseIcon";
import { listaLabs, tipoLab } from "../constants/listas";

function LabConceptSelector({ onClose, sendConceptToParent }) {
  const modalRef = useRef();
  const [concepto, setConcepto] = useState("");

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  function handleClick() {
    sendConceptToParent(concepto);
    onClose();
  }

  return (
    <div ref={modalRef} onClick={closeModal} className="modal-container">
      <div className="modal-content lab">
        <div className="pad-0 minw-360 mtop-2">
          <h3 className="font-1 centrado">Servicios de Laboratorio</h3>
        </div>
        <button className="btn-icon-container minw-20 m-0 pos-abs close-modal-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="flx column astart pad-05 input-select">
          <input
            type="text"
            className="b-radius border-1 b-radius-05 pad-05 w-full"
            value={concepto}
            list="tipoLab"
            required
            maxLength={50}
            onChange={(e) => setConcepto(e.target.value)}
          ></input>
          <datalist id="tipoLab">
            {tipoLab.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </datalist>
        </div>
        <div className="centrado w-100pc mtop-1 mb">
          <button onClick={handleClick}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default LabConceptSelector;
