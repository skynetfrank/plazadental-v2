import React, { useState } from "react";
import logo from "/plazaDentalLogo.jpg";
import wsapp from "/whatsapp.png";
import instagram from "/instagram.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Create Document Component
// eslint-disable-next-line react/display-name
const ComponentToPrintConstancia = React.forwardRef((props, ref) => {
  const control = props.control;
  const userInfo = props.userInfo;
  const getPageMargins = () => {
    const marginTop = "30px";
    const marginRight = "75px";
    const marginBottom = "10px";
    const marginLeft = "70px";
    return `@page { margin: ${marginTop} ${marginRight}  ${marginBottom} ${marginLeft}}`;
  };

  return (
    <div ref={ref}>
      <style>{getPageMargins()}</style>
      <div>
        <div>
          <div>
            <div className="print-header">
              <div className="print-header-direccion">
                <img className="logo recipe" src={logo} alt="logo" />
                <div className="print-header-direccion-content">
                  <h2>Plaza Dental</h2>
                  <p>
                    Av. Principal, Edificio Torre La Previsora, piso 12, Ofic.
                    12-1
                  </p>
                  <p>Urb. plaza Venezuela, Caracas, Distrito Capital.</p>
                  <p>Email: plazadentalvenezuela@gmail.com</p>
                </div>
              </div>

              <div className="social-icons">
                <img src={wsapp} alt="logo" />
                <p>(0412) 611.9001</p>
                <img src={instagram} alt="logo" />
                <p>@PLAZADENTALVZLA</p>
              </div>
            </div>



            <div className="titulo-recipe constancia">
              {" "}
              <h2>CONSTANCIA</h2>
            </div>
            <div className="detalle-recipe-print constancia">
              <p>{control?.constancia}</p>
            </div>
            <div className="constancia-att">
              <p>Atentamente,</p>
            </div>
            <div className="footer-firma-print recipe">
              <p>
                Doctor (a):{" "}
                {control.doctor.nombre + " " + control.doctor.apellido}
                __________________________
              </p>
            </div>








          </div>



        </div>
      </div>
    </div>
  );
});

export default ComponentToPrintConstancia;
