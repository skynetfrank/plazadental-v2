import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import SigninScreen from "./screens/SigninScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderListScreen from "./screens/OrderListScreen";
import ConteoRapido from "./screens/ConteoRapido";
import ClienteNewScreen from "./screens/ClienteNewScreen";
import ReposicionScreen from "./screens/ReposicionScreen.jsx";
import DashboardScreen from "./screens/DashboardScreen.jsx";
import GroupingProductosScreen from "./reportes/GroupingProductosScreen.jsx";
import AjusteCreateScreen from "./screens/AjusteCreateScreen.jsx";
import AjusteScreen from "./screens/AjusteScreen.jsx";
import CuadrecajaCreateScreen from "./screens/CuadrecajaCreateScreen.jsx";
import ReporteClientes from "./reportes/ReporteClientes.jsx";
import PrintCuadrecajaScreen from "./screens/PrintCuadrecajaScreen.jsx";
import ProductEditScreen from "./screens/ProductEditScreen.jsx";
import ClienteEditScreen from "./screens/ClienteEditScreen.jsx";
import ProductListScreen from "./screens/ProductListScreen.jsx";
import Facturacion from "./screens/Facturacion.jsx";
import TopVeinteScreen from "./screens/TopVeinteScreen.jsx";
import GastoCreateScreen from "./screens/GastoCreateScreen.jsx";
import ReporteGastos from "./reportes/ReporteGastos.jsx";
import GastoEditScreen from "./screens/GastoEditScreen.jsx";
import GastoPrintScreen from "./screens/GastoPrintScreen.jsx";
import ReporteReposiciones from "./reportes/ReporteReposiciones.jsx";
import ReporteCuadres from "./reportes/ReporteCuadres.jsx";
import CuadreDiarioScreen from "./screens/CuadreDiarioScreen.jsx";
import ReporteAjustes from "./reportes/ReporteAjustes.jsx";
import ProductoSearchScreen from "./screens/ProductoSearchScreen.jsx";
import ReporteEmpleados from "./reportes/ReporteEmpleados.jsx";
import EmpleadoView from "./screens/EmpleadoView.jsx";
import EmpleadoCreateScreen from "./screens/EmpleadoCreateScreen.jsx";
import EmpleadoEditScreen from "./screens/EmpleadoEditScreen.jsx";
import GroupingCashea from "./reportes/GroupingCashea.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomeScreen />}></Route>
      <Route path="/verproductos" element={<ProductListScreen />}></Route>
      <Route path="/signin" element={<SigninScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>
      <Route path="/pageNumber/:pageNumber" element={<HomeScreen />}></Route>

      <Route path="" element={<ProtectedRoute />}>
        <Route path="/crearajuste" element={<AjusteCreateScreen />}></Route>
        <Route path="/ajustelist" element={<ReporteAjustes />}></Route>
        <Route path="/profile" element={<ProfileScreen />}></Route>
        <Route path="/addcliente" element={<ClienteNewScreen />}></Route>
        <Route path="/order/:id" element={<OrderScreen />}></Route>
        <Route path="/dashboard" element={<DashboardScreen />}></Route>
        <Route path="/ajuste/:id" element={<AjusteScreen />}></Route>
        <Route path="/listaventas" element={<OrderListScreen />}></Route>
        <Route path="/top20" element={<TopVeinteScreen />}></Route>
        <Route path="/conteorapido/:id" element={<ConteoRapido />} />
        <Route path="/reporteclientes" element={<ReporteClientes />}></Route>
        <Route path="/listacuadres" element={<ReporteCuadres />} />
        <Route path="/reposicion/:id" element={<ReposicionScreen />}></Route>
        <Route path="/reposicionlist" element={<ReporteReposiciones />}></Route>
      </Route>
      <Route path="/analiticsproductos" element={<GroupingProductosScreen />} />
      <Route path="/cuadrecaja/:id" element={<CuadrecajaCreateScreen />}></Route>
      <Route path="/printcuadrecaja/:id" element={<PrintCuadrecajaScreen />}></Route>
      <Route path="/product/:id/edit" element={<ProductEditScreen />}></Route>
      <Route path="/cliente/:id/edit" element={<ClienteEditScreen />}></Route>
      <Route path="/facturacion" element={<Facturacion />}></Route>
      <Route path="/cuadreventas/:id" element={<CuadreDiarioScreen />} />
      <Route path="/buscarproducto" element={<ProductoSearchScreen />} />
      <Route path="/creargasto" element={<GastoCreateScreen />}></Route>
      <Route path="/listagasto" element={<ReporteGastos />}></Route>
      <Route path="/gasto/:id/edit" element={<GastoEditScreen />}></Route>
      <Route path="/printgasto/:id" element={<GastoPrintScreen />}></Route>
      <Route path="/listaempleados" element={<ReporteEmpleados />}></Route>
      <Route path="/empleado/:id" element={<EmpleadoView />}></Route>
      <Route path="/crearempleado" element={<EmpleadoCreateScreen />}></Route>
      <Route path="/empleado/:id/edit" element={<EmpleadoEditScreen />}></Route>
      <Route path="/reportecashea" element={<GroupingCashea />}></Route>
    </Route>
  )
);

// eslint-disable-next-line no-undef
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
