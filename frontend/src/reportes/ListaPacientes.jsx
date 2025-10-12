import { useDispatch, useSelector } from "react-redux";
import SimpleTable from "../components/SimpleTable";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteControlPaciente, deletePaciente, listPacientes } from "../actions/pacienteActions";
import InfoIcon from "../icons/InfoIcon";
import PacienteAddIcon from "../icons/PacienteAddIcon";
import ToolTip from "../components/ToolTip";
import EditIcon from "../icons/EditIcon";
import ControlIcon from "../icons/ControlIcon";
import TrashIcon from "../icons/TrashIcon";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function ListaPacientes() {
  const navigate = useNavigate("");

  const pacienteList = useSelector((state) => state.pacienteList);
  const { loading, pacientes } = pacienteList;

  const pacienteDelete = useSelector((state) => state.pacienteDelete);
  const { error: errorDelete, success: successDelete } = pacienteDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!pacientes) {
      dispatch(listPacientes({}));
    }
  }, [dispatch, pacientes]);

  useEffect(() => {
    if (successDelete) {
      Swal.fire({
        title: "Eliminar Paciente",
        text: "Paciente Ha sido Eliminado con exito",
      });
      dispatch(listPacientes({}));
    }
  }, [dispatch, successDelete]);
  const cloudinaryx = "https://res.cloudinary.com/plazasky/image/upload/v1661258482/odontogramas/";
  const deleteHandler = (id, controles) => {
    if (controles > 0) {
      Swal.fire({
        title: "Eliminar Paciente",
        text: "Paciente tiene controles asignados, No se puede eliminar",
      });
      return;
    }
    Swal.fire({
      title: "Eliminar Paciente",
      text: "Esta seguro de Eliminar Este Paciente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      console.log("result.value", result);
      if (result.isDismissed) {
        return;
      }
      //new way for delete
      Swal.fire({
        title: "Eliminar Control",
        input: "password",
        inputLabel: "Password",
        inputPlaceholder: "Ingrese su clave",
        inputAttributes: {
          maxlength: "10",
          autocapitalize: "off",
          autocorrect: "off",
        },
      }).then((result) => {
        if (result.value !== "matias01") {
          Swal.fire({
            title: "Clave Erronea, verifique...",
            text: "Ingrese Su Clave de Administrador",
            icon: "warning",
          });
          return;
        }
        if (result.value === "matias01") {
          dispatch(deletePaciente(id));

          Swal.fire({
            title: "Control Eliminado!",
            text: "Eliminar Control",
            icon: "success",
          });
        }
      });

      //hasta aqui new way

      //let password= prompt("Ingrese su clave", "");
    });
    console.log("eliminar:", id, controles);
  };

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      header: "Apellidos",
      accessorKey: "apellido",
    },
    { header: "Cedula", accessorKey: "cedula" },
    { header: "Telefono", accessorKey: "celular" },
    {
      header: "odograma URL",
      accessorKey: "idPacienteOld",
    },
    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id, controles } = value.row.original;
        return (
          <div className="flx pad-0">
            <ToolTip text="Ver Informacion del Paciente">
              <button
                className="circle-btn"
                onClick={() => {
                  navigate(`/paciente/${_id}`);
                }}
              >
                <InfoIcon />
              </button>
            </ToolTip>
            <ToolTip text="Editar Paciente">
              <button className="circle-btn" onClick={() => navigate(`/paciente/${_id}/edit`)}>
                <EditIcon />
              </button>
            </ToolTip>
            <ToolTip text={"Ver Controles (" + controles.length + ")"}>
              <button className="circle-btn" onClick={() => navigate(`/controles/${_id}`)}>
                <ControlIcon />
              </button>
            </ToolTip>
            <ToolTip text="Eliminar Paciente">
              <button className="circle-btn" onClick={() => deleteHandler(_id, controles.length)}>
                <TrashIcon />
              </button>
            </ToolTip>
          </div>
        );
      },
    },
  ];
  console.log("pacientes:", pacientes);
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
        <Loader txt={"Obteniendo Pacientes"} />
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
