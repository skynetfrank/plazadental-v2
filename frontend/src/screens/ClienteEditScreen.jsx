import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  detailsCliente,
  updateClienteProfile,
} from "../actions/clienteActions";
import LoadingBox from "../components/LoadingBox";
import { CLIENTE_UPDATE_PROFILE_RESET } from "../constants/clienteConstants";
import Swal from "sweetalert2";
import { selectCanal } from "../constants/listas";

export default function ClienteEditScreen(props) {
  const navigate = useNavigate("");
  const params = useParams();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rif, setRif] = useState("");
  const [direccion, setDireccion] = useState("");
  const [celular, setCelular] = useState("");
  const [canal, setCanal] = useState("");

  const { id: clienteId } = params;

  const clienteDetails = useSelector((state) => state.clienteDetails);
  const { loading, cliente } = clienteDetails;
  const clienteUpdateProfile = useSelector(
    (state) => state.clienteUpdateProfile
  );
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = clienteUpdateProfile;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cliente || cliente._id !== clienteId || successUpdate) {
      dispatch({ type: CLIENTE_UPDATE_PROFILE_RESET });
      dispatch(detailsCliente(clienteId));
    } else {
      setNombre(cliente.nombre);
      setEmail(cliente.email);
      setRif(cliente.rif);
      setDireccion(cliente.direccion);
      setCelular(cliente.celular);
      setCanal(cliente.canal);
    }
  }, [dispatch, cliente, clienteId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateClienteProfile({
        _id: clienteId,
        nombre,
        email,
        rif,
        direccion,
        celular,
        canal,
      })
    );
  };
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: CLIENTE_UPDATE_PROFILE_RESET });
      Swal.fire({
        title: "INFORMACION ACTUALIZADA!",
        text: "Editar Informacion Cliente",
        icon: "success",
      });
    }
  });

  useEffect(() => {
    if (errorUpdate) {
      Swal.fire({
        title: "HA OCURRIDO UN ERROR!",
        text: "Actualizar Informacion Cliente",
        icon: "error",
      });
      dispatch({ type: CLIENTE_UPDATE_PROFILE_RESET });
    }
  });

  return (
    <div>
      <Link to="/reporteclientes" className="back-link">
        volver a Clientes
      </Link>
      <div className="flx jcenter">
        <form
          className="form flx column bg-color b-radius border-1 pad-2 centrado"
          onSubmit={submitHandler}>
          <div>
            <h2>Editar Cliente</h2>
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : (
            <>
              {loadingUpdate && <LoadingBox></LoadingBox>}
              <div className="flx column astart">
                <label htmlFor="name">Nombre o Razon Social</label>
                <input
                  className="b-radius border-1 pad-1 w-200"
                  type="text"
                  value={nombre}
                  required
                  maxLength={50}
                  onChange={(e) => setNombre(e.target.value)}></input>
              </div>
              <div className="flx column astart">
                <label htmlFor="rif">R.I.F.</label>
                <input
                  className="b-radius border-1 pad-1 w-200"
                  type="text"
                  id="rif"
                  pattern="[V|J|G][0-9]{6,9}"
                  value={rif}
                  required
                  maxLength={10}
                  onChange={(e) => setRif(e.target.value)}></input>
              </div>

              <div className="flx column astart">
                <label htmlFor="direccion">Direccion Fiscal</label>
                <input
                  className="b-radius border-1 pad-1 w-200"
                  type="text"
                  id="direccion"
                  value={direccion}
                  required
                  maxLength={80}
                  onChange={(e) => setDireccion(e.target.value)}></input>
              </div>

              <div className="flx column astart">
                <label htmlFor="celular">Celular</label>
                <input
                  className="b-radius border-1 pad-1 w-200"
                  type="text"
                  id="celular"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                />
              </div>

              <div className="flx column astart">
                <label htmlFor="email">Email</label>
                <input
                  className="b-radius border-1 pad-1 w-200"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}></input>
              </div>
              <div className="flx column astart pad-0">
                <label>Canal de Difusion</label>
                <input
                  type="text"
                  value={canal}
                  list="selectCanal"
                  onChange={(e) => setCanal(e.target.value)}
                />
                <datalist id="selectCanal">
                  {selectCanal.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <button className="centrado" type="submit">
                  Actualizar Cliente
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
