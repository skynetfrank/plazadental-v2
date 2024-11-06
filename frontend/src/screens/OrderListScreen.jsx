import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleTable from "../components/SimpleTable";
import dayjs from "dayjs";

export default function OrderListScreen(props) {
  const navigate = useNavigate("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xerror, setXerror] = useState(false);

  useEffect(() => {
    fetch("https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/allorderschacao")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
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
    {
      header: "Cliente",
      accessorKey: "clienteInfo.nombre",
    },
    {
      header: "Monto",
      accessorKey: "totalItems",
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },
    {
      header: "Descuento",
      accessorKey: "descuento",
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },
    {
      header: "Delivery",
      accessorKey: "delivery",
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },
    {
      header: "Total",
      accessorKey: "subtotal",
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },

    {
      header: "Detalle",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <button className="edit-cliente-btn" onClick={() => navigate(`/order/${_id}`)}>
            Ver{" "}
          </button>
        );
      },
    },
  ];
  return (
    <div>
      <h2 className="centrado">Ventas Registradas</h2>
      {loading ? (
        <span>descargando datos del Servidor...</span>
      ) : (
        <>
          <div>
            <div>
              {orders ? <SimpleTable data={orders} columns={columns} filterInput={true} botonera={true} /> : ""}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
