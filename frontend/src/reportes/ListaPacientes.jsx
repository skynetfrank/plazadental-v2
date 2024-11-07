import React, { useEffect, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import { useNavigate } from "react-router-dom";


function ListaPacientes() {
  const navigate = useNavigate("");
  const [pacientes] = useState(JSON.parse(localStorage.getItem("pacientes")));;
  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    { header: "Cedula", accessorKey: "cedula" },
    { header: "Telefono", accessorKey: "celular" },
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

  return (
    <div>
      <h2 className="centrado">Pacientes</h2>
      {pacientes.length === 0 ? (
        <span>No Hay Datos.......</span>
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
