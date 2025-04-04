import { useDispatch, useSelector } from "react-redux";
import SimpleTable from "../components/SimpleTable";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import InfoIcon from "../icons/InfoIcon";
import ToolTip from "../components/ToolTip";
import Loader from "../components/Loader";
import { listControles } from "../actions/controlActions";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function ListaControles() {
  const navigate = useNavigate("");
  const controlList = useSelector((state) => state.controlList);
  const { loading, controles } = controlList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listControles({}));
  }, [dispatch]);

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
        <>
          <div>
            <div>
              {controles ? (
                <SimpleTable
                  data={controles}
                  columns={columns}
                  filterInput={true}
                  botonera={true}
                  records={controles.length || 0}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ListaControles;
