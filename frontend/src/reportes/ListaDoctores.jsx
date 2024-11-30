import { useDispatch, useSelector } from "react-redux";
import SimpleTable from "../components/SimpleTable";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import InfoIcon from "../icons/InfoIcon";
import PacienteAddIcon from "../icons/PacienteAddIcon";
import ToolTip from "../components/ToolTip";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";
import { listDoctores } from "../actions/doctorActions";


function ListaDoctores() {
  const navigate = useNavigate("");
  const doctorList = useSelector((state) => state.doctorList);
  const { loading, doctores, count } = doctorList;
  const dispatch = useDispatch();


  useEffect(() => {
    if (!doctores || doctores.length === 0) {
      dispatch(listDoctores({}));
    }
  }, [dispatch, doctores])


  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    { header: "Cedula", accessorKey: "cedula" },
    { header: "Telefono", accessorKey: "celular" },
    { header: "Especialidad", accessorKey: "especialidad" },
    {
      header: "Comision", accessorKey: "tasaComisionDoctor",
      cell: (value) => {
        return value.getValue() * 100 + "%"
      }
    },

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
                  navigate(`/doctor/${_id}`);
                }}>
                <InfoIcon />
              </button>
            </ToolTip>
            <ToolTip text="Editar">
              <button
                className="circle-btn"
                onClick={() => navigate(`/doctor/${_id}/edit`)}>
                <EditIcon />
              </button>
            </ToolTip>

            <ToolTip text="Eliminar">
              <button
                className="circle-btn"
                onClick={() => navigate(`/controles/${_id}/edit`)}>
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
        <h2>Doctores</h2>
        <ToolTip text="Agregar Doctor">
          <Link to='/creardoctor'>
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
              {doctores ? (
                <SimpleTable
                  data={doctores}
                  columns={columns}
                  filterInput={true}
                  botonera={true}
                  records={doctores.length || 0}
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

export default ListaDoctores;

//onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
