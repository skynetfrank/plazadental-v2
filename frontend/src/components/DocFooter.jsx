export default function DocFooter({ monto, descuento, delivery, total }) {
  return (
    <div className="minw-120 mr border-1 pad-1 b-radius bg-color">
      <div className="pad-right font-1">
        <div className="flx jsb pad-0 pad-right">
          <span>Monto</span>
          <span>{Number(monto).toFixed(2) || 0}</span>
        </div>
        <div className="flx jsb pad-0 pad-right">
          <span>Descuento</span>
          <span>{Number(descuento).toFixed(2) || 0}</span>
        </div>
        <div className="flx jsb pad-0 pad-right">
          <span>Delivery</span>
          <span>{Number(delivery).toFixed(2) || 0}</span>
        </div>
        <div className="flx jsb pad-0 pad-right">
          <span>Total</span>
          <span>{Number(total).toFixed(2) || 0}</span>
        </div>
      </div>
    </div>
  );
}
