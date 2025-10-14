import { useParams } from "react-router-dom";
import Odontograma from "../odograma/Odontograma";

const OdontogramaScreen = () => {
  // Obtener los parámetros de la URL configurada en main.jsx : path="/odontograma/:mode/:nombre/:idPaciente/:imageUrl"
  const { idPaciente, nombre, imageUrl } = useParams();

  const handleCerrarOdontograma = () => {
    alert("Cerrando Odontograma. Revisa la consola para más detalles.");
  };

  return <Odontograma
    key={idPaciente} // ¡LA CLAVE! Esto fuerza el reinicio del componente al cambiar de paciente
    idPaciente={idPaciente}
    nombrePaciente={nombre}
    imageUrl={imageUrl}
    onCerrar={handleCerrarOdontograma}
  />;
};

export default OdontogramaScreen;
