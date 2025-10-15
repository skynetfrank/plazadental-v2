import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButtons from "./ActionButtons";
import { useOdontogramaCanvas } from "./useOdontogramaCanvas";

// --- CONSTANTES ---
const SIN_SELECCION = 0;

// eslint-disable-next-line react/prop-types
const Odontograma = ({ idPaciente, nombrePaciente, imageUrl, onCerrar }) => {
  const navigate = useNavigate();

  const [currentColor, setCurrentColor] = useState("#343A40"); // Nuevo color por defecto
  const [currentAction, setCurrentAction] = useState(SIN_SELECCION);
  const [currentSize, setCurrentSize] = useState(3);

  const {
    canvasRef,
    cursorStyle,
    isSaving,
    showBackdrop,
    redoStack,
    setShowBackdrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleUndo,
    handleRedo,
    handleClearCanvas,
    handleDownload,
    handlePrint,
    handleSaveToCloudinary,
  } = useOdontogramaCanvas({
    idPaciente,
    nombrePaciente,
    imageUrl,
    currentAction,
    currentColor,
    currentSize,
  });

  return (
    <div className="child__container">
      <button id="btn-cerrar" onClick={() => navigate(-1)}>
        Volver
      </button>
      <div className="odograma__container">
        <ActionButtons
          currentAction={currentAction}
          setCurrentAction={setCurrentAction}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          currentSize={currentSize}
          setCurrentSize={setCurrentSize}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          redoStack={redoStack}
          handleClearCanvas={handleClearCanvas}
          handleDownload={handleDownload}
          handleSaveToCloudinary={handleSaveToCloudinary}
          isSaving={isSaving}
          handlePrint={handlePrint}
          setShowBackdrop={setShowBackdrop}
        />
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            id="canvas"
            style={{ cursor: cursorStyle }} // Aplicar el estilo del cursor dinámicamente
            onMouseDown={handleMouseDown} // Evento para mouse
            onMouseMove={handleMouseMove} // Evento para mouse
            onMouseUp={handleMouseUp} // Evento para mouse
            onMouseLeave={handleMouseUp} // Reutilizamos mouseUp para detener el dibujo si el mouse sale
          />
          {/* --- INICIO: Spinner de Carga --- */}
          {isSaving && (
            <div className="myspinner-container" style={{ display: "flex" }}>
              <div className="myspinner-text" data-spintext="Guardando..."></div>
              <div className="myspinner-sector myspinner-sector-blue"></div>
              <div className="myspinner-sector myspinner-sector-red"></div>
              <div className="myspinner-sector myspinner-sector-green"></div>
            </div>
          )}
          {/* --- FIN: Spinner de Carga --- */}
        </div>
        {showBackdrop && (
          <div className="backdrop" onClick={() => setShowBackdrop(false)}>
            <img
              src={canvasRef.current.toDataURL("image/jpeg", 1.0)}
              alt="Odontograma"
              className="backdrop-image"
              onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el backdrop
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Odontograma;
