import React, { useState } from "react";
import logo from "/plazaDentalLogo.jpg";
import wsapp from "/whatsapp.png";
import instagram from "/instagram.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Create Document Component
// eslint-disable-next-line react/display-name
const ComponentToPrintRecipe = React.forwardRef((props, ref) => {
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

            <div className="encabezado-print recipe">
              <div>
                <p>
                  <strong>Paciente: </strong>{" "}
                  {control.paciente.nombre +
                    " " +
                    control.paciente.apellido +
                    " " +
                    " C.I. " +
                    control.paciente.cedula}
                  <br />
                  <strong>Direccion: </strong>
                  {control.paciente.direccion}
                </p>
              </div>
              <div>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {props.control.createdAt}
                  <br />
                  <strong> Telefono: </strong>
                  {control.paciente.telefono
                    ? control.paciente.telefono
                    : control.paciente.celular}
                </p>
              </div>
            </div>

            <div className="titulo-recipe">
              {" "}
              <h2>RECIPE MEDICO</h2>
            </div>
            <div className="detalle-recipe-print">
              <p>{control.recipe}</p>
            </div>
            <div className="footer-firma-print recipe">
              <p>
                Doctor (a):{" "}
                {control.doctor.nombre + " " + control.doctor.apellido}
                __________________________
              </p>
            </div>
            <hr />

            <div className="print-header">
              <div className="print-header-direccion">
                <img className="logo recipe" src={logo} alt="logo" />
                <div className="print-header-direccion-content">
                  <h2>Plaza Dental</h2>
                  <p>
                    Av. Principal, Edificio Torre La Previsora, piso 12, Ofic.
                    12-01
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

            <div className="encabezado-print recipe">
              <div>
                <p>
                  <strong>Paciente: </strong>{" "}
                  {control.paciente.nombre +
                    " " +
                    control.paciente.apellido +
                    " " +
                    " C.I. " +
                    control.paciente.cedula}
                  <br />
                  <strong>Direccion: </strong>
                  {control.paciente.direccion}
                  <br />
                </p>
              </div>
              <div>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {props.control.createdAt}
                  <br />
                  <strong> Telefono: </strong>
                  {control.paciente.telefono
                    ? control.paciente.telefono
                    : control.paciente.celular}
                </p>
                <p></p>
              </div>
            </div>

            <div className="titulo-recipe">
              {" "}
              <h2>INDICACIONES</h2>
            </div>
            <div className="detalle-recipe-print">
              <p>{control.indicaciones}</p>
            </div>
          </div>
          <div>
            <br></br>
          </div>
          <div className="footer-firma-print recipe">
            <p>
              Doctor (a):{" "}
              {control.doctor.nombre + " " + control.doctor.apellido}
              __________________________
            </p>
          </div>

          {/*  <div className="bottom-section-print recipe">
            <div className="footer-direccion-print">
              <p>
                EdidifiioCalle La guairita,Urbanizacion Chuao, Piso 5, Oficina PT-504
                Municipio Baruta, Estado Miranda. Caracas. Venezuela.
              </p>
            </div>
            <div className="footer-telefono-print">
              <p>Telefono: (0412) 611.39.70 e-mail: Invpaul2428@gmail.com</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
});

export default ComponentToPrintRecipe;
