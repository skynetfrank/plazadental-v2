import React, { useEffect, useState } from "react";
import GroupingReventasTable from "../components/GroupingReventasTable";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { ventasControls } from "../actions/controlActions";
import PrintIcon from "../icons/PrintIcon";
import CheckIcon from "../icons/CheckIcon";
import CloseIcon from "../icons/CloseIcon";
import { listServicios } from "../actions/servicioActions";
import Swal from "sweetalert2";

function GroupingControles() {
  const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [fechaFinal, setFechaFinal] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const dispatch = useDispatch();

  const servicioList = useSelector((state) => state.servicioList);
  const { servicios } = servicioList;

  useEffect(() => {
    if (!servicios || servicios.length === 0) {
      dispatch(listServicios({}));
    }
  }, [dispatch, servicios]);

  const ventasControlsReport = useSelector((state) => state.ventasControlsReport);
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
    if (fechaInicio < "2024-12-23") {
      Swal.fire({
        text: "No Hay Datos Antes del 11-12-2024",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });
      return;
    }
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
      header: "Laboratorio",
      accessorKey: "laboratorio",
      cell: (info) => {
        if (!info.getValue()) {
          return "No Aplica";
        }
        return info.getValue();
      },
      footer: "",
    },
    {
      header: "Monto Laboratorio",
      accessorKey: "montoLab",
      enableGrouping: false,
      cell: (info) => {
        return "$" + Number(info.getValue()).toFixed(2);
      },
      footer: "",
    },

    {
      header: "Servicios",
      accessorKey: "serviciosItems",
      enableGrouping: false,
      cell: (info) => {
        const { serviciosItems, _id } = info.row.original;
        console.log("_id", _id);
        return serviciosItems.map((p, inx) => {
          console.log("servicios", servicios, "p:", p);
          const servName = servicios.find((s) => s._id === p.servicio);
          console.log("servName", servName);
          return (
            <span className="consolidado-articulos" key={inx}>
              {p.cantidad + " " + servName.nombre + " $" + p.precioServ}
            </span>
          );
        });

        //<span>{orderItems.codigo + " talla " + orderItems.talla}</span>;
      },

      footer: "",
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
        return Number(row.getValue("montoUsd")).toFixed(2);
      },
    },
    {
      header: "Descuento",
      accessorKey: "descuento",
      enableGrouping: false,
      cell: (info) => {
        return "$" + Number(info.getValue()).toFixed(2);
      },
      footer: "",
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
        return Number(row.getValue("montoComisionDr")).toFixed(2);
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
        return Number(row.getValue("montoComisionPlaza")).toFixed(2);
      },
    },
  ];
  //console.log("ventas", ventas);
  console.log("fechaInicio", fechaInicio);
  return (
    <div className="div-print-report">
      <div className="weekly-report-header">
        <div className="flx jcenter">
          <h2 className="h2-weekly">INGRESOS POR SERVICIOS</h2>
          <button className="btn-query-report" onClick={imprimir}>
            <PrintIcon />
          </button>
        </div>

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
          <div>{ventas?.length > 0 ? <GroupingReventasTable data={ventas} columns={columns} /> : ""}</div>
        )}
      </div>
    </div>
  );
}

export default GroupingControles;
