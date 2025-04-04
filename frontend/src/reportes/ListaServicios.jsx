import { useDispatch, useSelector } from "react-redux";
import SimpleTable from "../components/SimpleTable";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ToolTip from "../components/ToolTip";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";
import { listServicios } from "../actions/servicioActions";
import AddCircleIcon from "../icons/AddCircleIcon";
import ExcelExport from "../components/ExcelExport";
import dayjs from "dayjs";


function ListaServicios() {
  const navigate = useNavigate("");
  const [jsonforexcel, setJsonforexcel] = useState([]);
  const servicioList = useSelector((state) => state.servicioList);
  const { loading, servicios } = servicioList;
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  useEffect(() => {
    if (!servicios || servicios.length === 0) {
      dispatch(listServicios());
    }
    if (servicios) {
      const data = servicios.map((x) => {
        return {
          codigo: x.codigo,
          nombre: x.nombre,
          area: x.area,
          descripcion: x.descripcion,
          preciousd: x.preciousd,

        };

      });
      setJsonforexcel(data.flat());
    }
  }, [dispatch, servicios]);

  const columns = [
    {
      header: "Codigo",
      accessorKey: "codigo",
    },
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    { header: "Area", accessorKey: "area" },
    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id, servicios } = value.row.original;
        return (
          <div className="flx pad-0">
            {userInfo.isAdmin ? (
              <ToolTip text="Editar">
                <button className="circle-btn" onClick={() => navigate(`/servicio/${_id}/edit`)}>
                  <EditIcon />
                </button>
              </ToolTip>
            ) : (
              ""
            )}
            {userInfo.isAdmin ? (
              <ToolTip text="Eliminar">
                <button className="circle-btn" onClick={() => navigate(`/controles/${_id}/edit`)}>
                  <TrashIcon />
                </button>
              </ToolTip>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flx jcenter gap1 pad-0">
        <h2>Servicios</h2>
        <ToolTip text="Agregar Doctor">
          <Link to="/crearservicio">
            <AddCircleIcon />
          </Link>
        </ToolTip>
        <div>
          <ExcelExport data={jsonforexcel} fileName={"servicios " + dayjs(new Date()).format("DD-MM-YYYY")} />
        </div>
      </div>

      {loading ? (
        <span>Cargando Datos....</span>
      ) : (
        <>
          <div>
            <div>
              {servicios ? (
                <SimpleTable
                  data={servicios}
                  columns={columns}
                  filterInput={true}
                  botonera={true}
                  records={servicios.length || 0}
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

export default ListaServicios;
