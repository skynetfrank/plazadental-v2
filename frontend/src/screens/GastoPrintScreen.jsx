import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";

import dayjs from "dayjs";
import { detailsGasto } from "../actions/gastoActions";
import PrintIcon from "../icons/PrintIcon";
import BrandHeader from "../components/BrandHeader";
import FooterFirma from "../components/FooterFirma";

export default function GastoPrintScreen() {
  const params = useParams();
  const { id: gastoId } = params;
  const [isprintimg, setIsprintimg] = useState(false);

  const gastoDetails = useSelector((state) => state.gastoDetails);
  const { gasto, loading, error } = gastoDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsGasto(gastoId));
  }, [dispatch, gastoId]);

  const imprimir = () => {
    window.print();
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : (
    <div>
      <div>
        <BrandHeader />
        <div className="flx column">
          <h4>RECIBO DE GASTO</h4>
          <p className="font-1">Registrado Por:{gasto.registradopor}</p>
          <p className="font-1">{dayjs(gasto.fecha).format("DD/MM/YYYY")}</p>
          <button className="btn-icon-container m-1" onClick={imprimir}>
            <PrintIcon />
          </button>

          <div className="flx column astart border-1 pad-2 b-radius w-full mt-100">
            <p className="w-full centrado m-1 negrita font-20">US$: {gasto.montousd.toFixed(2)}</p>

            <p>
              <strong>Nombre: </strong>
              {gasto.beneficiario}
            </p>

            <p>
              <strong>Descripcion: </strong>
              {gasto.descripcion}
            </p>
            <p>
              <strong>Categoria: </strong>
              {gasto.categoria}
            </p>
            <p>
              <strong>Cambio del Dia: </strong>
              {gasto.cambio}{" "}
            </p>
            <p>
              <strong>Monto Bs.: </strong>
              {gasto.montobs.toFixed(2)}
            </p>
            <p>
              <strong>Referencia: </strong>
              {gasto.referencia}
            </p>
            <p>
              <strong>Forma de pago: </strong>
              {gasto.formadepago}
            </p>
          </div>
          <div className="m-2">
            <FooterFirma />
          </div>

          {gasto.imageurl || gasto.imageurl2 ? (
            <>
              <div className="flx gap m-1">
                <label>Imprimir Imagenes</label>
                <input
                  type="checkbox"
                  value={isprintimg}
                  checked={isprintimg}
                  onChange={(e) => setIsprintimg(e.target.checked)}
                ></input>
              </div>
              <div className="flx gap3">
                <img
                  className={isprintimg ? "img-print" : "ocultar"}
                  src={gasto.imageurl ? gasto.imageurl : ""}
                  alt="Imagen"
                />
                <img
                  className={isprintimg ? "img-print" : "ocultar"}
                  src={gasto.imageurl2 ? gasto.imageurl2 : ""}
                  alt=" Sin Imagen"
                />
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
