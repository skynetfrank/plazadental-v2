import { useRef, useState } from "react";
import Swal from "sweetalert2";
import CloseIcon from "../icons/CloseIcon";

function DeliveryForm({ onClose, sendDataToParent }) {
  const [client] = useState(JSON.parse(localStorage.getItem("clienteInfo")));
  const modalRef = useRef();
  const [destinatario, setDestinatario] = useState(client?.nombre || "");
  const [cedula, setCedula] = useState(client?.rif || "");
  const [telefono, setTelefono] = useState(client?.telefono || "");
  const [direccionEnvio, setDireccionEnvio] = useState(client?.direccion || "");
  const [empresaEnvio, setEmpresaEnvio] = useState("");
  const [motorizado, setMotorizado] = useState("");
  const [memoDelivery, setMemoDelivery] = useState("");
  const [origenVenta, setOrigenVenta] = useState("");

  const motorizados = ["", "Enderson Montilla", "Reinaldo Perdomo", "Otro"];
  const origenes = ["", "INSTAGRAM", "TIK-TOK", "FACEBOOK", "LOSFRAILES", "MERPOESTE", "TIENDA-CHACAO", "OTRO-ORIGEN"];
  const empresas = ["", "DEMODA", "MRW", "TEALCA", "ZOOM", "DOMESA", "FEDERAL EXPRESS"];

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  function handleClick() {
    if (!origenVenta) {
      Swal.fire({
        title: "Falta Origen de La Venta!",
        text: "Informacion del Delivery",
      });
      return;
    }

    if (!empresaEnvio) {
      Swal.fire({
        title: "Falta La Empresa de Envio!",
        text: "Informacion del Delivery",
      });
      return;
    }

    if (!motorizado) {
      Swal.fire({
        title: "Falta El Motorizado!",
        text: "Informacion del Delivery",
      });
      return;
    }

    if (!direccionEnvio) {
      Swal.fire({
        title: "Falta La Direccion",
        text: "Informacion del Delivery",
      });
      return;
    }

    const deliveryObject = {
      origenVenta,
      empresaEnvio,
      motorizado,
      destinatario,
      cedula,
      telefono,
      direccionEnvio,
      memoDelivery,
    };
    sendDataToParent(deliveryObject);
    onClose();
  }
  return (
    <div ref={modalRef} onClick={closeModal} className="modal-container">
      <div className="modal-content">
        <div className="flx jsb w-full">
          <h3>Delivery</h3>
          <button onClick={handleClick}>Guardar</button>
          <button className="btn-icon-container" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="delivery-modal-container mb">
          <div className="control-container">
            <label>Origen de la Venta</label>
            <select value={origenVenta} required={true} onChange={(e) => setOrigenVenta(e.target.value)}>
              {origenes.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="control-container">
            <label>Empresa del Envio: </label>
            <select value={empresaEnvio} onChange={(e) => setEmpresaEnvio(e.target.value)}>
              {empresas.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="control-container">
            <label htmlFor="name">Destinatario</label>
            <input type="text" value={destinatario} onChange={(e) => setDestinatario(e.target.value)}></input>
          </div>
          <div className="control-container">
            <label htmlFor="cedula">Cedula</label>
            <input type="text" className="w-100" value={cedula} onChange={(e) => setCedula(e.target.value)}></input>
          </div>
          <div className="control-container">
            <label htmlFor="telefono">Telefono</label>
            <input className="w-100" type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)}></input>
          </div>
          <div className="control-container">
            <label>Motorizado: </label>
            <select className="select-motorizado" value={motorizado} onChange={(e) => setMotorizado(e.target.value)}>
              {motorizados.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="control-container txtarea">
            <label htmlFor="telefono">Direccion de Envio</label>
            <textarea
              className="txt-area b-radius pad-05"
              value={direccionEnvio}
              placeholder="Direccion completa:  ciudad, estado, calle etc.  y/o cualquier otro punto de referencia necesario"
              rows="4"
              cols={34}
              onChange={(e) => setDireccionEnvio(e.target.value)}
            ></textarea>
          </div>
          <div className="control-container txtarea">
            <label htmlFor="telefono">Observaciones</label>
            <input type="text" className="w-full" onChange={(e) => setMemoDelivery(e.target.value)}></input>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryForm;
