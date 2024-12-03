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
import ListaPacientes from "./reportes/ListaPacientes";
import PacienteScreen from "./screens/PacienteScreen";
import ControlesScreen from "./screens/ControlesScreen";
import PacienteCreateScreen from "./screens/PacienteCreateScreen";
import ControlCreateScreen from "./screens/ControlCreateScreen";
import ListaDoctores from "./reportes/ListaDoctores";
import ListaServicios from "./reportes/ListaServicios";
import CuadreDiarioScreen from "./screens/CuadreDiarioScreen";
import ReporteCuadres from "./reportes/ReporteCuadres";
import PacienteEditScreen from "./screens/PacienteEditScreen";
import DoctorEditScreen from "./screens/DoctorEditScreen";
import DoctorCreateScreen from "./screens/DoctorCreateScreen";
import ServicioCreateScreen from "./screens/ServicioCreateScreen";
import PrintFacturaScreen from "./screens/PrintFacturaScreen";
import PrintRecipeScreen from "./screens/PrintRecipeScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomeScreen />}></Route>
      <Route path="/signin" element={<SigninScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>

      <Route path="" element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfileScreen />}></Route>
        <Route path="/crearpaciente" element={<PacienteCreateScreen />}></Route>
        <Route path="/creardoctor" element={<DoctorCreateScreen />}></Route>
        <Route path="/crearservicio" element={<ServicioCreateScreen />}></Route>
        <Route path="/listapacientes" element={<ListaPacientes />}></Route>
        <Route path="/listadoctores" element={<ListaDoctores />}></Route>
        <Route path="/listaservicios" element={<ListaServicios />}></Route>
        <Route path="/paciente/:id" element={<PacienteScreen />}></Route>
        <Route path="/paciente/:id/edit" element={<PacienteEditScreen />}></Route>
        <Route path="/doctor/:id/edit" element={<DoctorEditScreen />}></Route>
        <Route path="/controles/:id" element={<ControlesScreen />}></Route>
        <Route path="/crearcontrol/:id" element={<ControlCreateScreen />}></Route>{" "}
        <Route path="/cuadreventas/:id" element={<CuadreDiarioScreen />} />
        <Route path="/listacuadres" element={<ReporteCuadres />} />
        <Route path="/printfactura/:id" element={<PrintFacturaScreen />} exact></Route>
        <Route path="/printrecipe/:id" element={<PrintRecipeScreen />} exact></Route>
      </Route>
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
