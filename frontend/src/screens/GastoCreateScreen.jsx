/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { createGasto } from "../actions/gastoActions";
import { GASTO_CREATE_RESET } from "../constants/gastoConstants";
import Swal from "sweetalert2";
import camera from "../assets/camera.png";
import { selectBancos, selectFormapago, nombres, categorias } from "../constants/listas";

function subtractHours(date, hours) {
  date.setHours(date.getHours() - hours);
  return date;
}

export default function GastoCreateScreen(props) {
  const [f1, setF1] = useState(subtractHours(new Date(), 6));
  const [fecha, setFecha] = useState(
    f1.getFullYear().toString() +
    "-" +
    (f1.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    f1.getDate().toString().padStart(2, 0)
  );
  const [referencia, setReferencia] = useState("");
  const [formadepago, setFormadepago] = useState("Efectivo US$");
  const [banco, setBanco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [beneficiario, setBeneficiario] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [montousd, setMontousd] = useState(0);
  const [montobs, setMontobs] = useState(0);

  const [cambiodia, setCambiodia] = useState(Number(localStorage.getItem("cambioBcv")).toFixed(2));

  const [imageurl, setImageurl] = useState("");
  const [imageurl2, setImageurl2] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const [registradopor] = useState(userInfo?.nombre + " " + userInfo?.apellido);

  const gastoCreate = useSelector((state) => state.gastoCreate);
  const { gasto } = gastoCreate;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    if (montousd + montobs === 0) {
      Swal.fire({
        title: "El Monto no puede ser Cero",
        text: "Registrar Gastos",
        icon: "success",
      });
      return;
    }

    dispatch(
      createGasto(
        fecha,
        referencia,
        formadepago,
        banco,
        categoria,
        beneficiario,
        descripcion,
        montousd,
        montobs,
        cambiodia,
        registradopor,
        imageurl,
        imageurl2
      )
    );
  };

  useEffect(() => {
    if (gasto) {
      Swal.fire({
        title: "Gasto Registrado",
        text: "Registrar Gastos",
        icon: "success",
      });

      dispatch({ type: GASTO_CREATE_RESET });
      setFecha(subtractHours(new Date(), 6));
      setReferencia("");
      setFormadepago("");
      setBanco("");
      setCategoria("");
      setBeneficiario("");
      setDescripcion("");
      setMontousd("");
      setMontobs("");
      setCambiodia("");
      setImageurl("");
      setImageurl2("");
    }
  }, [dispatch, gasto]);

  const uploadFileHandler = async (e) => {
    const image = e.target.files[0];

    const bodyFormData = new FormData();
    bodyFormData.append("file", image);
    bodyFormData.append("upload_preset", "paulshoespreset");
    bodyFormData.append("cloud_name", "reactorsys");
    bodyFormData.append("folder", "productos");
    setLoadingUpload(true);

    try {
      const { data } = await Axios.post("https://api.cloudinary.com/v1_1/reactorsys/image/upload", bodyFormData);
      setImageurl(data.secure_url);
      setLoadingUpload(false);
    } catch (error) {
      setImageurl("");
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  const uploadFile2Handler = async (e) => {
    const image2 = e.target.files[0];

    const bodyFormData = new FormData();
    bodyFormData.append("file", image2);
    bodyFormData.append("upload_preset", "paulshoespreset");
    bodyFormData.append("cloud_name", "reactorsys");
    bodyFormData.append("folder", "productos");
    setLoadingUpload(true);

    try {
      const { data } = await Axios.post("https://api.cloudinary.com/v1_1/reactorsys/image/upload", bodyFormData);
      setImageurl2(data.secure_url);
      setLoadingUpload(false);
    } catch (error) {
      setImageurl2("");
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  const handleMontobs = (e) => {
    e.preventDefault();
    setMontousd((parseFloat(e.target.value) / parseFloat(cambiodia)).toFixed(2));
    setMontobs(e.target.value);
  };

  const handleMontousd = (e) => {
    e.preventDefault();
    setMontobs((parseFloat(e.target.value) * parseFloat(cambiodia)).toFixed(2));
    setMontousd(e.target.value);
  };

  const handleCambio = (e) => {
    e.preventDefault();
    setMontobs((parseFloat(montousd) * parseFloat(e.target.value)).toFixed(2));
    setCambiodia(e.target.value);
  };

  return (
    <div className="flx column jcenter m-0 pad-0">
      <h2 className="centrado m-1">Registrar Gasto</h2>
      <form className="form flx bg-color b-radius border-1 pad-2 centrado" onSubmit={submitHandler}>
        <div>
          <div>
            <input
              type="date"
              className="b-radius border-1 b-radius-05 pad-05 w-120"
              value={fecha}
              required
              onChange={(e) => setFecha(e.target.value)}
            ></input>
          </div>

          <div className="flx abase pad-0">
            <div className="flx column astart pad-05">
              <label>Beneficiario</label>
              <input
                type="text"
                className="b-radius border-1 b-radius-05 pad-05 w-full"
                value={beneficiario}
                list="nombres"
                required
                maxLength={50}
                onChange={(e) => setBeneficiario(e.target.value)}
              ></input>
              <datalist id="nombres">
                {nombres.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </datalist>
            </div>
          </div>
          <div className="flx jsb abase pad-0">
            <div className="flx column astart pad-0">
              <label>Referencia No.</label>
              <input
                type="text"
                className="b-radius border-1 b-radius-05 pad-05 w-100"
                value={referencia}
                required
                maxLength={50}
                onChange={(e) => setReferencia(e.target.value)}
              ></input>
            </div>
            <div className="flx column astart pad-0">
              <label>Categoria</label>
              <input
                type="text"
                className="b-radius border-1 b-radius-05 pad-05 w-120"
                value={categoria}
                list="categorias"
                required
                onChange={(e) => setCategoria(e.target.value)}
              ></input>
              <datalist id="categorias">
                {categorias.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div className="flx column astart pad-0 mtop-1">
            <label>Descripcion</label>
            <input
              type="text"
              className="b-radius border-1 b-radius-05 pad-05 w-full"
              value={descripcion}
              required
              maxLength={50}
              onChange={(e) => setDescripcion(e.target.value)}
            ></input>
          </div>

          <div className="flx jsb pad-0 mtop-1">
            {" "}
            <div className="flx column astart pad-0">
              <label>Monto US$</label>
              <input
                type="number"
                className="b-radius border-1 b-radius-05 pad-05 w-70 txt-align-r"
                value={montousd}
                required
                onChange={(e) => handleMontousd(e)}
              ></input>
            </div>
            <div className="flx column astart pad-0">
              <label>Cambio</label>
              <input
                type="number"
                className="b-radius border-1 b-radius-05 pad-05 w-70 txt-align-r"
                value={cambiodia}
                required
                onChange={(e) => handleCambio(e)}
              ></input>
            </div>
            <div className="flx column astart pad-0">
              <label>Monto Bs.</label>
              <input
                type="number"
                className="b-radius border-1 b-radius-05 pad-05 w-70 txt-align-r"
                value={montobs}
                required
                onChange={(e) => handleMontobs(e)}
              ></input>
            </div>
          </div>

          <div className="flx jsb pad-0 mtop-1">
            {" "}
            <div className="flx column astart pad-0">
              <label className="small-label w120">Forma Pago</label>
              <select
                className="w-120 b-radius-05 pad-05"
                value={formadepago}
                onChange={(e) => setFormadepago(e.target.value)}
              >
                {selectFormapago.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="flx column astart pad-0">
              <label className="small-label w120">Banco</label>
              <select className="w-120 b-radius-05 pad-05" value={banco} onChange={(e) => setBanco(e.target.value)}>
                {selectBancos.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flx jsb pad-0 mtop-1">
            <div className="flx column pos-rel border-1">
              <img src={imageurl ? imageurl : "/camera.png"} className="tiny-image" alt="img1" />
              <p>Documento 1</p>
              <input type="file" className="custom-file-input" id="foto1" onChange={uploadFileHandler}></input>
            </div>
            <div className="flx column pos-rel border-1">
              <img src={imageurl2 ? imageurl2 : "/camera.png"} className="tiny-image" alt="img2" />
              <p>Documento 2</p>
              <input type="file" className="custom-file-input" id="foto2" onChange={uploadFile2Handler}></input>
            </div>
          </div>
          <button className="btn-submit m-2" type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
