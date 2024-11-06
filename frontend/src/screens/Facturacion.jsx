import { useEffect, useState } from "react";
import FacturacionTable from "../components/FacturacionTable";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { addToCart, removeFromCart, saveClienteInfo } from "../actions/cartActions";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import logo from "../assets/logo.png";
import { CART_EMPTY } from "../constants/cartConstants";
import DeliveryForm from "../components/DeliveryForm";
import PaymentForm from "../components/PaymentForm";
import UserCircleIcon from "../icons/UserCircleIcon";
import DollarIcon from "../icons/DollarIcon";
import BikeIcon from "../icons/BikeIcon";
import SaveIcon from "../icons/SaveIcon";
import TrashIcon from "../icons/TrashIcon";
import ToolTip from "../components/ToolTip";
import MemoIcon from "../icons/MemoIcon";
import { selectCondicion } from "../constants/listas";
import Loader from "../components/Loader";
import ReloadIcon from "../icons/ReloadIcon";

function subtractHours(date, hours) {
  date.setHours(date.getHours() - hours);
  return date;
}

function Facturacion() {
  const [reload, setReload] = useState(false);
  const sellers = JSON.parse(localStorage.getItem("vendedores"));
  const navigate = useNavigate("");
  const [cliente] = useState(JSON.parse(localStorage.getItem("clienteInfo")));
  const [productos, setProductos] = useState(JSON.parse(localStorage.getItem("productos")));
  const [vendedores] = useState([{ _id: "", nombre: "", apellido: "" }, ...sellers]);
  const [clearInput, setClearInput] = useState(false);
  const [memo, setMemo] = useState("");
  const [cambio] = useState(Number(localStorage.getItem("cambioBcv")).toFixed(2));
  const [fecha] = useState(subtractHours(new Date(), 6));
  const [descuento, setDescuento] = useState(0);
  const [flete, setFlete] = useState(0);
  const [isCashea, setisCashea] = useState(false);
  const [montoCashea, setMontoCashea] = useState(0);
  const [ordenCashea, setOrdenCashea] = useState("");
  const [condicion, setCondicion] = useState("De Contado");
  const [vendedor, setVendedor] = useState("");
  const selectList = [...Array(300).keys()];
  const [isDelivery, setIsDelivery] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalPago, setTotalPago] = useState(0);
  const [isGuardar, setIsGuardar] = useState(false);
  const [txtformapago, setTxtformapago] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const cart = useSelector((state) => state.cart);
  const { cartItems, clienteInfo } = cart;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { success, order } = orderCreate;

  const dispatch = useDispatch();

  const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
  cart.user = userInfo._id;
  cart.condicion = condicion;
  cart.vendedor = vendedor;
  cart.fecha = fecha;
  cart.totalItems = toPrice(cart.cartItems.reduce((a, c) => a + c.qty * c.precio, 0));
  cart.delivery = Number(flete);
  cart.descuento = Number(descuento);
  cart.subtotal = toPrice(cart.totalItems + cart.delivery - cart.descuento);
  cart.iva = toPrice(0.16 * cart.subtotal);
  cart.totalVenta = cart.subtotal + cart.iva;
  cart.cambioDia = Number(cambio);

  useEffect(() => {
    if (cambio <= 0) {
      Swal.fire({
        title: "Actualice el cambio BCV!",
        text: "Cambio BCV no puede ser Cero",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      navigate("/");
    }
    if (!cambio) {
      Swal.fire({
        title: "Actualice el cambio BCV!",
        text: "Cambio BCV no puede ser Nulo",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: "Venta Registrada con Exito!",
        text: "Registrar Ventas",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });

      dispatch({ type: CART_EMPTY });
      localStorage.removeItem("cartItems");
      localStorage.removeItem("clienteInfo");
      dispatch({ type: ORDER_CREATE_RESET });
      setIsGuardar(false);
      setMemo("");
      navigate(`/signin?redirect=/order/${order._id}`);
    }
  }, [dispatch, navigate, order, success]);

  const removeFromCartHandler = (id, deltalla) => {
    dispatch(removeFromCart(id, deltalla));
  };

  const handleDataFromChild = (data) => {
    cart.deliveryInfo = data;

    if (cart.deliveryInfo.origenVenta) {
      setIsDelivery(true);
    }
  };

  const handlePayFromChild = (data, textopago) => {
    console.log("textopago", textopago);
    cart.pago = data;
    const bs = Number(data.efectivobs) / Number(cambio);
    const punto = Number(data.punto.montopunto) / Number(cambio);
    const punto2 = Number(data.punto.montopunto2) / Number(cambio);
    const punto3 = Number(data.punto.montopunto3) / Number(cambio);
    const pmobil = Number(data.pagomovil.montopagomovil) / Number(cambio);

    const suma =
      bs +
      punto +
      punto2 +
      punto3 +
      pmobil +
      Number(data.zelle.montozelle) +
      Number(data.efectivousd) +
      Number(data.efectivoeuros);

    setTotalPago(Number(suma));
    setTxtformapago(textopago);
  };

  const addMemoHandler = async () => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Observaciones",
      inputPlaceholder: "Escribe cualquier informacional adicional...",
      showCancelButton: true,
      confirmButtonText: "Guardar",
    });
    cart.memo = text;
    setMemo(text);
  };

  const buscarCliente = () => {
    setClearInput(true);
    Swal.fire({
      title: "Datos del Comprador",
      text: "Ingrese Cedula o Rif del Cliente",
      input: "text",
      inputAttributes: {
        autocapitalize: "on",
        placeHolder: "Ejemplo: V123456789 - sin guiones ni espacios",
        maxLength: "10",
        minLength: "6",
        require: true,
      },
      inputValidator: (value) => {
        if (!value) {
          return "Debe Ingresar Cedula o RIF!";
        }

        const longitud = value.length;
        const firstLetter = value.at(0).toUpperCase();

        if (longitud < 6) {
          return "Formato Incorrecto! (faltan digitos)";
        }
        if (firstLetter != "V" && firstLetter != "J" && firstLetter != "E" && firstLetter != "G") {
          return "Primera Letra debe ser V - E - J o G!";
        }
        if (value.match("-")) {
          return "no se permiten guiones";
        }
      },
      showCancelButton: true,
      confirmButtonText: "Enviar",
      confirmButtonColor: "black",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,

      preConfirm: async (id) => {
        localStorage.setItem("tempId", id.toUpperCase());
        try {
          const response = await fetch(
            `https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/getclient?id=${id.toUpperCase()}`
          );
          if (!response.ok) {
            return Swal.showValidationMessage(`
              ${JSON.stringify(await response.json())}
            `);
          }
          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (!result.isConfirmed) {
        localStorage.removeItem("clienteInfo");
        return;
      }
      if (!result.value) {
        Swal.fire({
          title: "Cedula No Registrada!",
          text: "Desea Agregar Este Cliente?",
          icon: "info",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, registrar",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/addcliente?rif=${localStorage.getItem("tempId")}`);
          }
          if (result.isDismissed) {
            return;
          }
        });
      }
      if (result.value) {
        Swal.fire({
          title: `${result.value.nombre}`,
          imageUrl: "/avatar.jpg",
          html: `<p>${result.value.rif}</p>
          <p>${result.value.direccion}</p>
          <p>Telefono: ${result.value.celular ? result.value.celular : "No Disponible"}</p>
          <p>${result.value.email ? "Email: " + result.value.email : ""}</p>
         
          `,
        }).then(() => {
          //navigate("/placeorder");
        });
        dispatch(
          saveClienteInfo({
            nombre: result.value.nombre,
            apellido: result.value.apellido,
            rif: result.value.rif,
            telefono: result.value.celular,
            email: result.value.email,
            direccion: result.value.direccion,
          })
        );
      }
    });
  };

  const addToCartHandler = (paramId, paramTalla, paramCant, paramStock) => {
    dispatch(addToCart(paramId, paramTalla, paramCant, paramStock));
    setClearInput(!clearInput);
  };

  const columns = [
    {
      header: "Codigo",
      accessorKey: "codigo",
    },

    {
      header: "",
      accessorKey: "tallas",
      cell: (info) => {
        const { tallas, _id } = info.row.original;
        const existencia = Object.values(tallas).reduce((accumulator, value) => {
          return accumulator + value;
        }, 0);

        if (!tallas) {
          return "";
        }

        if (existencia <= 0) {
          return <p>Agotado</p>;
        }

        return (
          <div className="flx wrap rgap05 maxw-250 gap05 pad-0">
            {Object.keys(tallas).map((key, inx) => {
              if (tallas[key] <= 0) {
                return "";
              }
              return (
                <>
                  <span
                    key={inx}
                    className="btn-tallas-facturacion"
                    onClick={() => addToCartHandler(_id, key, Number(1), tallas[key])}
                  >
                    {key}
                  </span>
                </>
              );
            })}
          </div>
        );
      },
      footer: "Tallas",
    },
  ];

  useEffect(() => {
    const reloadProducts = () => {
      fetch("https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/allproductschacao")
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("productos", JSON.stringify(data));
          setProductos(JSON.parse(localStorage.getItem("productos")));
        })
        .catch((error) => console.log(error));
    };
    reloadProducts();
  }, [reload]);

  const actualizar = () => {
    setReload(!reload);
  };

  const pagoCashea = () => {
    setTotalPago(0);
    Swal.fire({
      title: "Monto de la Inicial",
      input: "text",
      inputLabel: "Ingrese Monto Recibido de Inicial",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Este campo no debe estar vacio!";
        }
      },
    }).then((x) => {
      if (x.dismiss) {
        setMontoCashea(0);
        return;
      }
      setisCashea(true);
      setMontoCashea(Number(cart.subtotal) - Number(x.value));
      Swal.fire({
        title: "Numero de Orden Cashea",
        input: "text",
        inputLabel: "Ingrese Numero de Orden Generado por Cashea",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Este campo no debe estar vacio!";
          }
        },
      }).then((y) => {
        setOrdenCashea(y.value);
      });
    });
  };

  console.log("totalPago", totalPago, "montoCashea", montoCashea, "formapago:", txtformapago);

  const check = () => {
    Swal.fire({
      title:
        "Se Registrara una Venta por: " +
        "Bs." +
        Number(totalPago * cambio).toFixed(2) +
        " ----- " +
        "  (" +
        "$" +
        Number(totalPago).toFixed(2) +
        ")",
      text: "Forma de Pago: " + txtformapago,
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Abortar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setIsGuardar(true);
        dispatch(
          createOrder({
            ...cart,
          })
        );
        Swal.fire("Venta Registrada Exitosamente!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("La Venta No se Guardo", "Proceso Cancelado por El Usiuario", "info");
      }
    });
  };

  const placeOrderHandler = () => {
    if (cartItems.length <= 0) {
      Swal.fire({
        title: "No Hay Articulos!",
        text: "Registrar Venta",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      return;
    }
    if (!cart.clienteInfo.rif) {
      Swal.fire({
        title: "Debe Seleccione al Cliente",
        text: "Registrar Venta",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      return;
    }
    if (!condicion) {
      Swal.fire({
        title: "Seleccione Condicion de Venta",
        text: "Registrar Venta",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      return "";
    }
    if (!vendedor) {
      Swal.fire({
        title: "Falta el Vendedor",
        text: "Registrar Venta",
        imageUrl: logo,
        imageWidth: 30,
        imageHeight: 30,
        imageAlt: "logo",
      });
      return "";
    }
    if (condicion === "De Contado" && totalPago <= 0) {
      Swal.fire({
        title: "No Ha Registrado el Pago",
        text: "Registrar Forma de Pago",
        imageUrl: logo,
        imageWidth: 30,
        imageHeight: 30,
        imageAlt: "logo",
      });
      return "";
    }
    check();
  };

  return (
    <div className="flx column pad-0">
      {productos.length <= 0 ? (
        <span>No Hay Productos Descargados verifique...</span>
      ) : (
        <>
          <div className="flx jcenter gap pad-0">
            {showDeliveryModal && (
              <DeliveryForm
                client={cliente}
                onClose={() => setShowDeliveryModal(false)}
                sendDataToParent={handleDataFromChild}
              />
            )}
            {showPaymentModal && (
              <PaymentForm
                onClose={() => setShowPaymentModal(false)}
                sendPayToParent={handlePayFromChild}
                montoPagoBs={isCashea ? (cart.subtotal - montoCashea) * cambio : cart.subtotal * cambio}
                montoPagoUsd={isCashea ? cart.subtotal - montoCashea : cart.subtotal}
                montoCobrarCashea={montoCashea}
                orderCashea={ordenCashea}
              />
            )}

            <div className="fact-cuadro flx column bg-color b-radius border-1">
              <div className="flx border-bottom pad-0">
                <ToolTip text="Seleccionar Cliente">
                  <button className="btn-small" onClick={buscarCliente}>
                    <UserCircleIcon />
                    <p>cliente</p>
                  </button>
                </ToolTip>
                <ToolTip text="Agregar Observaciones">
                  <button
                    className={cartItems.length > 0 ? "btn-small activated-btn" : "btn-small disabled-btn"}
                    onClick={addMemoHandler}
                  >
                    <MemoIcon />
                    <p>Memo</p>
                  </button>
                </ToolTip>

                <ToolTip text="Registrar Pago">
                  <button
                    className={cartItems.length > 0 ? "btn-small activated-btn" : "btn-small disabled-btn"}
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <DollarIcon />
                    <p>Pago</p>
                  </button>
                </ToolTip>
                <ToolTip text="Entrega a Domicilio">
                  <button
                    className={cartItems.length > 0 ? "btn-small activated-btn" : "btn-small disabled-btn"}
                    onClick={() => setShowDeliveryModal(true)}
                  >
                    <BikeIcon />
                    <p>Delivery</p>
                  </button>
                </ToolTip>

                {isGuardar ? (
                  <Loader txt={"Guardando"} />
                ) : (
                  <ToolTip text="Grabar Venta">
                    <button
                      className={cartItems.length > 0 ? "btn-small activated-btn" : "btn-small disabled-btn"}
                      onClick={placeOrderHandler}
                    >
                      <SaveIcon />
                      <p>Guardar</p>
                    </button>
                  </ToolTip>
                )}
              </div>
              {cart?.clienteInfo?.rif ? (
                <div className="pos-rel">
                  <div className="flx column astart pad-1 m-05 bg-color maxw-400 minw-400 font-12 border-1 b-radius">
                    <span className="header-fecha">
                      <strong>Fecha:</strong> {dayjs(cart.fecha).format("DD/MM/YYYY")}
                    </span>
                    <div className="flx jsb pad-0 maxw-400 minw-400">
                      {" "}
                      <div className="fact-buscar-cliente">
                        {cart.clienteInfo.rif ? (
                          <span>
                            <strong>Cliente: </strong>
                            {cart.clienteInfo.nombre} - {cart.clienteInfo.rif} -{" " + cart.clienteInfo.telefono}
                            <br />
                          </span>
                        ) : (
                          ""
                        )}
                      </div>{" "}
                    </div>

                    {cart.clienteInfo.direccion && (
                      <span>
                        <strong>Direccion:</strong> {cart.clienteInfo.direccion} <br />
                      </span>
                    )}

                    <div className="flx pad-0 jsb minw-400 maxw-400">
                      {" "}
                      <div className="flx column astart pad-0">
                        <span>
                          <strong className="font-x">Condiciones:</strong>{" "}
                        </span>
                        <select value={condicion} onChange={(e) => setCondicion(e.target.value)}>
                          {selectCondicion.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flx column astart pad-0">
                        <span>
                          <strong className="font-x">Vendedor:</strong>{" "}
                        </span>
                        <select value={vendedor} onChange={(e) => setVendedor(e.target.value)}>
                          {vendedores?.map((x) => (
                            <option key={x._id} value={x._id}>
                              {x.nombre + " " + x.apellido}
                            </option>
                          ))}
                        </select>
                      </div>{" "}
                    </div>
                  </div>

                  <div className="flx jsb pad-0">
                    <div className="minw-360">
                      {productos ? <FacturacionTable data={productos} columns={columns} clearinput={clearInput} /> : ""}
                    </div>
                    <button className="btn-icon-container m-0 mr pad-05" onClick={() => actualizar()}>
                      <ReloadIcon />
                      <p className="font-x negrita">actualizar</p>
                    </button>
                  </div>

                  <div className="maxw-400 minw-400 pad-left b-radius">
                    <ul>
                      {cartItems.map((item, index) => (
                        <li className="flx jsb font-14 border-bottom" key={item.producto + index}>
                          <img src={item.imageurl} alt="foto" className="img-small"></img>
                          <div className="flx column astart pad-0">
                            <span className="azul-marino">{item.codigo}</span>
                            <span> {item.marca}</span>
                            <span>Talla: {item.talla}</span>
                          </div>
                          <div className="flx column">
                            <span> ${item.precio}</span>
                          </div>

                          <div className="flx column">
                            <select
                              value={item.qty}
                              onChange={(e) =>
                                dispatch(addToCart(item.producto, item.talla, Number(e.target.value), item.disponible))
                              }
                            >
                              {[...Array(item.disponible).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flx column">
                            <span className="font-x">Monto</span>
                            <span>${(item.precio * item.qty).toFixed(2)}</span>
                          </div>
                          <div>
                            <ToolTip text="Eliminar Producto">
                              <button
                                className="btn-tiny m-0 pad-0 no-bg"
                                onClick={() => removeFromCartHandler(item.producto, item.talla)}
                              >
                                <TrashIcon />
                              </button>
                            </ToolTip>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {cartItems.length > 0 ? (
                      <span className="minw-80 font-1">{cart.cartItems.reduce((a, c) => a + c.qty, 0)} articulos</span>
                    ) : (
                      <Loader txt={"Ingresa Codigo del Producto y Selecciona y una Talla"} />
                    )}
                  </div>
                  {/*RESUMEN*/}
                  {cartItems.length > 0 ? (
                    <div className="pos-rel">
                      <div className="font-14 pad-right line-h">
                        <div className="flx jend pad-0">
                          <span className="minw-80 txt-align-r">Sub-Total:</span>
                          <span className="minw-80 alinear-r">${cart.totalItems.toFixed(2)}</span>{" "}
                        </div>
                        <div className="flx jend pad-0">
                          <span className="minw-80 txt-align-r">Delivery:</span>
                          <select value={flete} onChange={(e) => setFlete(Number(e.target.value))}>
                            {selectList.map((x) => (
                              <option key={x} value={x}>
                                ${Number(x).toFixed(2)}
                              </option>
                            ))}
                          </select>{" "}
                        </div>
                        <div className="flx jend pad-0">
                          <span className="minw-80">Descuento:</span>
                          <select value={descuento} onChange={(e) => setDescuento(Number(e.target.value))}>
                            {selectList.map((x) => (
                              <option key={x} value={x}>
                                ${Number(x).toFixed(2)}
                              </option>
                            ))}
                          </select>{" "}
                        </div>
                        <div className="flx jend pad-0">
                          <button className="btn-cashea" onClick={() => pagoCashea()}>
                            CASHEA
                            {isCashea ? " $" + Number(montoCashea).toFixed(2) : ""}
                          </button>
                          <span className="minw-80 txt-align-r">
                            <strong>Total a Pagar:</strong>
                          </span>
                          <span className="minw-80 txt-align-r">
                            <strong>${cart.subtotal.toFixed(2)}</strong>
                          </span>
                        </div>
                        <div className="flx jend pad-0 azul-brand">
                          <span className="minw-80 txt-align-r">
                            <strong>
                              (Bs.
                              {Number(cart.subtotal * cambio).toFixed(2)})
                            </strong>
                          </span>
                        </div>
                      </div>

                      {totalPago > 0 ? (
                        <div className="pos-abs font-1 top mtop-1 ml border-1 b-radius">
                          <div className="flx column astart">
                            <span>Pago Registrado</span>
                            {cart.pago.efectivousd > 0 ||
                            cart.pago.efectivoeuros > 0 ||
                            cart.pago.zelle.montozelle > 0 ? (
                              <span>
                                Divisas:
                                <strong className={totalPago != cart.subtotal ? "monto-nocuadra" : "monto-cuadra"}>
                                  ${Number(totalPago).toFixed(2)}
                                </strong>
                              </span>
                            ) : (
                              <span>
                                <strong className={totalPago != cart.subtotal ? "monto-nocuadra" : "monto-cuadra"}>
                                  Bs {(Number(totalPago).toFixed(2) * Number(cambio)).toFixed(2)} ($
                                  {Number(totalPago).toFixed(2)})
                                </strong>
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <Loader txt={"Selecciona el Cliente"} />
              )}
            </div>
          </div>
          {cart?.memo ? (
            <div className="flx abase-top pad-0 minw-400">
              <label className="font-14 negrita">Memo: </label>
              <span className="font-1 maxw-150">{cart.memo}</span>
            </div>
          ) : (
            ""
          )}
        </>
      )}

      {isDelivery && (
        <div className="flx astart column font-1 border-1 b-radius pad-1 mtop-1">
          <div className="flx column acenter minw-400 font-1 azul-brand">
            {" "}
            <h3 className="font-14 negrita azul-marino">Informacion Delivery</h3>
            <p>Origen: {cart.deliveryInfo.origenVenta}</p>{" "}
          </div>

          <div>
            {" "}
            <span>
              <strong>Entregar A:</strong>{" "}
              {cart.deliveryInfo.destinatario +
                " C.I. " +
                cart.deliveryInfo.cedula +
                " - " +
                cart.deliveryInfo.telefono}
            </span>
          </div>

          <span>
            <strong>Direccion:</strong> {cart.deliveryInfo.direccionEnvio}
          </span>
          <span>
            <strong>Motorizado: </strong>
            {cart.deliveryInfo.motorizado}
          </span>
          <span>
            <strong>Observacion: </strong>
            {cart.deliveryInfo.memoDelivery}
          </span>
        </div>
      )}
    </div>
  );
}

export default Facturacion;
