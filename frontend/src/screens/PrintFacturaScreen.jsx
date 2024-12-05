import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { detailsControl } from "../actions/controlActions";
import ComponentToPrint from "../components/ComponentToPrint";
import { useReactToPrint } from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

export default function PrintFacturaScreen(props) {
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  const params = useParams();
  const { id: controlId } = params;
  const [nfact, setNfact] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rif, setRif] = useState("");
  const [telefono, setTelefono] = useState("");

  const controlDetails = useSelector((state) => state.controlDetails);
  const { control, loading, error } = controlDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!control || (control && control._id !== controlId)) {
      dispatch(detailsControl(controlId));
    }
    if (control) {
      setRazonSocial(control.nombre);
      setRif(control.cedula);
      setDireccion(control.direccion);
      setTelefono(control.telefono);
    }
  }, [dispatch, controlId, control]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="printer-container invoice">
      <div className="factura">
        <div className="input-group">
          <input
            type="text"
            className="input small"
            autoComplete="off"
            placeholder=" "
            value={nfact}
            required
            onChange={(e) => setNfact(e.target.value)}
          />
          <label htmlFor="cedula" className="user-label">
            Factura No.
          </label>
        </div>
        <div className="input-group">
          <input
            type="text"
            className="input small"
            autoComplete="off"
            placeholder=" "
            value={rif}
            required
            onChange={(e) => setRif(e.target.value)}
          />
          <label htmlFor="cedula" className="user-label">
            R.I.F.
          </label>
        </div>
        <div className="input-group">
          <input
            type="text"
            className="input medium"
            autoComplete="off"
            placeholder=" "
            value={razonSocial}
            required
            onChange={(e) => setRazonSocial(e.target.value)}
          />
          <label htmlFor="cedula" className="user-label">
            Razon Social
          </label>
        </div>
        <div className="input-group">
          <input
            type="text"
            className="input small"
            autoComplete="off"
            placeholder=" "
            value={telefono}
            required
            onChange={(e) => setTelefono(e.target.value)}
          />
          <label htmlFor="cedula" className="user-label">
            R.I.F.
          </label>
        </div>
        <div className="input-group">
          <input
            type="text"
            className="input large"
            autoComplete="off"
            placeholder=" "
            value={direccion}
            required
            onChange={(e) => setDireccion(e.target.value)}
          />
          <label htmlFor="cedula" className="user-label">
            Direccion Fiscal
          </label>
        </div>
        <button className="btn-print" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} />
        </button>
      </div>
      <ComponentToPrint
        control={control}
        nfact={nfact}
        rif={rif}
        direccion={direccion}
        razonSocial={razonSocial}
        telefono={telefono}
        userInfo={userInfo}
        ref={contentRef}
      />
    </div>
  );
}
