import React, { useEffect, useState } from "react";
import GroupingReventasTable from "../components/GroupingReventasTable";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { ventasControls } from "../actions/controlActions";
import PrintIcon from "../icons/PrintIcon";
import CheckIcon from "../icons/CheckIcon";
import CloseIcon from "../icons/CloseIcon";


function GroupingControles() {
  const [fechaInicio, setFechaInicio] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [fechaFinal, setFechaFinal] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const dispatch = useDispatch();

  const ventasControlsReport = useSelector(
    (state) => state.ventasControlsReport
  );
  const { loading, ventas } = ventasControlsReport;

  useEffect(() => {
    dispatch(ventasControls(fechaInicio, fechaFinal));
  }, []);

  const getFechaInicio = (fecha1) => {
    setFechaInicio(fecha1);
  };

  const getFechaFinal = (fecha2) => {
    setFechaFinal(fecha2);
  };

  const queryHandler = () => {
    dispatch(ventasControls(fechaInicio, fechaFinal));
  };

  useEffect(() => { }, [dispatch]);

  const resetHandler = () => {
    const f1 = dayjs(new Date()).format("YYYY-MM-DD");
    const f2 = dayjs(new Date()).format("YYYY-MM-DD");
    setFechaFinal(f2);
    setFechaInicio(f1);
    dispatch(ventasControls(f1, f2));
  };
  const imprimir = () => {
    window.print();
  };

  const columns = [
    {
      header: "Fecha",
      accessorKey: "fecha",
      cell: (info) => {
        return dayjs(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "Paciente",
      accessorKey: "nombrePaciente",
    },
    {
      header: "Paciente",
      accessorKey: "apellidoPaciente",
    },
    {
      header: "Doctor",
      accessorKey: "nombreDoctor",
      footer: "",
    },
    {
      header: "Servicios",
      accessorKey: "serviciosItems",
      enableGrouping: false,
      cell: (info) => {
        const { serviciosItems } = info.row.original;
        return serviciosItems.map((p, inx) => {
          return (
            <span className="consolidado-articulos" key={inx}>
              {p.cantidad}
            </span>
          );
        });

        //<span>{orderItems.codigo + " talla " + orderItems.talla}</span>;
      },

      footer: "Total General >:",
    },

    {
      header: "Monto $",
      accessorKey: "montoUsd",
      enableGrouping: false,
      cell: (info) => {
        return "$" + Number(info.getValue()).toFixed(2);
      },

      aggregationFn: "sum",
      aggregatedCell: ({ row }) => {
        return Number(row.getValue("subtotal")).toFixed(2);
      },

    },
    {
      header: "Comision Dr.",
      accessorKey: "montoComisionDr",
      enableGrouping: false,
      cell: (info) => {
        return "$" + Number(info.getValue()).toFixed(2);
      },

      aggregationFn: "sum",
      aggregatedCell: ({ row }) => {
        return Number(row.getValue("subtotal")).toFixed(2);
      },

    },
    {
      header: "Comision Plaza",
      accessorKey: "montoComisionPlaza",
      enableGrouping: false,
      cell: (info) => {
        return "$" + Number(info.getValue()).toFixed(2);
      },

      aggregationFn: "sum",
      aggregatedCell: ({ row }) => {
        return Number(row.getValue("subtotal")).toFixed(2);
      },

    },
  ];
  console.log("ventas", ventas)
  return (
    <div className="div-print-report">
      <button className="btn-print-report weekly" onClick={imprimir}>
        <PrintIcon />
      </button>
      <div className="weekly-report-header">
        <h2 className="h2-weekly">VENTAS CONSOLIDADAS</h2>

        <div className="flx  jcenter">
          <button className="btn-close-report" onClick={resetHandler}>
            <CloseIcon />
          </button>
          <input
            type="date"
            className="input-report"
            id="fecha-inicio"
            value={fechaInicio}
            onChange={(e) => getFechaInicio(e.target.value)}
          />
          <input
            type="date"
            id="fecha-final"
            className="input-report"
            value={fechaFinal}
            onChange={(e) => getFechaFinal(e.target.value)}
          />

          <button className="btn-query-report" onClick={queryHandler}>
            <CheckIcon />
          </button>
        </div>
        <p>seleccione un rango de fechas y pulse el icono verde</p>
      </div>
      <div className="table-container">
        {loading ? (
          <span>Cargando Datos...</span>
        ) : (
          <div>
            {ventas?.length > 0 ? (
              <GroupingReventasTable data={ventas} columns={columns} />
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupingControles;
