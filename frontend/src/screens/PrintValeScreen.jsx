import React, {  useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import ValeToPrint from "../components/ValeToPrint";

export default function PrintValeScreen(props) {
  const location=useLocation()
  const vale=location.state.vale
  const nombre=location.state.nombre
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  }); 

  return  (    
    <div className="printer-container">
      <div className="flx centro">
        <button className="btn-print" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} />
        </button>
      </div>

      <ValeToPrint vale={vale} nombre={nombre} ref={componentRef} />
    </div>
  );
}
