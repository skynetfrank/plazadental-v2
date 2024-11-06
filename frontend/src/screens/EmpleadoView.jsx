import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { deleteEmpleado, detailsEmpleado } from "../actions/empleadoActions";
import dayjs from "dayjs";
import CogIcon from "../icons/CogIcon";
import EditIcon from "../icons/EditIcon";
import SimpleTable from "../components/SimpleTable";
import ToolTip from "../components/ToolTip";

export default function EmpleadoView(props) {
  const navigate = useNavigate();
  const params = useParams();
  const { id: empleadoId } = params;
  const empleadoDetails = useSelector((state) => state.empleadoDetails);
  const { empleado, loading, error } = empleadoDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsEmpleado(empleadoId));
  }, [dispatch, empleadoId]);

  const calculateAge = (dob) => {
    const date1 = dayjs(dob);
    const date2 = dayjs();
    const diff = date2.diff(date1, "year", true);

    return diff;
  };

  const deleteHandler = (empleado) => {
    if (globalThis.window.confirm("Esta Seguro de Eliminar Este Gasto?")) {
      dispatch(deleteEmpleado(empleado._id));
    }
  };

  const columnsVales = [
    {
      header: "Fecha",
      accessorKey: "fechaEntrega",
      enableSorting: false,
      cell: (value) => {
        return dayjs(new Date(value.getValue())).format("DD/MM/YYYY");
      },
    },
    {
      header: "Monto US$",
      accessorKey: "montousd",
      enableSorting: false,
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },
    {
      header: "Monto Bs.",
      accessorKey: "montobs",
      enableSorting: false,
      cell: (value) => {
        return "Bs." + Number(value.getValue()).toFixed(2);
      },
    },
  ];
  console.log("empleado", empleado?.vales.length);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="flx column">
      <div className="empleado-header">
        <div className="flx pad-0">
          <h2>HOJA DEL EMPLEADO</h2>
          <ToolTip text={"Editar Informacion"}>
            <button
              className="btn-icon-container"
              onClick={() => navigate(`/empleado/${empleado._id}/edit`)}>
              <EditIcon />
            </button>
          </ToolTip>
        </div>

        <div className="flx column">
          <img className="circle" src={empleado.empleadoAvatarUrl}></img>
          <p className="negrita pad-05">
            {empleado.nombre + " " + empleado.apellido}
          </p>
          <p>V-{empleado.cedula}</p>
          <div className="flx gap05 pad-0">
            <p className="font-14">
              {dayjs(empleado.fechaNacimiento).format("DD-MM-YYYY")}
            </p>
            <p className="font-1 negrita">
              {Number(calculateAge(empleado.fechaNacimiento)).toFixed(0) +
                " Años"}
            </p>
          </div>
          <p>{empleado.telefono}</p>
          <p> {empleado.email}</p>
          <details>
            <summary className="negrita">Direccion de Habitacion</summary>
            <p> {empleado.direccion}</p>
          </details>
        </div>
      </div>

      <div className="flx column gap3 astart border-1 b-radius pad-2 bg-color">
        <details>
          <summary>Vales de Nomina</summary>
          <div>
            {empleado?.vales.length > 0 ? (
              <SimpleTable
                data={empleado?.vales}
                columns={columnsVales}
                filterInput={false}
                botonera={true}
              />
            ) : (
              <span className="font-1 ml-2">No Hay Vales Registrados</span>
            )}
          </div>
        </details>
        <details>
          <summary>Prestamos Personales</summary>
        </details>
        <details>
          <summary>Contratos Firmados</summary>
        </details>
      </div>
    </div>
  );
}
