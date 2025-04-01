import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { cuadreDia } from "../actions/controlActions";
import CuadreDiarioTable from "../components/CuadreDiarioTable";
import PrintIcon from "../icons/PrintIcon";
import dayjs from "dayjs";
import GroupingCuadreTableV2 from "../components/GroupingCuadreTableV2";

export default function CuadreDiarioScreen() {
  const params = useParams();
  const { id: fechaId } = params;
  const [subtotalcuadre, setSubtotalcuadre] = useState(0);
  const [ventaDolares, setVentaDolares] = useState(0);
  const dispatch = useDispatch();
  const ventaDia = useSelector((state) => state.cuadreDia);
  const { loading, controles, abonosCuadre, cash, puntoPlaza, puntoVenezuela, puntoBanesco, cambio } = ventaDia;

  useEffect(() => {
    dispatch(cuadreDia(fechaId));
  }, [dispatch, fechaId]);

  useEffect(() => {
    if (controles) {
      const totalVentaBs = controles.reduce((sum, order) => Number(order.montoUsd) * Number(order.cambioBcv) + sum, 0);
      const totalVentaUsd = controles.reduce((sum, order) => Number(order.montoUsd) + sum, 0);

      setSubtotalcuadre(totalVentaBs);
      setVentaDolares(totalVentaUsd);
    }
  }, [controles]);

  const columns = useMemo(
    () => [
      {
        header: "# Ver",
        id: "id",
        enableGrouping: false,
        cell: (info) => {
          return (
            <Link to={`/detalle-control/${info.row.original._id}`}>
              <span className="azul-brand negrita subrayado font-1">{info.row.index + 1}</span>{" "}
            </Link>
          );
        },

        footer: (valuefooter) => {
          //console.log("valuefooter", valuefooter.table.getFilteredRowModel().rows);
        },
      },
      {
        header: "Paciente",
        accessorKey: "paciente_data",
        enableGrouping: false,
        cell: (value) => {
          const nombre = value.getValue().nombre;
          const apellido = value.getValue().apellido;
          return nombre.toUpperCase() + " " + apellido.toUpperCase();
        },
      },
      {
        header: "Doctor",
        accessorKey: "doctor_data.nombre",
      },
      {
        header: "Servicios Facturados",
        accessorKey: "serviciosItems",
        enableGrouping: false,

        cell: (value) => {
          const { serviciosItems, servicio_data } = value.row.original;

          if (!serviciosItems) {
            return " ";
          }
          return (
            <div>
              {serviciosItems.map((item, inx) => (
                <div key={inx}>
                  <div className="cuadre-descripcion flx font-x pad-0">
                    <p className="mr-05 centrado">{item.cantidad} </p>
                    <p>{servicio_data[inx]?.nombre}</p>
                    <p>(${item.precioServ})</p>
                  </div>
                </div>
              ))}
            </div>
          );
        },
      },
      {
        header: "Monto Servicios",
        accessorKey: "montoServicios",
        enableGrouping: false,
        cell: (value) => {
          if (!value) {
            return "";
          }
          return "$" + Number(value.getValue()).toFixed(2);
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.getValue("montoServicios"), 0);
          return "$" + Number(total).toFixed(2);
        },
      },
      {
        header: "Monto Laboratorio",
        accessorKey: "montoLab",
        enableGrouping: false,
        cell: (value) => {
          const labtxt = value.row.original.laboratorio;
          if (!value) {
            return "";
          }
          return (
            <div className="flx column">
              <span>${Number(value.getValue() * 4).toFixed(2)}</span>
              <span>{labtxt}</span>
            </div>
          );
        },
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((total, row) => total + row.getValue("montoLab"), 0);
          return "$" + Number(total).toFixed(2);
        },
      },
      {
        header: "Descuento",
        accessorKey: "descuento",
        enableGrouping: false,
        cell: (value) => {
          if (!value) {
            return "";
          }
          return "$" + Number(value.getValue()).toFixed(2);
        },
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((total, row) => total + row.getValue("descuento"), 0);
          return "$" + Number(total).toFixed(2);
        },
      },
      {
        header: "Abonos",
        accessorKey: "abonos",
        enableGrouping: false,

        cell: (value) => {
          const { abonos } = value.row.original;
          if (!abonos || abonos.length === 0) {
            return ""
          }
          const totalAbonado = abonos?.reduce((total, x) => total + x.monto, 0);

          return (
            <div>
              <details>
                <summary>ver</summary>
                {abonos.map((abono, inx) => {
                  return (
                    <div key={inx}>
                      <div className="cuadre-descripcion flx font-x pad-0">
                        <span className="minw-60 mr-05 centrado">{dayjs(abono.fecha).utc().format("DD-MM-YYYY")} </span>
                        <span>${abono.monto}</span>
                      </div>
                    </div>
                  );
                })}
                {<span>Total: ${Number(totalAbonado).toFixed(2)}</span>}
              </details>
            </div>
          );
        },
      },

      {
        header: "Monto A Pagar",
        accessorKey: "montoUsd",
        enableGrouping: false,
        cell: (value) => {
          const { abonos } = value.row.original;

          if (!abonos || abonos.length === 0) {
            return
          }
          const totalAbonado = abonos?.reduce((total, x) => total + x.monto, 0);
          const porpagar = Number(value.getValue()) - Number(totalAbonado);
          return "$" + Number(porpagar).toFixed(2);
        },
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((total, row) => total + row.getValue("montoUsd"), 0);
          return "$" + Number(total).toFixed(2);
        },
      },
      {
        header: "Comision Doctor",
        accessorKey: "montoComisionDr",
        enableGrouping: false,
        cell: (value) => {
          return "$" + Number(value.getValue()).toFixed(2);
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.getValue("montoComisionDr"), 0);
          return "$" + Number(total).toFixed(2);
        },
      },
      {
        header: "Comision Plaza",
        accessorKey: "montoComisionPlaza",
        enableGrouping: false,
        cell: (value) => {
          return "$" + Number(value.getValue()).toFixed(2);
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.getValue("montoComisionPlaza"), 0);
          return "$" + Number(total).toFixed(2);
        },
      },
      {
        header: "Cambio",
        accessorKey: "cambioBcv",
        enableGrouping: false,
        cell: (value) => {
          return Number(value.getValue()).toFixed(2);
        },
        footer: () => {
          return " - ";
        },
      },
      {
        header: "Dolares",
        accessorKey: "pago.efectivousd",
        enableGrouping: false,
        cell: (value) => {
          if (!value) {
            return "-";
          }
          return "$" + Number(value.getValue()).toFixed(2);
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.pago.efectivousd, 0);
          return "$" + Number(total).toFixed(2);
        },
      },
      {
        header: "Euros",
        accessorKey: "pago.efectivoeuros",
        enableGrouping: false,
        cell: (value) => {
          if (!value) {
            return "-";
          }
          return "€" + Number(value.getValue()).toFixed(2);
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.pago.efectivoeuros, 0);
          return "€" + Number(total).toFixed(2);
        },
      },
      {
        header: "Bolivares",
        accessorKey: "pago.efectivobs",
        enableGrouping: false,
        cell: (value) => {
          if (!value) {
            return "-";
          }
          return "Bs" + Number(value.getValue()).toFixed(2);
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.pago.efectivobs, 0);
          return "Bs" + Number(total).toFixed(2);
        },
      },
      {
        header: "Punto Venta",
        accessorKey: "pago.punto.montopunto",
        enableGrouping: false,

        cell: ({ row }) => {
          const obj1 = row.original.pago.punto;

          if (!obj1.montopunto) {
            return "-";
          }

          return (
            <div className="flx column pad-0">
              <span className="minw-50">
                {"Bs" + Number(obj1.montopunto).toFixed(2) + "  " + obj1.bancodestinopunto}
              </span>
              {obj1.montopunto2 ? (
                <span>{"Bs" + Number(obj1.montopunto2).toFixed(2) + "  " + obj1.bancodestinopunto2}</span>
              ) : (
                ""
              )}

              {obj1.montopunto3 ? (
                <span>{"Bs" + Number(obj1.montopunto3).toFixed(2) + "  " + obj1.bancodestinopunto3}</span>
              ) : (
                ""
              )}
            </div>
          );
        },

        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.pago.punto.montopunto, 0);
          const total2 = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.pago.punto.montopunto2, 0);
          const total3 = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.pago.punto.montopunto3, 0);
          return "Bs" + Number(total + total2 + total3).toFixed(2);
        },
      },

      {
        header: "Pago Movil",
        accessorKey: "pago.pagomovil.montopagomovil",
        enableGrouping: false,
        cell: ({ row }) => {
          const obj1 = row.original.pago.pagomovil;

          if (!obj1.montopagomovil) {
            return "-";
          }

          return (
            <div className="minw-100">
              <span>{"Bs" + Number(obj1.montopagomovil).toFixed(2) + " " + obj1.bancodestinopagomovil}</span>
            </div>
          );
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.pago.pagomovil.montopagomovil, 0);
          return "Bs" + Number(total).toFixed(2);
        },
      },
      {
        header: "Zelle",
        accessorKey: "pago.zelle.montozelle",
        enableGrouping: false,
        cell: ({ row }) => {
          const obj1 = row.original.pago.zelle;

          if (!obj1.montozelle) {
            return "-";
          }

          return (
            <div>
              <span>{"$" + obj1.montozelle + " " + obj1.zelletitular}</span>
            </div>
          );
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.pago.zelle.montozelle, 0);
          return "$" + Number(total).toFixed(2);
        },
      },
    ],
    []
  );

  const imprimir = () => {
    window.print();
  };

  const parseFecha = (fecha) => {
    const dia = fecha.toString().substr(8, 2);
    const mes = fecha.toString().substr(5, 2);
    const ano = fecha.toString().substr(0, 4);
    const xfecha = dia + "-" + mes + "-" + ano;
    return xfecha;
  };

  console.log("abonosCuadre (aggregated):", abonosCuadre);

  return (
    <div className="cuadre-container flx column mtop-2">
      <div className="flx pad-0">
        <button className="btn-icon-container m-0" onClick={imprimir}>
          <PrintIcon />
        </button>
        <h3>REPORTE DE CONTROLES DEL {parseFecha(fechaId)}</h3>
      </div>

      <div>{loading ? <span>Cargando Datos...</span> : <GroupingCuadreTableV2 columns={columns} data={controles} />}</div>


      <span>Observaciones: ____________________________________________________________________________________</span>
      <div className="mtop-1">
        <span>
          Resumen: Venta Total del Dia ${Number(ventaDolares).toFixed(2)} (Efectivo US$ {cash?.totalCashusd}){" "}
        </span>
      </div>
      <div className="flx gap3 border-1 astart b-radius font-x pad-1">
        <div className="font-14">
          <label className="pad-0 negrita font-14">Efectivo</label>
          <div className="ml-05">
            <span>Dolares:</span>
            <span>{Number(cash?.totalCashusd).toFixed(2)}</span>
          </div>
          <div className="ml-05">
            <span>Euros:</span>
            <span>{Number(cash?.totalCasheuros).toFixed(2)}</span>
          </div>
          <div className="ml-05">
            <span>Bolivares:</span>
            <span>{Number(cash?.totalCashbs).toFixed(2)}</span>
          </div>
        </div>
        <div className="font-14">
          <label className="pad-0 negrita font-14">Puntos Venta</label>
          <div className="ml-05">
            <span>Plaza:</span>
            <span>
              Bs.
              {Number(puntoPlaza?.reduce((sum, p) => p.totalpuntoplaza + sum, 0)).toFixed(2)}
            </span>
          </div>
          <div className="ml-05">
            <span>Venezuela:</span>
            <span>
              Bs.
              {Number(puntoVenezuela?.reduce((sum, p) => p.totalpuntovzla + sum, 0)).toFixed(2)}
            </span>
          </div>
          <div className="ml-05">
            {" "}
            <span>Banesco:</span>
            <span>
              Bs.
              {Number(puntoBanesco?.reduce((sum, p) => p.totalpuntobanes + sum, 0)).toFixed(2)}
            </span>
          </div>
        </div>{" "}
        <div className="font-14">
          <label className="pad-0 negrita font-14">Otros Pagos</label>
          <div className="ml-05">
            <span>Pagomovil:</span>
            <span>Bs.{Number(cash?.totalpagomobil).toFixed(2)}</span>
          </div>
          <div className="ml-05">
            <span>Zelle:</span>
            <span>${Number(cash?.totalzelle).toFixed(2)}</span>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
