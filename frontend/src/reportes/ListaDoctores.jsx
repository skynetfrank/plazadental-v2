import { useDispatch, useSelector } from "react-redux";
import SimpleTable from "../components/SimpleTable";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PacienteAddIcon from "../icons/PacienteAddIcon";
import ToolTip from "../components/ToolTip";
import EditIcon from "../icons/EditIcon";
import { listDoctores } from "../actions/doctorActions";

function ListaDoctores() {
  const navigate = useNavigate("");
  const doctorList = useSelector((state) => state.doctorList);
  const { loading, doctores } = doctorList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listDoctores({}));
  }, [dispatch]);

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    { header: "Cedula", accessorKey: "cedula" },
    { header: "Telefono", accessorKey: "celular" },
    { header: "Especialidad", accessorKey: "especialidad" },
    { header: "# Colegio", accessorKey: "numeroColegio" },
    {
      header: "Comision",
      accessorKey: "tasaComisionDoctor",
      cell: (value) => {
        return value.getValue() * 100 + "%";
      },
    },

    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <div className="flx pad-0">
            <ToolTip text="Editar">
              <button className="circle-btn" onClick={() => navigate(`/doctor/${_id}/edit`)}>
                <EditIcon />
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
          <Link to="/creardoctor">
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


