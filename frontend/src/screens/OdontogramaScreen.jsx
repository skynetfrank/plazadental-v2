import React from "react";
import { useParams } from "react-router-dom";
import Odontograma from "../odograma/Odontograma";

const OdontogramaScreen = () => {
  // Obtener los parámetros de la URL
  const { odogramaId, nombre, apellido } = useParams();


  const handleCerrarOdontograma = () => {
    console.log("El componente hijo ha solicitado cerrar.");
    alert("Cerrando Odontograma. Revisa la consola para más detalles.");
  };
  const cloudinary = odogramaId ? "https://res.cloudinary.com/plazasky/image/upload/v1661258482/odontogramas/" + odogramaId + ".jpg" : "";
  const imageID = odogramaId;
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Odontograma
        idPaciente={odogramaId}
        nombrePaciente={nombre}
        apellidoPaciente={apellido}
        onCerrar={handleCerrarOdontograma}
        imageUrl={cloudinary}
        imageID={imageID}
      />
    </div>
  );
};

export default OdontogramaScreen;
