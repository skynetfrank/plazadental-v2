import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import CloseIcon from "../icons/CloseIcon";

function PaymentForm({
  onClose,
  sendPayToParent,
  montoPagoUsd,
  montoPagoBs,
  montoCobrarCashea,
  orderCashea,
  montoAbono,
  fechaAbono,
  isAbono,
}) {
  const modalRef = useRef();

  const [efectivousd, setEfectivousd] = useState("");
  const [efectivoeuros, setEfectivoeuros] = useState("");
  const [efectivobs, setEfectivobs] = useState("");

  const [montopunto, setMontopunto] = useState("");
  const [bancopunto] = useState("");
  const [bancodestinopunto, setBancodestinopunto] = useState("");

  const [montopunto2, setMontopunto2] = useState("");
  const [bancopunto2] = useState("");
  const [bancodestinopunto2, setBancodestinopunto2] = useState("");

  const [montopunto3, setMontopunto3] = useState("");
  const [bancopunto3] = useState("");
  const [bancodestinopunto3, setBancodestinopunto3] = useState("");

  const [montopagomovil, setMontopagomovil] = useState("");
  const [bancopagomovil] = useState("");
  const [bancodestinopagomovil, setBancodestinopagomovil] = useState("");

  const [montozelle, setMontozelle] = useState("");
  const [zelletitular, setZelletitular] = useState("");
  const [zelleref, setZelleref] = useState("");

  const [openMix, setOpenMix] = useState("");
  const bancosDemoda = ["", "Banesco", "Venezuela", "Plaza", "Otro Banco", "BNC"];

  if (montoPagoUsd <= 0) {
    Swal.fire("No Ha Registrado Servicios!");
    onClose();
  }

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  function handleClick() {
    if (montopunto > 0) {
      if (!bancodestinopunto) {
        Swal.fire("Falta Banco Demoda!");
        return;
      }
    }

    if (montopunto2 > 0) {
      if (!bancodestinopunto2) {
        Swal.fire("Falta Banco Demoda!");
        return;
      }
    }

    if (montopunto3 > 0) {
      if (!bancodestinopunto3) {
        Swal.fire("Falta Banco Demoda!");
        return;
      }
    }

    if (montopagomovil > 0) {
      if (!bancodestinopagomovil) {
        Swal.fire("Falta Banco Demoda!");
        return;
      }
    }

    if (montozelle > 0) {
      if (!zelletitular) {
        Swal.fire("Falta El Titular!");
        return;
      }
      if (!zelleref) {
        Swal.fire("Falta Referencia del Zelle!");
        return;
      }
    }

    const paymentObject = {
      efectivousd,
      efectivobs,
      efectivoeuros,
      punto: {
        montopunto,
        bancopunto,
        bancodestinopunto,
        montopunto2,
        bancopunto2,
        bancodestinopunto2,
        montopunto3,
        bancopunto3,
        bancodestinopunto3,
      },
      pagomovil: { montopagomovil, bancopagomovil, bancodestinopagomovil },
      zelle: { montozelle, zelletitular, zelleref },
      cashea: {
        monto: montoCobrarCashea,
        orden: orderCashea,
      },
    };

    const objAbono = {
      fecha: fechaAbono,
      monto: montoAbono,
      formaPago: "Pago-Mixto",
    };

    sendPayToParent(isAbono ? {} : paymentObject, "Pago-Mixto", isAbono ? objAbono : "", isAbono);
    onClose();
  }

  const handleCashUsd = (monto) => {
    const paymentObject = {
      efectivousd: monto,
      efectivobs,
      efectivoeuros,
      punto: {
        montopunto,
        bancopunto,
        bancodestinopunto,
        montopunto2,
        bancopunto2,
        bancodestinopunto2,
        montopunto3,
        bancopunto3,
        bancodestinopunto3,
      },
      pagomovil: { montopagomovil, bancopagomovil, bancodestinopagomovil },
      zelle: { montozelle, zelletitular, zelleref },
      cashea: {
        monto: montoCobrarCashea,
        orden: orderCashea,
      },
    };
    const txtpago = "Divisas US$";

    const objAbono = {
      fecha: fechaAbono,
      monto: montoAbono,
      formaPago: txtpago,
    };

    sendPayToParent(paymentObject, txtpago, isAbono ? objAbono : "");

    onClose();
  };

  const handlePunto = (monto, banco) => {
    const paymentObject = {
      efectivousd,
      efectivobs,
      efectivoeuros,
      punto: {
        montopunto: monto,
        bancopunto,
        bancodestinopunto: banco,
        montopunto2,
        bancopunto2,
        bancodestinopunto2,
        montopunto3,
        bancopunto3,
        bancodestinopunto3,
      },
      pagomovil: { montopagomovil, bancopagomovil, bancodestinopagomovil },
      zelle: { montozelle, zelletitular, zelleref },
      cashea: {
        monto: montoCobrarCashea,
        orden: orderCashea,
      },
    };
    const txtpago =
      paymentObject.punto.efectivousd > 0
        ? "Divisas "
        : "Punto de Venta " +
          paymentObject.punto.bancodestinopunto +
          " " +
          bancodestinopunto2 +
          " " +
          bancodestinopunto3;

    const objAbono = {
      fecha: fechaAbono,
      monto: montoAbono,
      formaPago: txtpago,
    };

    sendPayToParent(paymentObject, txtpago, isAbono ? objAbono : "");

    onClose();
  };

  const handleCashEuro = (monto) => {
    const paymentObject = {
      efectivousd,
      efectivobs,
      efectivoeuros: monto,
      punto: {
        montopunto,
        bancopunto,
        bancodestinopunto,
        montopunto2,
        bancopunto2,
        bancodestinopunto2,
        montopunto3,
        bancopunto3,
        bancodestinopunto3,
      },
      pagomovil: { montopagomovil, bancopagomovil, bancodestinopagomovil },
      zelle: { montozelle, zelletitular, zelleref },
      cashea: {
        monto: montoCobrarCashea,
        orden: orderCashea,
      },
    };
    const txtpago = "Divisas Euros";
    const objAbono = {
      fecha: fechaAbono,
      monto: montoAbono,
      formaPago: txtpago,
    };
    sendPayToParent(paymentObject, txtpago, isAbono ? objAbono : "");
    onClose();
  };

  const handleCashBs = (monto) => {
    const paymentObject = {
      efectivousd,
      efectivobs: monto,
      efectivoeuros,
      punto: {
        montopunto,
        bancopunto,
        bancodestinopunto,
        montopunto2,
        bancopunto2,
        bancodestinopunto2,
        montopunto3,
        bancopunto3,
        bancodestinopunto3,
      },
      pagomovil: { montopagomovil, bancopagomovil, bancodestinopagomovil },
      zelle: { montozelle, zelletitular, zelleref },
      cashea: {
        monto: montoCobrarCashea,
        orden: orderCashea,
      },
    };
    const txtpago = "Efectivo Bolivares";
    const objAbono = {
      fecha: fechaAbono,
      monto: montoAbono,
      formaPago: txtpago,
    };
    sendPayToParent(paymentObject, txtpago, isAbono ? objAbono : "");
    onClose();
  };

  const handlePagoMovil = (monto, banco) => {
    const paymentObject = {
      efectivousd,
      efectivobs,
      efectivoeuros,
      punto: {
        montopunto,
        bancopunto,
        bancodestinopunto,
        montopunto2,
        bancopunto2,
        bancodestinopunto2,
        montopunto3,
        bancopunto3,
        bancodestinopunto3,
      },
      pagomovil: {
        montopagomovil: monto,
        bancopagomovil,
        bancodestinopagomovil: banco,
      },
      zelle: { montozelle, zelletitular, zelleref },
      cashea: {
        monto: montoCobrarCashea,
        orden: orderCashea,
      },
    };
    const objAbono = {
      fecha: fechaAbono,
      monto: montoAbono,
      formaPago: "Pagomovil " + banco,
    };
    sendPayToParent(paymentObject, "Pagomovil " + banco, isAbono ? objAbono : "");
    onClose();
  };

  const handleZelle = async (monto) => {
    const { value: titular } = await Swal.fire({
      title: "Ingrese el Nombre del Titular",
      input: "text",
      inputLabel: "Titular",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Este campo no debe estar vacio!";
        }
      },
    });

    if (!titular) {
      Swal.fire({
        title: "Falta el Titular!",
        text: "No se guardo El Pago",
      });
      return;
    }

    const paymentObject = {
      efectivousd,
      efectivobs,
      efectivoeuros,
      punto: {
        montopunto,
        bancopunto,
        bancodestinopunto,
        montopunto2,
        bancopunto2,
        bancodestinopunto2,
        montopunto3,
        bancopunto3,
        bancodestinopunto3,
      },
      pagomovil: {
        montopagomovil,
        bancopagomovil,
        bancodestinopagomovil,
      },
      zelle: { montozelle: monto, zelletitular: titular, zelleref },
      cashea: {
        monto: montoCobrarCashea,
        orden: orderCashea,
      },
    };
    const objAbono = {
      fecha: fechaAbono,
      monto: montoAbono,
      formaPago: "Zelle",
    };

    sendPayToParent(paymentObject, "Zelle", isAbono ? objAbono : "");
    onClose();
  };

  const closeBotonera = () => {
    setOpenMix(true);
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="modal-container">
      <div className="modal-content">
        <div className="flx jsb gap3 pad-0 minw-360">
          <h3 className="font-1">Registrar Pago</h3>
          <h3 className="font-14">{"$" + Number(montoPagoUsd).toFixed(2)}</h3>
          <h3 className="font-14">{" Bs." + Number(montoPagoBs).toFixed(2)}</h3>

          <button className="btn-icon-container minw-20 m-0" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={openMix === true ? "close-botonera" : "botonera-pago flx wrap pad-0"} id="botonera-pago">
          <button onClick={() => handleCashUsd(Number(montoPagoUsd))}>EFECTIVO DIVISAS DOLARES $</button>
          <button onClick={() => handleCashEuro(Number(montoPagoUsd))}>EFECTIVO DIVISAS EUROS</button>
          <button onClick={() => handleCashBs(Number(montoPagoBs))}>EFECTIVO BOLIVARES Bs. </button>
          <button onClick={() => handlePagoMovil(Number(montoPagoBs), "Venezuela")}>PAGOMOVIL BANCO VENEZUELA</button>
          <button onClick={() => handlePagoMovil(Number(montoPagoBs), "Banesco")}>PAGOMOVIL BANESCO</button>
          <button onClick={() => handlePunto(Number(montoPagoBs), "Banesco")}>PUNTO DE VENTA BANESCO</button>
          <button onClick={() => handlePunto(Number(montoPagoBs), "Venezuela")}>PUNTO DE VENTA VENEZUELA</button>
          <button onClick={() => handleZelle(Number(montoPagoUsd))}>DIVISAS ZELLE US$</button>
        </div>

        <details onClick={() => closeBotonera()}>
          <summary className="font-1 pad-1">PAGO MIXTO</summary>
          <div className="flx column pad-0 astart minw-360 maxw-360 font-14 ml-2">
            <details>
              <summary>Efectivo</summary>
              <div className="flx jcenter gap pad-0 ml-2">
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Divisas US$</label>
                  <input
                    type="number"
                    step="any"
                    value={efectivousd}
                    className="w-70 txt-align-r"
                    onChange={(e) => setEfectivousd(Number(e.target.value))}
                  ></input>
                </div>
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Divisas Euro</label>
                  <input
                    type="number"
                    step="any"
                    value={efectivoeuros}
                    className="w-70  txt-align-r"
                    onChange={(e) => setEfectivoeuros(Number(e.target.value))}
                  ></input>
                </div>
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Bolivares Bs.</label>
                  <input
                    type="number"
                    step="any"
                    value={efectivobs}
                    className="w-70 txt-align-r"
                    onChange={(e) => setEfectivobs(Number(e.target.value))}
                  ></input>
                </div>
              </div>
            </details>

            <details>
              <summary>Punto</summary>
              <div className="flx abase-top jcenter gap pad-0 ml-2">
                <span className="negrita font-x">Tarjeta 1</span>
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Monto Bs.</label>
                  <input
                    type="number"
                    step="any"
                    value={montopunto}
                    className="w-70 txt-align-r pad-03"
                    onChange={(e) => setMontopunto(Number(e.target.value))}
                  ></input>
                </div>
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Banco Demoda</label>
                  <select
                    className="select-bancos"
                    value={bancodestinopunto}
                    onChange={(e) => setBancodestinopunto(e.target.value)}
                  >
                    {bancosDemoda.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flx abase-top jcenter gap  pad-0 ml-2">
                <span className="negrita font-x">Tarjeta 2</span>
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Monto Bs.</label>
                  <input
                    type="number"
                    step="any"
                    value={montopunto2}
                    className="w-70 txt-align-r pad-03"
                    onChange={(e) => setMontopunto2(Number(e.target.value))}
                  ></input>
                </div>

                <div className="flx column astart pad-0 negrita font-x">
                  <label>Banco Demoda</label>
                  <select
                    className="select-bancos"
                    value={bancodestinopunto2}
                    onChange={(e) => setBancodestinopunto2(e.target.value)}
                  >
                    {bancosDemoda.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flx abase-top jcenter gap  pad-0 ml-2">
                <span className="negrita font-x">Tarjeta 3</span>
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Monto Bs.</label>
                  <input
                    type="number"
                    step="any"
                    value={montopunto3}
                    className="w-70 txt-align-r pad-03"
                    onChange={(e) => setMontopunto3(Number(e.target.value))}
                  ></input>
                </div>

                <div className="flx column  astart pad-0 negrita font-x">
                  <label>Banco Demoda</label>
                  <select
                    className="select-bancos"
                    value={bancodestinopunto3}
                    onChange={(e) => setBancodestinopunto3(e.target.value)}
                  >
                    {bancosDemoda.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </details>

            <details>
              <summary>Pagomovil</summary>
              <div className="flx jcenter gap  pad-0 ml-2">
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Monto Bs.</label>
                  <input
                    type="number"
                    step="any"
                    value={montopagomovil}
                    className="w-70 txt-align-r"
                    onChange={(e) => setMontopagomovil(Number(e.target.value))}
                  ></input>
                </div>
                <div className="flx column  astart pad-0 negrita font-x">
                  <label>Banco Demoda</label>
                  <select
                    className="select-bancos"
                    value={bancodestinopagomovil}
                    onChange={(e) => setBancodestinopagomovil(e.target.value)}
                  >
                    {bancosDemoda.map((x, inx) => (
                      <option key={inx} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </details>

            <details>
              <summary>Zelle</summary>
              <div className="flx jcenter gap  pad-0 ml-2">
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Monto Dolares</label>
                  <input
                    type="number"
                    step="any"
                    value={montozelle}
                    className="w-70  txt-align-r"
                    onChange={(e) => setMontozelle(Number(e.target.value))}
                  ></input>
                </div>
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Nombre Titular</label>
                  <input
                    type="text"
                    value={zelletitular}
                    className="w-70"
                    onChange={(e) => setZelletitular(e.target.value)}
                  ></input>
                </div>
                <div className="flx column astart pad-0 negrita font-x">
                  <label>Referencia</label>
                  <input
                    type="text"
                    value={zelleref}
                    className="w-70"
                    onChange={(e) => setZelleref(e.target.value)}
                  ></input>
                </div>
              </div>
            </details>
          </div>
          <div className="centrado w-100pc mtop-1 mb">
            <button onClick={handleClick}>Guardar Pago Mixto</button>
          </div>
        </details>
      </div>
    </div>
  );
}

export default PaymentForm;
