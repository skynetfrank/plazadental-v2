import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsProduct, updateProduct } from "../actions/productActions";
import { useNavigate, useParams } from "react-router-dom";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

import {
  listaMarcas,
  listaCategorias,
  listaColores,
  listaGeneros,
  listaModelos,
  listaTallas,
  listaTipos,
} from "../constants/listas";

import Compressor from "compressorjs";
import Swal from "sweetalert2";
import ImageSearchIcon from "../icons/ImageSearchIcon";
import CheckIcon from "../icons/CheckIcon";

export default function ProductEditScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { id: productId } = params;

  const [codigo, setCodigo] = useState("");
  const [etiquetas, setEtiquetas] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [genero, setGenero] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [existencia, setExistencia] = useState("");
  const [costousd, setCostousd] = useState("");
  const [preciousd, setPreciousd] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [image, setImage] = useState("");
  const [localUri, setLocalUri] = useState(
    "https://res.cloudinary.com/ronaldimg/image/upload/v1695222415/cld-sample-5.jpg"
  );
  const [cambiodia, setCambiodia] = useState("");
  const [fileName, setFileName] = useState("");
  const [tallas, setTallas] = useState({});
  const [contenedor, setContenedor] = useState(3);
  const [isPromocion, setIsPromocion] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);
  const [textopromocion, setTextoPromocion] = useState("");
  const [imageuploaded, setImageuploaded] = useState(false);
  const [tipo, setTipo] = useState("");
  const [kbytes, setKbytes] = useState(0);

  const form1 = useRef("");
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { success: successUpdate } = productUpdate;

  const keys = listaTallas.flatMap((valor) => {
    return valor.label;
  });

  useEffect(() => {
    if (successUpdate) {
      Swal.fire({
        title: "Producto Actualizado!",
        text: "Editar Producto",
        icon: "success",
      });
    }
    if (!product || product._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setCodigo(product.codigo || " ");
      setEtiquetas(product.etiquetas || " ");
      setCategoria(product.categoria || "");
      setUbicacion(product.ubicacion || "");
      setMarca(product.marca || "");
      setModelo(product.modelo || "");
      setColor(product.color || "");
      setTallas(product.tallas || {});
      setGenero(product.genero || "");
      setDescripcion(product.descripcion || "");
      setExistencia(0);
      setCostousd(product.costousd || "");
      setPreciousd(product.preciousd || "");
      setCambiodia(product.cambiodia || "");
      setImageurl(product.imageurl || "");
      setIsPromocion(product?.promocion || false);
      setIsInstagram(product?.instagram || false);
      setTextoPromocion(product?.textopromocion || "");
      setTipo(product.tipo || "");
      setImageuploaded(false);
    }
  }, [dispatch, product, productId, successUpdate]);

  useEffect(() => {
    const valores = Object.values(tallas);
    const suma = valores.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    setExistencia(suma);
  }, [tallas]);

  useEffect(() => {
    if (!image) {
      return;
    }
    const cargarImagen = () => {
      setImageuploaded(false);
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "ronald_preset");
      data.append("cloud_name", "ronaldimg");
      data.append("folder", "productos");
      fetch("https://api.cloudinary.com/v1_1/ronaldimg/image/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          const bits = Number(data.bytes) / 1000;
          setImageurl(data.secure_url);
          setImageuploaded(true);
          setKbytes(bits);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    cargarImagen();
  }, [image]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        categoria,
        ubicacion,
        marca,
        modelo,
        color,
        genero,
        descripcion,
        existencia,
        tallas,
        costousd,
        preciousd,
        cambiodia,
        imageurl,
        tipo,
        isPromocion,
        isInstagram,
        textopromocion,
      })
    );
  };

  const handleTallas = (e) => {
    const { name, value } = e.target;

    setTallas((prev) => {
      return { ...prev, [name]: Number(value) };
    });
  };

  return (
    <>
      <div className="flx column jcenter">
        <h2>EDITAR PRODUCTO {product?.codigo}</h2>{" "}
        <form
          className="form flx column bg-color b-radius border-1 pad-2 centrado"
          ref={form1}
          onSubmit={submitHandler}>
          <div className="wrapper-container">
            <div className="edit-select-container">
              <label>Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}>
                {listaCategorias.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="edit-select-container">
              <label>Marca</label>
              <select value={marca} onChange={(e) => setMarca(e.target.value)}>
                {listaMarcas.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-select-container">
              <label>Genero</label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}>
                {listaGeneros.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-select-container">
              <label>Modelo</label>
              <select
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}>
                {listaModelos.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="edit-select-container">
              <label>Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                {listaTipos.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-select-container">
              <label>Color</label>
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                {listaColores.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="edit-input-container">
              <label>Precio US$: </label>
              <input
                className="numeros"
                min={0}
                max={500}
                type="number"
                value={preciousd}
                onChange={(e) => setPreciousd(e.target.value)}
              />
            </div>

            <div className="edit-input-container">
              <label>Existencia: </label>
              <input
                className="maxw-60 centrado"
                type="number"
                value={existencia}
                disabled
                onChange={(e) => setExistencia(e.target.value)}
              />
            </div>
          </div>

          <h2>Existencia por Tallas</h2>
          <div className="flx wrap">
            {keys.map((talla, inx) => {
              return (
                <span key={talla} className="edit-span-tallas">
                  <span>{talla}</span>
                  {
                    <input
                      type="number"
                      value={tallas[talla]}
                      className="input-talla"
                      name={talla}
                      onChange={handleTallas}
                    />
                  }
                </span>
              );
            })}
          </div>

          <div
            className="input-file-container"
            onClick={() => document.querySelector(".input-field").click()}>
            <input
              type="file"
              accept="image/*"
              className="input-field"
              hidden
              onChange={({ target: { files } }) => {
                const file = files[0];
                new Compressor(file, {
                  quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
                  success: (compressedResult) => {
                    // compressedResult has the compressed file the blob to be uploaded.
                    setLocalUri(URL.createObjectURL(compressedResult));
                    setImage(compressedResult);
                  },
                  error: (err) => {
                    console.log("error al comprimir la imagen", err);
                  },
                });
              }}
            />
            {image ? (
              <img src={localUri} width={300} height={200} />
            ) : imageurl ? (
              <img src={imageurl} width={300} height={200} />
            ) : (
              <>
                <div className="upload-icon">
                  <ImageSearchIcon />
                  <p>selecciona un imagen para el producto</p>
                </div>
              </>
            )}
            {/*  <div className="actual-img">
              {" "}
              <img src={product.imageurl} width={200} height={200} />
            </div> */}
          </div>

          <div className="upload-img-info">
            {imageuploaded ? <CheckIcon /> : ""}
            <span>{kbytes.toFixed(0)} kbytes subidos</span>
          </div>

          <div className="centered">
            <button type="submit">ACTUALIZAR</button>
          </div>
        </form>
      </div>
    </>
  );
}
