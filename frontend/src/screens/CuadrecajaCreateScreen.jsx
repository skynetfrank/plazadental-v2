import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { updateCuadreCaja } from "../actions/cuadrecajaActions";
import { CUADRECAJA_UPDATE_RESET } from "../constants/cuadrecajaConstants";
import AddCircleIcon from "../icons/AddCircleIcon";
import PrintIcon from "../icons/PrintIcon";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon";

function CuadrecajaCreateScreen(props) {
  const navigate = useNavigate();
  const params = useParams();
  const { id: fechaId } = params;
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [fecha] = useState(fechaId);

  //efectivo state
  const [denominacion, setDenominacion] = useState(0);
  const [denominacion2, setDenominacion2] = useState(0);
  const [denominacion3, setDenominacion3] = useState(0);
  const [qty, setQty] = useState(0);
  const [qty2, setQty2] = useState(0);
  const [qty3, setQty3] = useState(0);

  const [tipo, setTipo] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto6, setMonto6] = useState(0);

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
  const [ventaPlaza, setVentaPlaza] = useState(0);
  const [ventaVzla, setVentaVzla] = useState(0);
  const [ventaBanesco, setVentaBanesco] = useState(0);
  const [ventaPagomobil, setVentaPagomobil] = useState(0);
  const [ventaZelle, setVentaZelle] = useState(0);
  const [ventaDolares, setVentaDolares] = useState(0);
  const [ventaBolivares, setVentaBolivares] = useState(0);
  const [ventaEuros, setVentaEuros] = useState(0);

  const cuadrecajaUpdate = useSelector((state) => state.cuadrecajaUpdate);
  const { cuadre, pagos } = cuadrecajaUpdate;

  const cantidadList = [...Array(100).keys()];

  const listaBilletes = ["", 1, 5, 10, 20, 50, 100, 200];

  const listaTipos = ["", "FALTANTE", "SOBRANTE"];

  const gruposList = [
    "",
    "DOLARES",
    "BOLIVARES",
    "EUROS",
    "PUNTO-PLAZA",
    "PUNTO-VZLA",
    "PUNTO-BANESCO",
    "PAGO-MOVIL",
    "ZELLE",
  ];

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

  const updateHandler = async () => {
    dispatch(
      updateCuadreCaja({
        fecha: fechaId,
        user: userInfo.nombre + " " + userInfo.apellido,
        dolares,
        euros,
        bolivares,
        puntoplaza,
        puntovzla,
        puntobanesco,
        pagomobil,
        zelle,
        diferencias,
      })
    );
    dispatch({ type: CUADRECAJA_UPDATE_RESET });
  };

  const parseFecha = (fecha) => {
    const dia = fecha.toString().substr(8, 2);
    const mes = fecha.toString().substr(5, 2);
    const ano = fecha.toString().substr(0, 4);
    const xfecha = dia + "-" + mes + "-" + ano;
    return xfecha;
  };

  const addEfectivo = (billete, denom, cant) => {
    if (!denom) {
      Swal.fire({
        title: "Falta Denominacion del Billete!",
        text: "Registrar Billetes",
      });
      return;
    }
    if (cant === 0) {
      Swal.fire({
        title: "Falta la Cantidad de Billetes!",
        text: "Registrar Billetes",
      });
      return;
    }

    if (billete === "DOLARES") {
      const existDenominacion = dolares.find((x) => {
        if (x.denominacion === denom) {
          return x.denominacion;
        } else {
          return "";
        }
      });

      if (existDenominacion) {
        Swal.fire({
          title: "Denominacion Existe!",
          text: "Registrar Denominacion",
        });
        return;
      }

      setDolares((prev) => {
        return [
          ...prev,
          {
            denominacion: denom,
            cantidad: cant,
          },
        ];
      });
    }

    if (billete === "BOLIVARES") {
      const existDenominacion = bolivares.find((x) => {
        if (x.denominacion === denom) {
          return x.denominacion;
        } else {
          return "";
        }
      });

      if (existDenominacion) {
        Swal.fire({
          title: "Denominacion Existe!",
          text: "Registrar Denominacion",
        });
        return;
      }

      setBolivares((prev) => {
        return [
          ...prev,
          {
            denominacion: denom,
            cantidad: cant,
          },
        ];
      });
    }

    if (billete === "EUROS") {
      const existDenominacion = euros.find((x) => {
        if (x.denominacion === denom) {
          return x.denominacion;
        } else {
          return "";
        }
      });

      if (existDenominacion) {
        Swal.fire({
          title: "Denominacion Existe!",
          text: "Registrar Denominacion",
        });
        return;
      }

      setEuros((prev) => {
        return [
          ...prev,
          {
            denominacion: denom,
            cantidad: cant,
          },
        ];
      });
    }

    setDenominacion(0);
    setQty(0);

    setDenominacion2(0);
    setQty2(0);

    setDenominacion3(0);
    setQty3(0);
  };

  const addPunto = async () => {
    const ref = parseFecha(new Date(fecha).toISOString());
    const { value: bank } = await Swal.fire({
      title: "Cierre de Caja",
      input: "select",
      inputOptions: {
        PLAZA: "Punto Banco Plaza",
        VENEZUELA: "Punto Banco Venezuela",
        BANESCO: "Punto Banco Banesco",
        PAGOMOVIL: "Pagos por Pagomovil",
        ZELLE: "Pagos por Zelle",
      },
      inputPlaceholder: "Seleccione Forma de Pago",
      showCancelButton: true,
    });

    if (!bank) {
      return;
    }

    const { value: amount } = await Swal.fire({
      title: "Ingrese el Monto",
      input: "text",
      inputLabel: "TOTAL " + bank,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Este campo no debe estar vacio!";
        }
      },
    });

    if (!amount) {
      Swal.fire({
        title: "Falta el Monto del Cierre!",
        text: "Proceso Cancelado",
      });
      return;
    }

    if (amount === 0) {
      Swal.fire({
        title: "El monto No Puede ser Cero!",
        text: "Proceso Cancelado",
      });
      return;
    }

    if (String(bank) === "PLAZA") {
      setPuntoplaza({
        referencia: ref,
        monto: Number(amount.replace(/,/g, ".")),
      });
    }

    if (String(bank) === "VENEZUELA") {
      setPuntovzla({
        referencia: ref,
        monto: Number(amount.replace(/,/g, ".")),
      });
    }

    if (String(bank) === "BANESCO") {
      setPuntobanesco({
        referencia: ref,
        monto: Number(amount.replace(/,/g, ".")),
      });
    }

    if (String(bank) === "PAGOMOVIL") {
      setPagomobil({
        referencia: ref,
        monto: Number(amount.replace(/,/g, ".")),
      });
    }

    if (String(bank) === "ZELLE") {
      setZelle({
        monto: Number(amount.replace(/,/g, ".")),
      });
    }
  };

  const addDiferencias = (group, type, concept, xmonto) => {
    let cant;

    if (!group) {
      Swal.fire({
        title: "Falta El Grupo Principal!",
        text: "Registrar Diferencias",
      });
      return;
    }
    if (!type) {
      Swal.fire({
        title: "Falta El Tipo de Diferencia!",
        text: "Registrar Diferencias",
      });
      return;
    }
    if (!concept) {
      Swal.fire({
        title: "Falta Describir la Diferencia!",
        text: "Registrar Diferencias",
      });
      return;
    }
    if (xmonto === 0) {
      Swal.fire({
        title: "Falta el Monto!",
        text: "Registrar Diferencias",
      });
      return;
    }

    if (type === "FALTANTE") {
      cant = Number(xmonto.replace(/,/g, ".")) * -1;
    }
    if (type === "SOBRANTE") {
      cant = Number(xmonto.replace(/,/g, "."));
    }

    setDiferencias((prev) => {
      return [
        ...prev,
        {
          grupo: group,
          tipo: type,
          concepto: concept,
          monto: cant,
        },
      ];
    });

    setSelectedGroup("");
    setTipo("");
    setConcepto("");
    setMonto6(0);
  };

  const deleteEfectivo = (moneda, denom) => {
    if (moneda === "DOLARES") {
      const found = dolares.filter((p) => p.denominacion !== denom);
      setDolares(found);
    }
    if (moneda === "EUROS") {
      const found = euros.filter((p) => p.denominacion !== denom);
      setEuros(found);
    }
    if (moneda === "BOLIVARES") {
      const found = bolivares.filter((p) => p.denominacion !== denom);
      setBolivares(found);
    }
  };

  const deleteDiferencias = (concept) => {
    const found = diferencias.filter((p) => p.concepto !== concept);
    setDiferencias(found);
  };

  const printHandler = () => {
    navigate(`/printcuadrecaja/${fecha}`);
  };

  return (
    <div className="cuadre-caja-container">
      <div className="flx column">
        <h2>Inversiones Paul 2428, C.A.</h2>
        <h4>Cuadre de Caja dia: {parseFecha(new Date(fecha).toISOString())}</h4>
        <h4>Frontend Tienda Chacao</h4>
        <div>
          <button className="cuadre-send-btn" onClick={updateHandler}>
            Guardar Cambios
          </button>
          <button className="cuadre-send-btn" onClick={printHandler}>
            <PrintIcon />
          </button>
        </div>
      </div>

      <details className="principal">
        <summary>Registrar Efectivo</summary>
        <div>
          {" "}
          <span className="cuadre-cash-span">Total Efectivo: </span>
          {totaldolares > 0 ? (
            <span
              className={
                ventaDolares === totaldolares ? "cuadreok" : "cuadrenotok"
              }>
              {" $" + Number(totaldolares).toFixed(2)}
            </span>
          ) : (
            ""
          )}
          {totalbolivares > 0 ? (
            <span
              className={
                ventaBolivares === totalbolivares ? "cuadreok" : "cuadrenotok"
              }>
              {"Bs" + Number(totalbolivares).toFixed(2)}
            </span>
          ) : (
            ""
          )}
          {totaleuros > 0 ? (
            <span
              className={
                ventaEuros === totaleuros ? "cuadreok" : "cuadrenotok"
              }>
              {"Euro:" + Number(totaleuros).toFixed(2)}
            </span>
          ) : (
            ""
          )}
        </div>

        {/* EFECTIVO DOLARES */}
        <div className="cuadre-grupo-container">
          <div className="cuadre-control-container">
            <div>
              <img className="bill-img" src="/dollar.jpg" alt="" />
              <p className="tiny-font">dolares</p>
            </div>
            <div className="select-cuadrecaja-container">
              <label>Denominacion del Billete</label>
              <select
                className="select-cuadre-small"
                value={denominacion}
                onChange={(e) => setDenominacion(e.target.value)}>
                {listaBilletes.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-cuadrecaja-container">
              <label>Numero de Billetes</label>
              <select
                className="select-cuadre-small"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}>
                {cantidadList.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-icon-container"
              onClick={() => addEfectivo("DOLARES", denominacion, qty)}>
              <AddCircleIcon />
            </button>
          </div>

          <hr className="hr-wfull" />
          <div className="show-group-items">
            {dolares
              ? dolares
                  .sort((a, b) => a.denominacion - b.denominacion)
                  .map((bill, inx) => {
                    return (
                      <div className="show-billetes" key={inx}>
                        <span>{bill.cantidad}</span>
                        <span>{"Billetes de " + bill.denominacion + "$"}</span>
                        <span className="monto">
                          $
                          {(
                            Number(bill.denominacion) * Number(bill.cantidad)
                          ).toFixed(2)}
                        </span>
                        <button
                          className="btn-icon-container"
                          onClick={() =>
                            deleteEfectivo("DOLARES", bill.denominacion)
                          }>
                          <TrashIcon />
                        </button>
                        ;
                      </div>
                    );
                  })
              : ""}
          </div>
          <hr className="hr-w60" />
          <p className="total-grupo">
            Total: $
            {dolares
              .reduce((sum, t) => t.cantidad * Number(t.denominacion) + sum, 0)
              .toFixed(2)}
          </p>
        </div>
        {/* FIN DE EFECTIVO DOLARES */}

        {/* EFECTIVO BOLIVARES */}
        <div className="cuadre-grupo-container">
          <div className="cuadre-control-container">
            <div>
              <img className="bill-img" src="/bolivar.jpg" alt="" />
              <p className="tiny-font">Bolivares</p>
            </div>
            <div className="select-cuadrecaja-container">
              <label>Denominacion del Billete</label>
              <select
                className="select-cuadre-small"
                value={denominacion2}
                onChange={(e) => setDenominacion2(e.target.value)}>
                {listaBilletes.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-cuadrecaja-container">
              <label>Numero de Billetes</label>
              <select
                className="select-cuadre-small"
                value={qty2}
                onChange={(e) => setQty2(Number(e.target.value))}>
                {cantidadList.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-icon-container"
              onClick={() => addEfectivo("BOLIVARES", denominacion2, qty2)}>
              <AddCircleIcon />
            </button>
          </div>
          <hr className="hr-wfull" />
          <div className="show-group-items">
            {bolivares
              ? bolivares
                  .sort((a, b) => a.denominacion - b.denominacion)
                  .map((bill, inx) => {
                    return (
                      <div className="show-billetes" key={inx}>
                        <span>{bill.cantidad}</span>
                        <span>{"Billetes de " + bill.denominacion + "$"}</span>
                        <span className="monto">
                          Bs.
                          {(
                            Number(bill.denominacion) * Number(bill.cantidad)
                          ).toFixed(2)}
                        </span>
                        <button
                          className="btn-icon-container"
                          onClick={() =>
                            deleteEfectivo("BOLIVARES", bill.denominacion)
                          }>
                          <TrashIcon />
                        </button>
                      </div>
                    );
                  })
              : ""}
          </div>
          <hr className="hr-w60" />
          <p className="total-grupo">
            Total: Bs.
            {bolivares
              .reduce((sum, t) => t.cantidad * Number(t.denominacion) + sum, 0)
              .toFixed(2)}
          </p>
        </div>
        {/* FIN DE EFECTIVO BOLIVARES */}

        {/* EFECTIVO EUROS */}
        <div className="cuadre-grupo-container">
          <div className="cuadre-control-container">
            <div>
              <img className="bill-img" src="/euro.png" alt="" />
              <p className="tiny-font">Euros</p>
            </div>
            <div className="select-cuadrecaja-container">
              <label>Denominacion del Billete</label>
              <select
                className="select-cuadre-small"
                value={denominacion3}
                onChange={(e) => setDenominacion3(e.target.value)}>
                {listaBilletes.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-cuadrecaja-container">
              <label>Numero de Billetes</label>
              <select
                className="select-cuadre-small"
                value={qty3}
                onChange={(e) => setQty3(Number(e.target.value))}>
                {cantidadList.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-icon-container"
              onClick={() => addEfectivo("EUROS", denominacion3, qty3)}>
              <AddCircleIcon />
            </button>
          </div>
          <hr className="hr-wfull" />
          <div className="show-group-items">
            {euros
              ? euros
                  .sort((a, b) => a.denominacion - b.denominacion)
                  .map((bill, inx) => {
                    return (
                      <div className="show-billetes" key={inx}>
                        <span>{bill.cantidad}</span>
                        <span>{"Billetes de " + bill.denominacion + "$"}</span>
                        <span className="monto">
                          EU.
                          {(
                            Number(bill.denominacion) * Number(bill.cantidad)
                          ).toFixed(2)}
                        </span>
                        <button
                          className="btn-icon-container"
                          onClick={() =>
                            deleteEfectivo("EUROS", bill.denominacion)
                          }>
                          <TrashIcon />
                        </button>
                      </div>
                    );
                  })
              : ""}
          </div>
          <hr className="hr-w60" />
          <p className="total-grupo">
            Total: Eu.
            {euros
              .reduce((sum, t) => t.cantidad * Number(t.denominacion) + sum, 0)
              .toFixed(2)}
          </p>
        </div>
        {/* FIN DE EFECTIVO EUROS */}
      </details>

      <details className="principal">
        <summary>
          Registrar Cierre
          <button className="btn-icon-container" onClick={() => addPunto()}>
            <EditIcon />
          </button>
        </summary>
        <div className="cuadre-section">
          {totalpuntos > 0 ? (
            <div className="details-container">
              <details>
                <summary className="no-marker">
                  <div className="registro-items">
                    {" "}
                    <span>Puntos:</span>
                    <span
                      className={
                        ventaPuntos === totalpuntos ? "cuadreok" : "cuadrenotok"
                      }>
                      {"Bs." + Number(totalpuntos).toFixed(2)}
                    </span>
                  </div>
                  <div className="cuadre-puntos-bancos-container">
                    {" "}
                    {Number(puntoplaza?.monto) ? (
                      <span>
                        Plaza: Bs.
                        {Number(puntoplaza?.monto).toFixed(2) || 0}
                      </span>
                    ) : (
                      <span>Plaza: Bs. 0.00</span>
                    )}
                    {Number(puntovzla?.monto) ? (
                      <span>
                        {" "}
                        Venezuela: Bs.
                        {Number(puntovzla?.monto).toFixed(2) || 0}
                      </span>
                    ) : (
                      <span>Venezuela: Bs. 0.00</span>
                    )}
                  </div>
                </summary>
              </details>
            </div>
          ) : (
            ""
          )}

          {totalpagomobil > 0 ? (
            <div className="details-container">
              <details>
                <summary className="no-marker">
                  <div className="registro-items">
                    <span>Pagomovil:</span>
                    <span
                      className={
                        ventaPagomobil === totalpagomobil
                          ? "cuadreok"
                          : "cuadrenotok"
                      }>
                      {"Bs." + Number(totalpagomobil).toFixed(2)}
                    </span>
                  </div>
                </summary>
              </details>
            </div>
          ) : (
            ""
          )}

          {totalzelle > 0 ? (
            <div className="details-container">
              <details>
                <summary className="no-marker">
                  <div className="registro-items">
                    {" "}
                    <span> Zelle:</span>
                    <span
                      className={
                        ventaZelle === totalzelle ? "cuadreok" : "cuadrenotok"
                      }>
                      {"$" + Number(totalzelle).toFixed(2)}
                    </span>
                  </div>
                </summary>
              </details>
            </div>
          ) : (
            ""
          )}
        </div>
      </details>

      <details className="principal">
        <summary className="summary-diferencias">Registrar Diferencias</summary>
        {/* DIFERENCIAS */}
        <div className="cuadre-grupo-container diferencias">
          <div className="cuadre-control-container dif">
            <div className="select-cuadrecaja-container dif">
              <label>Grupo</label>
              <select
                className="select-cuadre-small"
                value={seletedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}>
                {gruposList.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-cuadrecaja-container dif">
              <label>Tipo</label>
              <select
                className="select-cuadre-small"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}>
                {listaTipos.map((x, inx) => (
                  <option key={inx} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-cuadrecaja-container dif">
              <label>Monto</label>
              <input
                className="monto"
                value={monto6}
                onChange={(e) => setMonto6(e.target.value)}></input>
            </div>
            <div className="input-container-txtarea">
              <textarea
                className="txt-area"
                value={concepto}
                placeholder="Describir Diferencia"
                rows="2"
                cols={31}
                onChange={(e) => setConcepto(e.target.value)}></textarea>
            </div>
            <button
              className="btn-icon-container"
              onClick={() =>
                addDiferencias(seletedGroup, tipo, concepto, monto6)
              }>
              <AddCircleIcon />
            </button>
          </div>
          <hr className="hr-wfull" />
          <div className="show-group-items dif">
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

                      <FaTrashAlt
                        onClick={() => deleteDiferencias(dif.concepto)}
                      />
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        {/* FIN DE DIFERENCIAS */}
      </details>

      <details className="principal">
        <summary>Ver Detalle de Pagos</summary>
        <div className="cuadre-section">
          <div className="efectivo-sangria">
            <span> Efectivo:</span>
            {ventaDolares > 0 ? (
              <span>
                {"$" +
                  Number(
                    pagos?.reduce((sum, d) => d.pago.efectivousd + sum, 0)
                  ).toFixed(2)}
              </span>
            ) : (
              ""
            )}
            {ventaBolivares > 0 ? (
              <span>
                {"Bs" +
                  Number(
                    pagos?.reduce((sum, d) => d.pago.efectivobs + sum, 0)
                  ).toFixed(2)}
              </span>
            ) : (
              ""
            )}
            {ventaEuros > 0 ? (
              <span>
                {"Euro:" +
                  Number(
                    pagos?.reduce((sum, d) => d.pago.efectivoeuros + sum, 0)
                  ).toFixed(2)}
              </span>
            ) : (
              ""
            )}
          </div>

          <div>
            {ventaPlaza > 0 ? (
              <div className="transacciones-container">
                <div>
                  <p>
                    Plaza: Total Bs.
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
                <div className="show-group-items">
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
            {ventaVzla > 0 ? (
              <div className="transacciones-container">
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
                <div className="show-group-items">
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
            {ventaBanesco > 0 ? (
              <div className="transacciones-container">
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
                <div className="show-group-items">
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

          {ventaPagomobil > 0 ? (
            <div>
              <div className="transacciones-container">
                <div className="grupo-imagen">
                  <p>
                    Pagomovil: Total Bs.
                    {Number(
                      pagos?.reduce(
                        (sum, d) => d.pago.pagomovil.montopagomovil + sum,
                        0
                      )
                    ).toFixed(2)}
                  </p>
                </div>
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
                              {Number(x.pago.pagomovil.montopagomovil).toFixed(
                                2
                              )}
                            </span>
                          </div>
                        );
                      })
                    : ""}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {ventaZelle > 0 ? (
            <div>
              {" "}
              <div className="transacciones-container">
                {" "}
                <div className="grupo-imagen">
                  <p className="total-grupo">
                    Zelle: Total Bs.
                    {Number(ventaZelle).toFixed(2)}
                  </p>
                  <div className="show-group-items">
                    {pagos
                      ? pagos.map((x, inx) => {
                          if (x.pago.zelle.montozelle === 0) {
                            return "";
                          }
                          return (
                            <div className="show-puntos" key={inx}>
                              <span>
                                Referencia: {x.pago.zelle.zelletitular}
                              </span>
                              <span className="monto">
                                Bs. {Number(x.pago.zelle.montozelle).toFixed(2)}
                              </span>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>{" "}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </details>
    </div>
  );
}

export default CuadrecajaCreateScreen;
