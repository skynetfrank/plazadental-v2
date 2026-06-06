import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { listQuotes } from "../actions/quoteActions";
import Loader from "../components/Loader";
import MessageBox from "../components/MessageBox";
import SimpleTable from "../components/SimpleTable";
import ToolTip from "../components/ToolTip";
import AddCircleIcon from "../icons/AddCircleIcon";
import EditIcon from "../icons/EditIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const QuoteListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quoteList = useSelector((state) => state.quoteList) || { quotes: [] };
  const { loading, error, quotes } = quoteList;

  useEffect(() => {
    dispatch(listQuotes());
  }, [dispatch]);

  const columns = [
    {
      header: "Fecha",
      accessorKey: "createdAt",
      cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY"),
    },
    {
      header: "Paciente",
      accessorKey: "paciente.nombre",
      cell: (info) =>
        info.row.original.paciente
          ? `${info.row.original.paciente.nombre} ${info.row.original.paciente.apellido}`
          : "No encontrado",
    },
    {
      header: "C.I. Paciente",
      accessorKey: "paciente.cedula",
      cell: (info) => info.row.original.paciente?.cedula || "N/A",
    },
    {
      header: "Doctor",
      accessorKey: "doctor.nombre",
      cell: (info) =>
        info.row.original.doctor
          ? `${info.row.original.doctor.nombre} ${info.row.original.doctor.apellido}`
          : "No encontrado",
    },
    {
      header: "Total ($)",
      accessorKey: "total",
      cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
    },
    {
      header: "Validez (días)",
      accessorKey: "validity",
    },
    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <div className="flx pad-0">
            <ToolTip text="Visualizar Cotización">
              <button className="circle-btn" onClick={() => navigate(`/quote/${_id}/view`)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
            </ToolTip>
            <ToolTip text="Ver/Editar Cotización">
              <button className="circle-btn" onClick={() => navigate(`/quote/${_id}/edit`)}>
                <EditIcon />
              </button>
            </ToolTip>
            {/* Add print button here if needed, similar to QuoteCreator */}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader txt="Cargando Cotizaciones..." />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <SimpleTable
          data={quotes || []}
          columns={columns}
          filterInput={true}
          botonera={true}
          records={quotes?.length || 0}
        />
      )}
    </div>
  );
};

export default QuoteListScreen;
