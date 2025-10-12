import React from "react";
import Odontograma from "../odograma/Odontograma";


const OdontogramaScreen = () => {
  // Datos de ejemplo para pasar como props al componente Odontograma
  const pacienteInfo = {
    id: "PAC-001",
    nombre: "Carlos",
    apellido: "Sanchez",
  };

  // Función de ejemplo que se pasará como prop `onCerrar`
  const handleCerrarOdontograma = () => {
    console.log("El componente hijo ha solicitado cerrar.");
    alert("Cerrando Odontograma. Revisa la consola para más detalles.");
  };

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
        idPaciente={pacienteInfo.id}
        nombrePaciente={pacienteInfo.nombre}
        apellidoPaciente={pacienteInfo.apellido}
        onCerrar={handleCerrarOdontograma}
      />
    </div>
  );
};

export default OdontogramaScreen;
