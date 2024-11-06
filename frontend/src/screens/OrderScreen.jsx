import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { detailsOrder } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import dayjs from "dayjs";
import PrintIcon from "../icons/PrintIcon";
import DocFooter from "../components/DocFooter";
import BrandHeader from "../components/BrandHeader";

export default function OrderScreen() {
  const params = useParams();
  const { id: orderId } = params;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!order || (order && order._id !== orderId)) {
      dispatch(detailsOrder(orderId));
    }
  }, [dispatch, order, orderId]);

  const imprimir = () => {
    window.print();
  };
  console.log("order", order);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : (
    <div className="flx column jcenter">
      {" "}
      <div className="flx column jcenter pad-0 maxw-400">
        <div className="flx pad-0">
          <button className="btn-icon-container" onClick={imprimir}>
            <PrintIcon className="print-icon" />
          </button>
          <BrandHeader />
        </div>

        <div className="flx column astart pad-1 m-05 bg-color maxw-360 minw-360 font-12 border-1 b-radius">
          <span>
            <strong>Fecha:</strong> {dayjs(order?.fecha).format("DD/MM/YYYY")} <br />
          </span>
          <span>
            <strong>Nombre:</strong> {order?.clienteInfo.nombre + " " + order?.clienteInfo.rif}
            <br />
          </span>

          <span>
            <strong>Direccion:</strong> {order?.clienteInfo.direccion} <br />
          </span>
          <span>
            <strong>Condiciones:</strong>
            {order?.condicion}
          </span>
          <span>
            <strong>Registrado por: </strong> {order?.user?.nombre + " " + order?.user?.apellido} <br />
          </span>
          <span>
            <strong>Vendedor: </strong> {order?.vendedor?.nombre + " " + order?.vendedor?.apellido} <br />
          </span>
        </div>
        <div className="maxw-360 minw-360 pad-1 m-05 b-radius border-1 bg-color">
          <ul>
            {order?.orderItems.map((item, index) => (
              <li className="flx jsb font-14 pad-0" key={item.producto + index}>
                <img src={item.imageurl} alt="foto" className="img-small"></img>
                <div className="flx column">
                  <Link to={`/product/${item.producto}`}>{item.codigo}</Link>
                  <span className="modelo"> {item.marca}</span>
                  <span className="talla">Talla: {item.talla}</span>
                </div>
                <div className="flx column">
                  <span> Precio</span>
                  <span> ${item.precio}</span>
                </div>

                <div className="flx column">
                  <span>cant.</span>
                  <span>{item.qty}</span>
                </div>

                <div className="flx column">
                  <span>Monto</span>
                  <span>${(item.precio * item.qty).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="align-self-r pos-rel maxw-150">
          {" "}
          <DocFooter
            monto={order?.totalItems}
            descuento={order?.descuento}
            delivery={order?.delivery}
            total={order?.subtotal}
          />
        </div>

        {order?.deliveryInfo?.origenVenta ? (
          <div className="flx column astart font-1 border-1 mtop-1 b-radius minw-360">
            <label className="font-14">
              INFORMACION DEL DELIVERY ({"Empresa: " + order.deliveryInfo.empresaEnvio})
            </label>
            <div className="minw-360">
              <p className="centrado pad-1">ENTREGAR A</p>
            </div>

            <h2 className="font-14">
              {order.deliveryInfo.destinatario +
                " - " +
                order.deliveryInfo.cedula +
                " - " +
                order.deliveryInfo.telefono}
            </h2>
            <h2 className="font-14">{order.deliveryInfo.direccionEnvio.toUpperCase()}</h2>
            <h2 className="font-14">Entregado Por:{order.deliveryInfo.motorizado}</h2>

            <p className="font-14">Nota:{order.deliveryInfo.memoDelivery}</p>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="order-pago flx column astart mtop-2 font-1 minw-400">
        <span>{order?.memo ? "Memo: " + order?.memo : ""}</span>
        <span>{order?.pago.efectivobs > 0 ? "Efectivo Bs.: " + order?.pago.efectivobs : ""}</span>
        <span>{order?.pago.efectivousd > 0 ? "Divisas US$: $" + order?.pago.efectivousd : ""}</span>
        <span>{order?.pago.efectivoeuros > 0 ? "Divisas Euro: " + order?.pago.efectivoeuros : ""}</span>
        <span>
          {order?.pago.punto.montopunto > 0
            ? "Punto Venta: " + order?.pago.punto.bancodestinopunto + " Bs. " + order?.pago.punto.montopunto.toFixed(2)
            : ""}
        </span>
        <span>
          {order?.pago.punto.montopunto2 > 0
            ? "Punto Venta: " +
              order?.pago.punto.bancodestinopunto2 +
              " Bs. " +
              order?.pago.punto.montopunto2.toFixed(2)
            : ""}
        </span>
        <span>
          {order?.pago.punto.montopunto3 > 0
            ? "Punto Venta: " +
              order?.pago.punto.bancodestinopunto3 +
              " Bs. " +
              order?.pago.punto.montopunto3.toFixed(2)
            : ""}
        </span>
        <span>
          {order?.pago.pagomovil.montopagomovil > 0
            ? "Pagomovil Depositado en Banco " +
              order?.pago.pagomovil.bancodestinopagomovil +
              " Bs. " +
              order?.pago.pagomovil.montopagomovil.toFixed(2)
            : ""}
        </span>
        <span>
          {order?.pago.zelle.montozelle > 0
            ? "Zelle: titular " +
              order?.pago.zelle.zelletitular +
              " $" +
              Number(order?.pago.zelle.montozelle).toFixed(2)
            : ""}
        </span>
        <span>
          {order?.pago.cashea.monto > 0
            ? "Cashea: Por Cobrar " +
              " $" +
              Number(order?.pago.cashea.monto).toFixed(2) +
              " #Orden: " +
              order?.pago.cashea.orden
            : ""}
        </span>
      </div>
    </div>
  );
}
