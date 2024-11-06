import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { saveClienteInfo } from "../actions/cartActions";
import { selectCanal } from "../constants/listas";

export default function ClienteNewScreen(props) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [rif, setRif] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [celular, setCelular] = useState("");
  const [canal, setCanal] = useState("");
  const [timestamp, setTimestamp] = useState(new Date());

  const { search } = useLocation();
  const cedulaInUrl = new URLSearchParams(search).get("rif");
  const dispatch = useDispatch();

  //https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/agregarcliente

  useEffect(() => {
    setRif(cedulaInUrl);
  }, [cedulaInUrl]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!nombre) {
      Swal.fire({
        title: "FALTA EL NOMBRE DEL CLIENTE!",
        text: "Cliente Nuevo",
        icon: "error",
      });
      return;
    }
    if (!direccion) {
      Swal.fire({
        title: "FALTA LA DIRECCION DEL CLIENTE!",
        text: "Cliente Nuevo",
        icon: "error",
      });
      return;
    }

    try {
      const { data } = await axios.post(
        "https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/agregarcliente",
        {
          nombre,
          rif,
          email,
          celular,
          direccion,
          canal,
          timestamp,
        }
      );
      if (data) {
        dispatch(
          saveClienteInfo({
            nombre,
            rif,
            telefono: celular,
            email,
            direccion,
            canal,
          })
        );
        Swal.fire("Cliente Registrado!", "", "success").then((result) => {
          if (result.isConfirmed) {
            navigate("/facturacion");
          }
        });
      }
    } catch (error) {
      console.log("error de axios:", error);
    }
  };

  return (
    <div>
      <h2 className="centrado">Registrar Cliente</h2>
      <div className="flx jcenter">
        <form className="form flx column bg-color b-radius border-1 pad-2 centrado" onSubmit={submitHandler}>
          <div className="flx column astart pad-0">
            <label>RIF/Cedula</label>
            <input type="text" value={rif} required="" disabled onChange={(e) => setRif(e.target.value)} />
          </div>
          <div className="flx column astart pad-0">
            <label>Nombre</label>
            <input type="text" value={nombre} required="" onChange={(e) => setNombre(e.target.value)}></input>
          </div>
          <div className="flx column astart pad-0">
            <label>Direccion</label>
            <input type="text" value={direccion} required="" onChange={(e) => setDireccion(e.target.value)} />
          </div>
          <div className="flx column astart pad-0">
            <label>Telefono</label>
            <input type="text" value={celular} onChange={(e) => setCelular(e.target.value)} />
          </div>
          <div className="flx column astart pad-0">
            <label>Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flx column astart pad-0">
            <label>Canal de Difusion</label>
            <input type="text" value={canal} list="selectCanal" onChange={(e) => setCanal(e.target.value)} />
            <datalist id="selectCanal">
              {selectCanal.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </datalist>
          </div>

          <div>
            <button className="button" type="submit">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
