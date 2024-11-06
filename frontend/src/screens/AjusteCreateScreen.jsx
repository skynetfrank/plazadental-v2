import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listaTallas } from "../constants/listas";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { createAjuste } from "../actions/ajusteActions";
import { AJUSTE_CREATE_RESET } from "../constants/ajusteConstants";
import SearchIcon from "../icons/SearchIcon";
import AddCircleIcon from "../icons/AddCircleIcon";
import TrashIcon from "../icons/TrashIcon";

function AjusteCreateScreen(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [fecha] = useState(new Date());
  const [user] = useState(userInfo._id);
  const [tipoAjuste, setTipoAjuste] = useState("");
  const [causa, setCausa] = useState("");
  const [tipo] = useState("AJUSTE");

  const [sucursal] = useState("LOS-FRAILES");
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [talla, setTalla] = useState("");
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [palabra, setPalabra] = useState("");
  const [memo, setMemo] = useState("");
  const [totalUnidades, setTotalUnidades] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sent, setSent] = useState(false);
  const [qty, setQty] = useState(0);
  const cantidadList = [...Array(24).keys()];
  let tallasList = listaTallas.flatMap((valor) => {
    return valor.label;
  });
  tallasList.unshift("");

  const listaTipos = ["", "ENTRADA-INVENTARIO", "SALIDA-INVENTARIO"];
  const listaCausas = [
    "",
    "CAMBIO-TALLA",
    "CAMBIO-MODELO",
    "DEVOLUCION",
    "ITEM CON DETALLES",
    "ITEM MAL ESTADO",
    "CARGA-ERRONEA",
    "NO-REGISTRADO",
    "EXTRAVIADO",
    "MUESTRA-ENVIADO",
    "MUESTRA-RECIBIDO,",
    "DONACION",
    "PRESTAMO",
    "CONSIGNACION",
    "OBSEQUIO",
    "AJUSTE-EXISTENCIA",
    "CORRECCION",
  ];

  const ajusteCreate = useSelector((state) => state.ajusteCreate);
  const { loading, success, error, ajuste } = ajusteCreate;

  useEffect(() => {
    fetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/allproducts"
    )
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (busqueda === "") {
      return;
    } else {
      const founded = productos.find((f) => f.codigo === busqueda);

      if (!founded) {
        Swal.fire({
          title: "CODIGO NO ENCONTRADO!",
          text: "Ingrese solo Codigos Validos",
          icon: "warning",
        });
        setBusqueda("");
        setPalabra("");
        return;
      }
      setSelectedProduct(founded);
    }
  }, [busqueda, dispatch, productos]);

  const busquedaHandler = () => {
    setBusqueda(palabra.toUpperCase());
  };

  const palabraHandler = (e) => {
    setPalabra(e.target.value);
  };

  const clearSearch = () => {
    setBusqueda("");
    setPalabra("");
    setSelectedProduct("");
  };

  const addItem = () => {
    if (qty <= 0) {
      Swal.fire({
        title: "FALTA LA CANTIDAD",
        text: "Ingrese una Cantidad a Ajustar",
        icon: "warning",
      });
      return;
    }
    if (!talla) {
      Swal.fire({
        title: "FALTA LA TALLA",
        text: "Talla a Ajustar",
        icon: "warning",
      });
      return;
    }
    if (!tipoAjuste) {
      Swal.fire({
        title: "FALTA TIPO DE AJUSTE",
        text: "Tipo de Ajuste al Inventario",
        icon: "warning",
      });
      return;
    }
    if (!causa) {
      Swal.fire({
        title: "FALTA LA CAUSA DEL AJUSTE",
        text: "Evento que Origina el Ajuste",
        icon: "warning",
      });
      return;
    }
    if (items.length > 12) {
      Swal.fire({
        title: "NO SE PUEDEN AGREGAR MAS LINEAS",
        text: "Maximo Numero de Filas es 6",
        icon: "warning",
      });
      return;
    }

    setItems((prev) => {
      return [
        ...prev,
        {
          producto: selectedProduct._id,
          talla: String(talla),
          codigo: selectedProduct.codigo,
          marca: selectedProduct.marca,
          precio: selectedProduct.preciousd,
          cantidad: qty,
          imageurl: selectedProduct.imageurl,
          memo: memo,
          causa: causa,
          tipoAjuste: tipoAjuste,
        },
      ];
    });

    setSelectedProduct("");
    setTalla("");
    setBusqueda("");
    setPalabra("");
    setMemo("");
    setCausa("");
    setTipoAjuste("");
    setQty(0);
  };

  useEffect(() => {
    const total = items?.reduce(
      (accum, item) => accum + item.precio * item.cantidad,
      0
    );
    const totalPares = items?.reduce(
      (accum, item) => accum + Number(item.cantidad),
      0
    );
    setTotalItems(total);
    setTotalUnidades(totalPares);
  }, [items]);

  const deleteItem = (id) => {
    const found = items.filter((p) => p.producto !== id);
    setItems(found);
    setSelectedProduct("");
    setTalla("");
    setBusqueda("");
    setPalabra("");
  };

  const createAjusteHandler = () => {
    if (totalItems <= 0) {
      Swal.fire({
        title: "TOTAL MENOR O IGUAL A CERO",
        text: "No se puede Crear Pedido",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Guardar Ajustes y Salir",
      text: "Seguro no va  Agregar mas Articulos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Guardar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          createAjuste({
            fecha,
            user,
            tipo,
            orderItems: items,
            totalUnidades,
            totalItems,
            sucursal,
          })
        );
      }
    });
  };

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: "Ajuste Registrado con Exito!",
        text: "Registrar Ajuste",
      });
      dispatch({ type: AJUSTE_CREATE_RESET });
      navigate(`/signin?redirect=/ajuste/${ajuste._id}`);
    }
  }, [ajuste, dispatch, navigate, success]);

  console.log(palabra);

  return (
    <div className="flx column">
      <div className="flx column">
        <h2>Inversiones Paul 2428, C.A.</h2>
        <h4>Ajustes al Inventario </h4>
        <h4>Tienda Chacao</h4>
        <p>Fecha: {dayjs(fecha).format("DD/MM/YYYY")}</p>
      </div>
      <div>
        <div className="flx pos-rel">
          <input
            type="text"
            value={palabra}
            className="pad-1"
            placeholder="Codigo"
            onChange={palabraHandler}></input>
          <button
            className="btn-icon-container pos-abs right mr"
            onClick={busquedaHandler}>
            <SearchIcon />
          </button>
          <button className="btn-clear" onClick={clearSearch}>
            &#10006;
          </button>
        </div>
      </div>

      <div>
        {selectedProduct ? (
          <>
            <div className="flx border-1 b-radius pad-05 mb">
              <div className="flx column pad-0">
                <img className="img-small" src={selectedProduct.imageurl} />
                <div className="flx column pad-0 font-x negrita">
                  <span>{selectedProduct.codigo}</span>
                  <span>{selectedProduct.marca}</span>
                </div>
              </div>

              <div className="flx column">
                <label>Talla</label>
                <select
                  value={talla}
                  onChange={(e) => setTalla(e.target.value)}>
                  {tallasList.map((x, inx) => (
                    <option key={inx} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flx column">
                <label>Tipo de Ajuste</label>
                <select
                  className="w-100 font-x"
                  value={tipoAjuste}
                  onChange={(e) => setTipoAjuste(e.target.value)}>
                  {listaTipos.map((x, inx) => (
                    <option key={inx} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flx column">
                <label>Causa del Ajuste</label>
                <select
                  className="w-140 font-x"
                  value={causa}
                  onChange={(e) => setCausa(e.target.value)}>
                  {listaCausas.map((x, inx) => (
                    <option key={inx} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flx column">
                <label>Cant.</label>
                <select
                  className="select-ajuste-small"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}>
                  {cantidadList.map((x, inx) => (
                    <option key={inx} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flx column">
                <label>Observaciones</label>

                <input
                  id="cambioBcv"
                  name="cambiobcv"
                  type="text"
                  value={memo}
                  required
                  onChange={(e) => setMemo(e.target.value)}></input>
              </div>

              <button className="btn-icon-container" onClick={addItem}>
                <AddCircleIcon />
              </button>
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      {items.length > 0 ? (
        <div>
          <div className="flx pad-05 border-1 b-radius mtop-1 font-14 negrita">
            <p className="minw-80">Producto</p>
            <p className="minw-120">Tipo-Ajuste</p>
            <p className="minw-120">Causa de Ajuste </p>
            <p className="minw-30 mr">Talla</p>
            <p className="minw-30 mr">Cant.</p>
            <p className="minw-30 mr">Precio</p>
            <p className="minw-30 mr">Monto</p>
          </div>

          {items.map((item, inx) => {
            return (
              <div className="flx jsb font-1 pad-05" key={inx}>
                <span className="minw-60 pad-right">{item.codigo}</span>
                <span className="minw-120 pad-right font-x">
                  {item.tipoAjuste}
                </span>
                <span className="minw-120 pad-right">{item.causa}</span>
                <span className="minw-30 mr">{item.talla}</span>
                <span className="minw-30 mr"> {item.cantidad}</span>
                <span className="minw-30 ml">{item.precio}</span>
                <span className="minw-60 ml">
                  {(item?.precio * item?.cantidad).toFixed(2)}
                </span>
                <span>{item.memo}</span>
              </div>
            );
          })}
          <div className="flx jsb border-1 b-radius">
            <p>Total Unidades:{totalUnidades}</p>
            <p>Total General: ${totalItems.toFixed(2)}</p>
          </div>
          <div className="add-btn-container">
            <button
              className="btn-add-pedido-mayor"
              onClick={createAjusteHandler}>
              Guardar
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default AjusteCreateScreen;
