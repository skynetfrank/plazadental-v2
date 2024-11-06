import React, { useEffect, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

//   https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/getallclients

function ReporteClientes() {
  const navigate = useNavigate("");
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xerror, setXerror] = useState(false);

  useEffect(() => {
    fetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/getallclients"
    )
      .then((response) => response.json())
      .then((data) => {
        setClientes(data);
        setLoading(false);
      })
      .catch((error) => setXerror(true));
  }, []);

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    { header: "Rif/Cedula", accessorKey: "rif" },
    { header: "Telefono", accessorKey: "celular" },
    { header: "Direccion", accessorKey: "direccion" },
    {
      header: "Creado",
      accessorKey: "timestamp",
      cell: (value) => {
        return dayjs(new Date(value.getValue())).format("DD/MM/YYYY");
      },
    },
    {
      header: "Editar",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <button
            className="edit-cliente-btn"
            onClick={() => navigate(`/cliente/${_id}/edit`)}>
            editar
          </button>
        );
      },
    },
  ];
  console.log("clientes", clientes);
  return (
    <div>
      <h2 className="centrado">CLIENTES</h2>
      {loading ? (
        <span>descargando datos del Servidor...</span>
      ) : (
        <>
          <div>
            <div>
              {clientes ? (
                <SimpleTable
                  data={clientes}
                  columns={columns}
                  filterInput={true}
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

export default ReporteClientes;

//onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
