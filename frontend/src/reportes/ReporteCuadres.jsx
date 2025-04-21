import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SimpleTable from "../components/SimpleTable";
import { groupByDay } from "../actions/controlActions";
import CuadreIcon from "../icons/CuadreIcon";

function ReporteCuadres() {
  const navigate = useNavigate("");
  const dispatch = useDispatch();

  const groupDay = useSelector((state) => state.orderGroupDay);
  const { loading, dailyControles, dailyAbonos } = groupDay;

  useEffect(() => {
    dispatch(groupByDay());
  }, [dispatch]);

  const parseFecha = (fecha) => {
    const dia = fecha.toString().substr(8, 2);
    const mes = fecha.toString().substr(5, 2);
    const ano = fecha.toString().substr(0, 4);
    const xfecha = dia + "-" + mes + "-" + ano;
    return xfecha;
  };

  const columns = [
    {
      header: "Dia",
      accessorKey: "_id",
      cell: (value) => {
        return parseFecha(new Date(value.getValue()).toISOString());
      },
    },

    {
      header: "Controles",
      accessorKey: "controles",
      cell: (value) => {
        const { nabonos } = value.row.original;
        console.log("nabonos", nabonos);
        return value.getValue();
      },
    },
    {
      header: "Monto US$",
      accessorKey: "monto",
      cell: (value) => {
        const { nabonos } = value.row.original;
        console.log("nabonos", nabonos);
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },

    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <div className="flx pad-0">
            {" "}
            <button className="btn-icon-container" onClick={() => navigate(`/cuadreventas/${_id}`)}>
              <CuadreIcon />
              <p className="negrita azul-marino font-1">Reporte</p>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flx jcenter">
        <h2 className="centrado">Reporte de Controles Diarios</h2>
      </div>

      {loading ? (
        <span>descargando datos del Servidor...</span>
      ) : (
        <>
          <div>
            <div>
              {dailyControles ? (
                <SimpleTable data={dailyControles} columns={columns} filterInput={false} botonera={true} />
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

export default ReporteCuadres;
