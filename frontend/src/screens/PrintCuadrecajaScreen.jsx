import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateCuadreCaja } from "../actions/cuadrecajaActions";
import { CUADRECAJA_UPDATE_RESET } from "../constants/cuadrecajaConstants";

function PrintCuadrecajaScreen(props) {
  const params = useParams();
  const { id: fechaId } = params;
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [fecha] = useState(fechaId);

  //efectivo state

  const [dolares, setDolares] = useState([]);
  const [bolivares, setBolivares] = useState([]);
  const [euros, setEuros] = useState([]);

  const [puntoplaza, setPuntoplaza] = useState({});
  const [puntovzla, setPuntovzla] = useState({});
  const [puntobanesco, setPuntobanesco] = useState({});
  const [pagomobil, setPagomobil] = useState({});
  const [zelle, setZelle] = useState({});

  const [diferencias, setDiferencias] = useState([]);

  const [totaldolares, setTotaldolares] = useState(0);
  const [totaleuros, setTotaleuros] = useState(0);
  const [totalbolivares, setTotalbolivares] = useState(0);
  const [totalpuntos, setTotalpuntos] = useState(0);
  const [totalpagomobil, setTotalpagomobil] = useState(0);
  const [totalzelle, setTotalzelle] = useState(0);
  const [totaldiferencias, setTotaldiferencias] = useState(0);
  const [seletedGroup, setSelectedGroup] = useState("");

  const [ventaPuntos, setVentaPuntos] = useState(0);
  const [ventaPagomobil, setVentaPagomobil] = useState(0);
  const [ventaZelle, setVentaZelle] = useState(0);
  const [ventaDolares, setVentaDolares] = useState(0);
  const [ventaBolivares, setVentaBolivares] = useState(0);
  const [ventaEuros, setVentaEuros] = useState(0);
  const [ventaPlaza, setVentaPlaza] = useState(0);
  const [ventaVzla, setVentaVzla] = useState(0);
  const [ventaBanesco, setVentaBanesco] = useState(0);

  const cuadrecajaUpdate = useSelector((state) => state.cuadrecajaUpdate);
  const { cuadre, pagos } = cuadrecajaUpdate;

  useEffect(() => {
    if (!cuadre || cuadre.fecha !== fechaId) {
      dispatch({ type: CUADRECAJA_UPDATE_RESET });
      dispatch(
        updateCuadreCaja({
          fecha: fechaId,
          user: userInfo.nombre + " " + userInfo.apellido,
        })
      );
    } else {
      setDolares(cuadre.dolares || []);
      setBolivares(cuadre.bolivares || []);
      setEuros(cuadre.euros || []);
      setPuntoplaza(cuadre.puntoplaza || {});
      setPuntovzla(cuadre.puntovzla || {});
      setPuntobanesco(cuadre.puntobanesco || {});
      setPagomobil(cuadre.pagomobil || {});
      setZelle(cuadre.zelle || {});
      setVentaDolares(
        pagos.reduce((sum, x) => x.pago.efectivousd + sum, 0) || 0
      );
      setVentaBolivares(
        pagos.reduce((sum, x) => x.pago.efectivobs + sum, 0) || 0
      );
      setVentaEuros(
        pagos.reduce((sum, x) => x.pago.efectivoeuros + sum, 0) || 0
      );
      setVentaPuntos(
        Number(
          pagos
            ?.filter((f) => f.pago.punto.bancodestinopunto === "Plaza")
            .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Plaza")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Plaza")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto === "Venezuela")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Venezuela")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Venezuela")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto === "Banesco")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Banesco")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Banesco")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0)
        ).toFixed(2)
      );

      setVentaPlaza(
        Number(
          pagos
            ?.filter((f) => f.pago.punto.bancodestinopunto === "Plaza")
            .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Plaza")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Plaza")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0)
        ).toFixed(2)
      );

      setVentaVzla(
        Number(
          pagos
            ?.filter((f) => f.pago.punto.bancodestinopunto === "Venezuela")
            .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Venezuela")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Venezuela")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0)
        ).toFixed(2)
      );

      setVentaBanesco(
        Number(
          pagos
            ?.filter((f) => f.pago.punto.bancodestinopunto === "Banesco")
            .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Banesco")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Banesco")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0)
        ).toFixed(2)
      );

      setVentaPuntos(
        Number(
          pagos
            ?.filter((f) => f.pago.punto.bancodestinopunto === "Plaza")
            .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Plaza")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Plaza")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto === "Venezuela")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Venezuela")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Venezuela")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto === "Banesco")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto2 === "Banesco")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
            pagos
              ?.filter((f) => f.pago.punto.bancodestinopunto3 === "Banesco")
              .reduce((sum, x) => x.pago.punto.montopunto + sum, 0)
        ).toFixed(2)
      );

      setVentaPagomobil(
        pagos.reduce((sum, x) => x.pago.pagomovil.montopagomovil + sum, 0) || 0
      );

      setVentaZelle(
        pagos.reduce((sum, x) => x.pago.zelle.montozelle + sum, 0) || 0
      );
      setDiferencias(cuadre.diferencias || []);
    }
  }, [cuadre, dispatch, fechaId, pagos, userInfo]);

  useEffect(() => {
    const tDolares = dolares.reduce(
      (sum, x) => x.cantidad * Number(x.denominacion) + sum,
      0
    );
    const teuros = euros.reduce(
      (sum, x) => x.cantidad * Number(x.denominacion) + sum,
      0
    );
    const tBolivares = bolivares.reduce(
      (sum, x) => x.cantidad * Number(x.denominacion) + sum,
      0
    );
    const tPuntos =
      (puntoplaza.monto || 0) +
      (puntovzla.monto || 0) +
      (puntobanesco.monto || 0);
    const tPagomobil = pagomobil.monto || 0;
    const tZelle = zelle.monto || 0;
    const tDiferencias = diferencias.reduce((sum, x) => x.monto + sum, 0);
    setTotalbolivares(tBolivares);
    setTotaldolares(tDolares);
    setTotaleuros(teuros);
    setTotalpuntos(Number(tPuntos).toFixed(2));
    setTotalpagomobil(tPagomobil);
    setTotalzelle(tZelle);
    setTotaldiferencias(tDiferencias);
  }, [
    bolivares,
    diferencias,
    dolares,
    euros,
    pagomobil,
    puntobanesco,
    puntoplaza,
    puntovzla,
    zelle,
  ]);

  const parseFecha = (fecha) => {
    const dia = fecha.toString().substr(8, 2);
    const mes = fecha.toString().substr(5, 2);
    const ano = fecha.toString().substr(0, 4);
    const xfecha = dia + "-" + mes + "-" + ano;
    return xfecha;
  };

  return (
    <div className="print-cuadre-caja-container">
      <div className="cuadre-print-header">
        {" "}
        <h2>Inversiones Paul 2428, C.A.</h2>
        <h2>Tienda Chacao</h2>
        <h3>Cuadre de Caja del {parseFecha(fecha)}</h3>
      </div>

      <div className="print-grupo-container">
        <div className="print-total-grupo">
          <div className="print-cash-container">
            {totaldolares > 0 ? (
              <h3>
                Efectivo Dolares................. $
                {Number(
                  dolares?.reduce(
                    (sum, x) => x.cantidad * x.denominacion + sum,
                    0
                  )
                ).toFixed(2)}
              </h3>
            ) : (
              ""
            )}

            {dolares
              ? dolares
                  .sort((a, b) => a.denominacion - b.denominacion)
                  .map((bill, inx) => {
                    return (
                      <div key={inx}>
                        <span>{bill.cantidad}</span>
                        <span>{"Billetes de " + bill.denominacion + "$"}</span>
                        <span className="monto">
                          $
                          {(
                            Number(bill.denominacion) * Number(bill.cantidad)
                          ).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
              : ""}

            <div className="show-group-items print">
              {diferencias
                ? diferencias.map((dif, inx) => {
                    if (dif.grupo !== "DOLARES") {
                      return "";
                    }
                    return (
                      <div className="show-dif" key={inx}>
                        <div className="dif-monto-tipo">
                          <span>
                            {dif.tipo +
                              " " +
                              Number(dif.monto).toFixed(2) +
                              " " +
                              dif.concepto}
                          </span>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>

            {totalbolivares > 0 ? (
              <h3>
                Efectivo Bolivares............... Bs.
                {Number(
                  bolivares?.reduce(
                    (sum, x) => x.cantidad * x.denominacion + sum,
                    0
                  )
                ).toFixed(2)}
              </h3>
            ) : (
              ""
            )}
            {totaleuros > 0 ? (
              <h3>
                Efectivo Euros...................... Eu
                {Number(
                  euros?.reduce(
                    (sum, x) => x.cantidad * x.denominacion + sum,
                    0
                  )
                ).toFixed(2)}
              </h3>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="print-grupo-container">
        <div className="print-total-grupo">
          <h3>Puntos de Venta..........Bs.{totalpuntos}</h3>
        </div>
        <div>
          {ventaPlaza > 0 ? (
            <div className="transacciones-container print">
              <div>
                <p>
                  Punto Plaza: Total Bs.
                  {(
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto === "Plaza"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto2 === "Plaza"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto3 === "Plaza"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="show-group-items print">
                {pagos
                  ? pagos.map((x, inx) => {
                      if (x.pago.punto.bancodestinopunto !== "Plaza") {
                        return "";
                      }
                      return (
                        <div className="show-puntos" key={inx}>
                          <span>Referencia:</span>
                          <span>{x.pago.punto.refpunto}</span>
                          <span>Bs.</span>
                          <span className="monto">
                            {Number(
                              x.pago.punto.montopunto +
                                x.pago.punto.montopunto2 +
                                x.pago.punto.montopunto3
                            ).toFixed(2)}
                          </span>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          ) : (
            ""
          )}

          <div>
            {diferencias
              ? diferencias.map((dif, inx) => {
                  if (dif.grupo !== "PUNTO-PLAZA") {
                    return "";
                  }
                  return (
                    <div className="dif-detalle-print" key={inx}>
                      <span>
                        {dif.grupo +
                          " " +
                          "Diferencia : " +
                          " " +
                          dif.tipo +
                          " Bs." +
                          Number(dif.monto).toFixed(2)}
                      </span>
                      <span>{dif.concepto}</span>
                    </div>
                  );
                })
              : ""}
          </div>

          {ventaVzla > 0 ? (
            <div className="transacciones-container print">
              <div>
                <p>
                  Venezuela: Total Bs.{" "}
                  {(
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto === "Venezuela"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto2 === "Venezuela"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto3 === "Venezuela"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="show-group-items print">
                {pagos
                  ? pagos.map((x, inx) => {
                      if (x.pago.punto.bancodestinopunto !== "Venezuela") {
                        return "";
                      }
                      return (
                        <div className="show-puntos" key={inx}>
                          <span>Referencia: {x.pago.punto.refpunto}</span>
                          <span className="monto">
                            Bs.{" "}
                            {Number(
                              x.pago.punto.montopunto +
                                x.pago.punto.montopunto2 +
                                x.pago.punto.montopunto3
                            ).toFixed(2)}
                          </span>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          ) : (
            ""
          )}
          <div>
            {diferencias
              ? diferencias.map((dif, inx) => {
                  if (dif.grupo !== "PUNTO-VZLA") {
                    return "";
                  }
                  return (
                    <div className="dif-detalle-print" key={inx}>
                      <span>
                        {dif.grupo +
                          " " +
                          "Diferencia : " +
                          " " +
                          dif.tipo +
                          " Bs." +
                          Number(dif.monto).toFixed(2)}
                      </span>
                      <span>{dif.concepto}</span>
                    </div>
                  );
                })
              : ""}
          </div>

          {ventaBanesco > 0 ? (
            <div className="transacciones-container print">
              <div className="grupo-imagen">
                <p>
                  Banesco: Total Bs.
                  {(
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto === "Banesco"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto2 === "Banesco"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0) +
                    pagos
                      ?.filter(
                        (f) => f.pago.punto.bancodestinopunto3 === "Banesco"
                      )
                      .reduce((sum, x) => x.pago.punto.montopunto + sum, 0)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="show-group-items print">
                {pagos
                  ? pagos.map((x, inx) => {
                      if (x.pago.punto.bancodestinopunto !== "Banesco") {
                        return "";
                      }
                      return (
                        <div className="show-puntos" key={inx}>
                          <span>Referencia: {x.pago.punto.refpunto}</span>
                          <span className="monto">
                            Bs.{" "}
                            {Number(
                              x.pago.punto.montopunto +
                                x.pago.punto.montopunto2 +
                                x.pago.punto.montopunto3
                            ).toFixed(2)}
                          </span>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          {diferencias
            ? diferencias.map((dif, inx) => {
                if (dif.grupo !== "PUNTO-BANESCO") {
                  return "";
                }
                return (
                  <div className="dif-detalle-print" key={inx}>
                    <span>
                      {dif.grupo +
                        " " +
                        "Diferencia : " +
                        " " +
                        dif.tipo +
                        " Bs." +
                        Number(dif.monto).toFixed(2)}
                    </span>
                    <span>{dif.concepto}</span>
                  </div>
                );
              })
            : ""}
        </div>
      </div>

      <div className="print-grupo-container">
        <div className="print-total-grupo">
          <h3>
            Pagomovil.........................Bs.
            {Number(totalpagomobil).toFixed(2)}
          </h3>
        </div>
        <div>
          {ventaPagomobil > 0 ? (
            <div className="transacciones-container print">
              <div className="show-group-items">
                {pagos
                  ? pagos.map((x, inx) => {
                      if (x.pago.pagomovil.montopagomovil === 0) {
                        return "";
                      }
                      return (
                        <div className="show-puntos" key={inx}>
                          <span>
                            Referencia: {x.pago.pagomovil.telefonopagomovil}
                          </span>
                          <span className="monto">
                            Bs.{" "}
                            {Number(x.pago.pagomovil.montopagomovil).toFixed(2)}
                          </span>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {ventaZelle > 0 ? (
        <div className="print-grupo-container">
          <div className="print-total-grupo">
            <h3>
              Zelle.................................$
              {Number(totalzelle).toFixed(2)}
            </h3>
          </div>
          <div>
            {" "}
            <div className="transacciones-container print">
              {" "}
              <div className="show-group-items">
                {pagos
                  ? pagos.map((x, inx) => {
                      if (x.pago.zelle.montozelle === 0) {
                        return "";
                      }
                      return (
                        <div className="show-puntos" key={inx}>
                          <span>Titula: {x.pago.zelle.zelletitular}</span>
                          <span className="monto">
                            Bs. {Number(x.pago.zelle.montozelle).toFixed(2)}
                          </span>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="print-grupo-container">
        <div className="print-total-grupo">
          <h3>
            Diferencias.......................Bs.
            {Number(totaldiferencias).toFixed(2)}
          </h3>
        </div>
        <div>
          {" "}
          <div className="transacciones-container print">
            <div className="show-group-items print">
              {diferencias
                ? diferencias.map((dif, inx) => {
                    return (
                      <div className="show-dif" key={inx}>
                        <div className="dif-monto-tipo">
                          <span>
                            {dif.tipo +
                              " " +
                              Number(dif.monto).toFixed(2) +
                              " " +
                              dif.concepto}
                          </span>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintCuadrecajaScreen;
