import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { detailsAjuste } from "../actions/ajusteActions";
import LoadingBox from "../components/LoadingBox";
import dayjs from "dayjs";
import PrintIcon from "../icons/PrintIcon";
import BrandHeader from "../components/BrandHeader";

export default function AjusteScreen(props) {
  const params = useParams();
  const { id: ajusteId } = params;

  const ajusteDetails = useSelector((state) => state.ajusteDetails);
  const { ajuste, loading, error } = ajusteDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!ajuste || (ajuste && ajuste._id !== ajusteId)) {
      dispatch(detailsAjuste(ajusteId));
    }
  }, [ajuste, ajusteId, dispatch]);

  const imprimir = () => {
    window.print();
  };
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : (
    <div className="flx column jcenter pad-0">
      <div className="flx pad-0">
        <button className="btn-icon-container" onClick={imprimir}>
          <PrintIcon className="print-icon" />
        </button>
        <BrandHeader subtitulo={"Ajuste al Inventario"} />
      </div>

      <div className="flx column astart font-14 border-1 b-radius">
        <p>Fecha Emision: {dayjs(ajuste.fecha).format("DD/MM/YYYY")}</p>
        <p>Registrado por: {ajuste.user.nombre + " " + ajuste.user.apellido}</p>
        <p className="font-x negrita">ID Numero: {ajuste._id}</p>
      </div>

      {ajuste.orderItems.length > 0 ? (
        <div>
          <div className="flx pad-05 border-1 b-radius mtop-1 font-14">
            <p className="minw-80">Producto</p>
            <p className="minw-120">Tipo-Ajuste</p>
            <p className="minw-120">Causa de Ajuste </p>
            <p className="minw-30 mr">Talla</p>
            <p className="minw-30 mr">Cant.</p>
            <p className="minw-30 mr">Precio</p>
            <p className="minw-30 mr">Monto</p>
          </div>

          {ajuste.orderItems.map((item, inx) => {
            return (
              <div className="flx jsb font-x pad-05" key={inx}>
                <span className="minw-60 pad-right">{item.codigo}</span>
                <span className="minw-120 pad-right">{item.tipoAjuste}</span>
                <span className="minw-120 pad-right">{item.causa}</span>
                <span className="minw-30 mr">{item.talla}</span>
                <span className="minw-30 mr"> {item.cantidad}</span>
                <span className="minw-30 ml">{item.precio}</span>
                <span className="minw-60 ml">{(item?.precio * item?.cantidad).toFixed(2)}</span>
                <span>{item.memo}</span>
              </div>
            );
          })}
          <div className="flx jsb border-1 b-radius">
            <p>Total Unidades: {ajuste.totalUnidades}</p>
            <p>Total General: ${ajuste.totalItems.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
