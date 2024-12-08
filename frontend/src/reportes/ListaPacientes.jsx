import { useDispatch, useSelector } from "react-redux";
import SimpleTable from "../components/SimpleTable";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { listPacientes } from "../actions/pacienteActions";
import InfoIcon from "../icons/InfoIcon";
import PacienteAddIcon from "../icons/PacienteAddIcon";
import ToolTip from "../components/ToolTip";
import EditIcon from "../icons/EditIcon";
import ControlIcon from "../icons/ControlIcon";
import TrashIcon from "../icons/TrashIcon";

function ListaPacientes() {
  const navigate = useNavigate("");
  const pacienteList = useSelector((state) => state.pacienteList);
  const { loading, pacientes, count } = pacienteList;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!pacientes) {
      dispatch(listPacientes({}));
    }
  }, [dispatch, pacientes]);

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    { header: "Cedula", accessorKey: "cedula" },
    { header: "Telefono", accessorKey: "celular" },
    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id, controles } = value.row.original;
        return (
          <div className="flx pad-0">
            <ToolTip text="Ver Info">
              <button
                className="circle-btn"
                onClick={() => {
                  navigate(`/paciente/${_id}`);
                }}
              >
                <InfoIcon />
              </button>
            </ToolTip>
            <ToolTip text="Editar">
              <button className="circle-btn" onClick={() => navigate(`/paciente/${_id}/edit`)}>
                <EditIcon />
              </button>
            </ToolTip>
            <ToolTip text={"Controles " + controles.length}>
              <button className="circle-btn" onClick={() => navigate(`/controles/${_id}`)}>
                <ControlIcon />
              </button>
            </ToolTip>
            <ToolTip text="Eliminar">
              <button className="circle-btn" onClick={() => navigate(`/controles/${_id}/edit`)}>
                <TrashIcon />
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
        <h2>Pacientes</h2>
        <ToolTip text="Agregar Paciente">
          <Link to="/crearpaciente">
            <button className="circle-btn">
              <PacienteAddIcon />
            </button>
          </Link>
        </ToolTip>
      </div>

      {loading ? (
        <span>Cargando Datos....</span>
      ) : (
        <>
          <div>
            <div>
              {pacientes ? (
                <SimpleTable
                  data={pacientes}
                  columns={columns}
                  filterInput={true}
                  botonera={true}
                  records={pacientes.length || 0}
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

export default ListaPacientes;

//onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
