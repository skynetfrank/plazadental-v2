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


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomeScreen />}></Route>
      <Route path="/signin" element={<SigninScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>

      <Route path="" element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfileScreen />}></Route>
        <Route path="/listapacientes" element={<ListaPacientes />}></Route>
        <Route path="/paciente/:id" element={<PacienteScreen />}></Route>
        <Route path="/controles/:id" element={<ControlesScreen />}></Route>
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
