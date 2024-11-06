import { useEffect, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function ReporteReposiciones() {
  const navigate = useNavigate("");
  const [reposiciones, setReposiciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xerror, setXerror] = useState(false);

  useEffect(() => {
    fetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/allreposiciones"
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setReposiciones(data);
      })
      .catch((error) => setXerror(true));
  }, []);

  const columns = [
    {
      header: "Fecha",
      accessorKey: "fecha",
      cell: (value) => {
        return dayjs(new Date(value.getValue())).format("DD/MM/YYYY");
      },
    },
    { header: "ID-Reposicion", accessorKey: "_id" },

    { header: "Unidades", accessorKey: "totalUnidades" },
    {
      header: "status",
      accessorKey: "procesado",
      cell: (value) => {
        return value.getValue() === true ? "Procesado" : "Pendiente";
      },
    },
    {
      header: "Detalle",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <button onClick={() => navigate(`/reposicion/${_id}`)}>
            Ver Detalle
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <h3 className="centrado">REPOSICIONES DE MERCANCIA</h3>
      {loading ? (
        <span>descargando datos del Servidor...</span>
      ) : (
        <>
          <div>
            <div>
              {reposiciones ? (
                <SimpleTable
                  data={reposiciones}
                  columns={columns}
                  botonera={true}
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

export default ReporteReposiciones;

//onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
