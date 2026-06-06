import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SimpleTable from "../components/SimpleTable";
import { Link, useNavigate } from "react-router-dom";
import InfoIcon from "../icons/InfoIcon";
import ToolTip from "../components/ToolTip";
import Loader from "../components/Loader";
import { listControles } from "../actions/controlActions";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTimes, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function ListaControles() {
  const navigate = useNavigate("");
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));

  const controlList = useSelector((state) => state.controlList);
  const { loading, controles, pages, page, total } = controlList;
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== debouncedSearch) {
      setIsDebouncing(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStartDate(dayjs().startOf("month").format("YYYY-MM-DD"));
    setEndDate(dayjs().endOf("month").format("YYYY-MM-DD"));
    setIsDebouncing(false);
    setPageNumber(1);
  };

  const setToday = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setStartDate(today);
    setEndDate(today);
    setPageNumber(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsDebouncing(false);
      setPageNumber(1);
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(listControles({ pageNumber, search: debouncedSearch, startDate, endDate }));
  }, [dispatch, pageNumber, debouncedSearch, startDate, endDate]);

  const columns = [
    {
      header: "Fecha",
      accessorKey: "fechaControl",
      cell: (info) => {
        return dayjs(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "Nombre",
      accessorKey: "paciente.nombre",
      cell: (value) => {
        return (
          <div className="td-nombre-paciente"><span>{value.getValue()}</span></div>
        )
      },
    },
    {
      header: "Apellido",
      accessorKey: "paciente.apellido",
      cell: (value) => {
        return (
          <div className="td-nombre-paciente"><span>{value.getValue()}</span></div>
        )
      },
    },
    {
      header: "Evaluacion",
      accessorKey: "evaluacion",
      cell: (value) => {
        if (!value.getValue()) {
          return "Pendiente"
        }
        return (
          <div className="td-eval"><span>{value.getValue()}</span></div>
        )
      },
    },
    {
      header: "Tratamiento",
      accessorKey: "tratamiento",
      cell: (value) => {
        if (!value.getValue()) {
          return "Pendiente"
        }
        return (
          <div className="td-eval"><span>{value.getValue()}</span></div>
        )
      },
    },
    {
      header: "Monto",
      accessorKey: "montoUsd",
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },

    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id, controles } = value.row.original;
        return (
          <div className="flx pad-0">
            <ToolTip text="Ver Control">
              <button
                className="circle-btn"
                onClick={() => {
                  navigate(`/detalle-control/${_id}`);
                }}
              >
                <InfoIcon />
              </button>
            </ToolTip>
            <ToolTip text="Editar Control">
              <button
                className="circle-btn"
                onClick={async () => {
                  const { value: pw } = await Swal.fire({
                    title: "Clave de Autorizacion",
                    input: "password",
                    inputAttributes: {
                      maxlength: "10",
                      autocapitalize: "off",
                      autocorrect: "off",
                    },
                  });
                  if (pw !== "matias01") {
                    Swal.fire("Clave Incorrecta! Verifique!");
                    return;
                  }
                  if (pw === "matias01") {
                    navigate(`/control/${_id}/edit`);
                  }
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            </ToolTip>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flx jcenter gap1 pad-0">
        {" "}
        <h3>Listado de Controles</h3>
      </div>

      {loading ? (
        <Loader txt={"Obteniendo Controles"} />
      ) : (
        <div className="tankstack-pagination-container">
          <div className="flx jcenter gap wrap pad-1" style={{ alignItems: 'flex-end' }}>
            <div className="flx gap1" style={{ alignItems: 'flex-end' }}>
              <div className="flx column astart">
                <label className="font-tiny negrita">Desde:</label>
                <input type="date" className="input-modern" style={{ padding: '5px 10px', height: '38px', width: 'auto' }} value={startDate} onChange={(e) => { setStartDate(e.target.value); setPageNumber(1); }} />
              </div>
              <div className="flx column astart">
                <label className="font-tiny negrita">Hasta:</label>
                <input type="date" className="input-modern" style={{ padding: '5px 10px', height: '38px', width: 'auto' }} value={endDate} onChange={(e) => { setEndDate(e.target.value); setPageNumber(1); }} />
              </div>
              <button
                className="btn-modern"
                style={{ height: '38px', padding: '0 15px', margin: '0', backgroundColor: '#203040', color: 'white', fontSize: '1.2rem' }}
                onClick={setToday}
              >
                Hoy
              </button>
            </div>

            <div className="flx column astart">
              <label className="font-tiny negrita" style={{ visibility: 'hidden' }}>Buscador</label>
              <div className="pos-rel flx">
                <input
                  type="text"
                  className="filter-input-v8"
                  style={{ margin: 0, height: '25px' }}
                  placeholder="Buscar por paciente, evaluación o tratamiento..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="pos-abs flx" style={{ right: '15px', height: '100%', top: 0 }}>
                  {isDebouncing && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="azul-brand" />
                  )}
                  {searchTerm && !isDebouncing && (
                    <button
                      className="btn-clear"
                      onClick={clearSearch}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {controles && (
            <>
              <SimpleTable
                data={controles}
                columns={columns}
                filterInput={false}
                botonera={false}
                records={total}
              />

              <div className="tankstack-pagination-botonera">
                <button
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber(prev => prev - 1)}
                >
                  Anterior
                </button>
                <span className="pagination-totalpages">Página {page} de {pages}</span>
                <button
                  disabled={pageNumber === pages}
                  onClick={() => setPageNumber(prev => prev + 1)}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ListaControles;
