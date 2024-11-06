import { useEffect, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

export default function TopVeinteScreen() {
  const [topZapatos, setTopZapatos] = useState([]);
  const [topClientes, setTopclientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/top20chacao"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setTopZapatos(data.topZapatos);
        setTopclientes(data.topClientes);
        setLoading(false);
      })
      .catch((error) => setError(true));
  }, []);

  console.log("topZapatos:", topZapatos, "topclientes:", topClientes);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="flx jcenter abase-top pad-0 gap10">
      {" "}
      <div className="m-2 border-1 bg-color">
        <h3 className="m-2 centrado">TOP 20 MAS VENDIDOS</h3>
        <div className="top10">
          {topZapatos.map((m, index) => {
            return (
              <div key={index} className="flx column border-1">
                <div className="flx gap font-1">
                  <span>{index + 1}</span>
                  <span>{m._id}</span>
                  <span>vendidos:{m.vendidos}</span>
                </div>
                <img
                  className="top-img border-1"
                  src={m.marcas[0]}
                  alt="imagen"></img>
              </div>
            );
          })}
        </div>
      </div>
      <div className="m-2 border-1 bg-color">
        <h3 className="m-2 centrado">TOP 20 CLIENTES</h3>
        <div className="top10">
          {topClientes.map((m, index) => {
            if (m._id === "V000000000") {
              return "";
            }
            return (
              <div key={index} className="flx jsb gap border-1 font-1">
                <p>{index}</p>
                <div className="flx jsb gap minw-220">
                  <span>{m.marcas[0]}</span>
                  <span>{m.numOrders + " compras"}</span>
                </div>
                <span>${m.monto}</span>{" "}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
