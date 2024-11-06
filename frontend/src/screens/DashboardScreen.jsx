import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { summaryOrder } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import PeopleIcon from "../icons/PeopleIcon";
import InvoiceDollarIcon from "../icons/InvoiceDollarIcon";
import ClockIcon from "../icons/ClockIcon";
import CardDollarIcon from "../icons/CardDollarIcon";
import BoxesStackedIcon from "../icons/BoxesStackedIcon";
import HandDollarIcon from "../icons/HandDollarIcon";

export default function DashboardScreen() {
  const orderSummary = useSelector((state) => state.orderSummary);
  const [avgDays] = useState(Math.round((new Date() - new Date("03/01/2024").getTime()) / (1000 * 3600 * 24)));
  const { loading, summary, error } = orderSummary;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(summaryOrder());
  }, [dispatch]);

  return (
    <div>
      <div>
        <h1 className="centrado">Dashboard</h1>
      </div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="dash-container">
            <div className="dash-card">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Ventas</h6>
                  <p>Ingreso Total</p>
                  <h3 id="total-ingresos">$ {Number(summary.orders[0].totalSales).toFixed(2)}</h3>
                </div>
                <div className="dash-info-image">
                  <HandDollarIcon />
                </div>
              </div>
            </div>
            <div className="dash-card">
              <p className="fecha-avg"> desde el 01-03-2024</p>
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6 className="h6-small">Ventas Promedios</h6>
                  <div className="avg-container">
                    <div className="promedios">
                      <h5>Diario:</h5>
                      <span>${Number(summary.orders[0].totalSales / avgDays).toFixed(2)}</span>
                    </div>
                    <div className="promedios">
                      <h5>Semanal:</h5>
                      <span>${Number(summary.orders[0].totalSales / (avgDays / 7)).toFixed(2)}</span>
                    </div>
                    <div className="promedios">
                      <h5>Mensual:</h5>
                      <span>${Number(summary.orders[0].totalSales / (avgDays / 30)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="dash-info-image">
                  <ClockIcon />;<p>{Number(avgDays).toFixed(0)} dias</p>
                  <p>{Number(avgDays / 7).toFixed(1)} semanas</p>
                  <p>{Number(avgDays / 30).toFixed(1)} meses</p>
                </div>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Ventas</h6>
                  <p>Despachadas</p>
                  <h3>{summary.orders[0].numOrders}</h3>
                </div>
                <div className="dash-info-image">
                  <InvoiceDollarIcon />;
                </div>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Clientes</h6>
                  <p>Registrados</p>
                  <h3 id="total-pacientes">{summary.clientes[0].numClientes}</h3>
                </div>
                <div className="dash-info-image">
                  <PeopleIcon />
                </div>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Inventario</h6>
                  <p>Existencia Articulos</p>
                  <h3>{summary.paresZapatos[0].existenciaActual}</h3>
                </div>
                <div className="dash-info-image">
                  <BoxesStackedIcon />;
                </div>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Inventario</h6>
                  <p>Valor Actual</p>
                  <span>No Disponible</span>
                </div>
                <div className="dash-info-image">
                  <CardDollarIcon />;
                </div>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-info">
                <div className="dash-info-detail">
                  <h6>Inventario</h6>
                  <p>Costo Actual</p>
                  <span>No Disponible</span>
                </div>
                <div className="dash-info-image">
                  <CardDollarIcon />;
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
