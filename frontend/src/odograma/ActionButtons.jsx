/* eslint-disable react/prop-types */
import React from "react";
import { Undo, Redo, CloudUpload, Printer, Expand } from "lucide-react";

// --- Importación de íconos para la botonera ---
import markerIcon from "./images/marker-icon.png";
import cariesIcon from "./images/caries.png";
import extraccionIcon from "./images/extracion.png";
import ausenteIcon from "./images/ausente.png";
import puentefijoIcon from "./images/puentefijo.png";
import paralelasVIcon from "./images/paralelasV.png";
import paralelasHIcon from "./images/paralelasH.png";
import implanteIcon from "./images/implante.png";
import removibleIcon from "./images/removible.png";
import hipersenseIcon from "./images/hipersense.png";
import apicalIcon from "./images/apical.png";
import fistulaIcon from "./images/fistula.png";
import extrusionIcon from "./images/extrusion.png";
import infraoclusionIcon from "./images/infraoclusion.png";
import inclinacionIcon from "./images/inclinacion.png";
import rotacionIcon from "./images/rotacion.png";
import empaqAlimentosIcon from "./images/empaq-alimentos.png";
import broomIcon from "./images/broom-icon.png";
import downloadIcon from "./images/download-icon.png";

// --- CONSTANTES ---
const MARCAR_EXTRACCION = 1;
const MARCAR_CARIES = 2;
const MARCAR_AREA = 3;
const LINEA_VERTICAL = 5;
const LINEA_HORIZONTAL = 6;
const DIENTE_AUSENTE = 7;
const MARCAR_IMPLANTE = 10;
const MARCAR_PUENTE_FIJO = 13;
const MARCAR_REMOVIBLE = 14;
const MARCAR_HIPERSENSE = 15;
const MARCAR_APICAL = 16;
const MARCAR_FISTULA = 17;
const MARCAR_EMPAQ_ALIMENTO = 18;
const MARCAR_INFRAOCLUSION = 19;
const MARCAR_PROFUNDIDAD_SONDAJE = 20;
const MARCAR_INSERSION_CLINICA = 21;
const MARCAR_SANGRAMIENTO_SONDAJE = 22;
const MARCAR_MUCOSA_MASTICADORA = 23;
const MARCAR_DEFECTO_MUCOGINGIVAL = 24;
const MARCAR_MOVILIDAD_DENTARIA = 25;
const MARCAR_COMPROMISO_FURCACION = 26;
const MARCAR_PROTESIS_DEFECTUOSA = 27;
const MARCAR_FRENILLO = 28;
const MARCAR_EXTRUSION = 29;
const MARCAR_INCLINACION = 30;
const MARCAR_ROTACION = 31;
const MARCAR_SELLANTE = 32;

// --- CONFIGURACIÓN DE BOTONES ---
const actionButtons = [
    { id: "marcador", tip: "Marcador", action: MARCAR_AREA, content: <img src={markerIcon} alt="Marcador" /> },
    { id: "caries", tip: "Caries", action: MARCAR_CARIES, content: <img src={cariesIcon} alt="Caries" /> },
    { id: "sellante", tip: "Sellante", action: MARCAR_SELLANTE, content: "S", className: "font-bold text-xl" },
    { id: "extraccion", tip: "Extraccion", action: MARCAR_EXTRACCION, content: <img src={extraccionIcon} alt="Extraccion" /> },
    { id: "ausente", tip: "Diente Ausente", action: DIENTE_AUSENTE, content: <img src={ausenteIcon} alt="Ausente" /> },
    { id: "puenteFijo", tip: "Puente Fijo", action: MARCAR_PUENTE_FIJO, content: <img src={puentefijoIcon} alt="Puente Fijo" /> },
    { id: "lineaV", tip: "Diastema", action: LINEA_VERTICAL, content: <img src={paralelasVIcon} alt="Diastema" /> },
    { id: "lineaH", tip: "Por Definir", action: LINEA_HORIZONTAL, content: <img src={paralelasHIcon} alt="Por Definir" /> },
    { id: "implante", tip: "Implante", action: MARCAR_IMPLANTE, content: <img src={implanteIcon} alt="Implante" /> },
    { id: "removible", tip: "Removible", action: MARCAR_REMOVIBLE, content: <img src={removibleIcon} alt="Removible" /> },
    { id: "hipersense", tip: "Hipersensibilidad", action: MARCAR_HIPERSENSE, content: <img src={hipersenseIcon} alt="Hipersensibilidad" /> },
    { id: "apical", tip: "Proceso Apical", action: MARCAR_APICAL, content: <img src={apicalIcon} alt="Apical" /> },
    { id: "fistula", tip: "Fistula", action: MARCAR_FISTULA, content: <img src={fistulaIcon} alt="Fistula" /> },
    { id: "extrusion", tip: "Extrusion", action: MARCAR_EXTRUSION, content: <img src={extrusionIcon} alt="Extrusion" /> },
    { id: "infraoclusion", tip: "Infraoclusion", action: MARCAR_INFRAOCLUSION, content: <img src={infraoclusionIcon} alt="Infraoclusion" /> },
    { id: "inclinacion", tip: "Inclinacion", action: MARCAR_INCLINACION, content: <img src={inclinacionIcon} alt="Inclinacion" /> },
    { id: "rotacion", tip: "Rotacion", action: MARCAR_ROTACION, content: <img src={rotacionIcon} alt="Rotacion" /> },
    { id: "empaq-alimento", tip: "Empaquetamiento de Alimentos", action: MARCAR_EMPAQ_ALIMENTO, content: <img src={empaqAlimentosIcon} alt="Empaquetamiento" /> },
    { id: "profundidad-sondaje", tip: "Profundidad de Sondaje", action: MARCAR_PROFUNDIDAD_SONDAJE, content: "PS" },
    { id: "frenillo", tip: "Frenillo", action: MARCAR_FRENILLO, content: "Y" },
    { id: "nivel-insersion", tip: "Nivel de Insersion Clinica", action: MARCAR_INSERSION_CLINICA, content: "NIC" },
    { id: "sangramiento-sondaje", tip: "Sangramiento al Sondaje", action: MARCAR_SANGRAMIENTO_SONDAJE, content: "SS." },
    { id: "mucosa-masticadora", tip: "Mucosa Masticadora", action: MARCAR_MUCOSA_MASTICADORA, content: "MM" },
    { id: "defecto-mucogingival", tip: "Defecto Mucogingival", action: MARCAR_DEFECTO_MUCOGINGIVAL, content: "DMG" },
    { id: "movilidad-dentaria", tip: "Movilidad Dentaria", action: MARCAR_MOVILIDAD_DENTARIA, content: "MOV" },
    { id: "protesis-defectuosa", tip: "Protesis Defectuosa", action: MARCAR_PROTESIS_DEFECTUOSA, content: "PD" },
    { id: "compromiso-furcacion", tip: "Compromiso Furcacion", action: MARCAR_COMPROMISO_FURCACION, content: "CF" },
];

const colorButtons = [
    { id: "btncolor-black", color: "#343A40" }, // Dark Gray
    { id: "btncolor-red", color: "#E63946" },   // Vibrant Red
    { id: "btncolor-blue", color: "#457B9D" },  // Professional Blue
    { id: "btncolor-green", color: "#2A9D8F" }, // Teal Green
    { id: "btncolor-orange", color: "#F4A261" }, // Soft Orange
];

const ActionButtons = ({
    currentAction,
    setCurrentAction,
    currentColor,
    setCurrentColor,
    handleUndo,
    handleRedo,
    redoStack,
    handleClearCanvas,
    handleDownload,
    handleSaveToCloudinary,
    isSaving,
    handlePrint,
    setShowBackdrop,
}) => {
    return (
        <div id="draw-panel">
            <div className="color-panel">
                <div id="botonera-colores">
                    {colorButtons.map((btn) => (
                        <button
                            key={btn.id}
                            id={btn.id}
                            className="btn-color"
                            style={{ backgroundColor: btn.color }}
                            onClick={() => setCurrentColor(btn.color)}
                        >
                        </button>
                    ))}
                </div>
                <div id="color-actual" style={{ backgroundColor: currentColor }} />
            </div>
            <hr />
            <div id="botonera-grafica">
                {actionButtons.map((btn) => (
                    <button
                        key={btn.id}
                        id={btn.id}
                        className={`btn-dibujo t-tip ${currentAction === btn.action ? "activo" : ""} ${btn.className || ""}`}
                        data-tip={btn.tip}
                        onClick={() => setCurrentAction(btn.action)}
                    >
                        {btn.content}
                    </button>
                ))}
                <button id="undo" className="btn-dibujo t-tip" data-tip="Deshacer" onClick={handleUndo}>
                    <Undo />
                </button>
                <button id="redo" className="btn-dibujo t-tip" data-tip="Rehacer" onClick={handleRedo} disabled={redoStack.length === 0}>
                    <Redo />
                </button>
                <button id="clear" className="btn-dibujo t-tip" data-tip="Deshacer Todo" onClick={handleClearCanvas}>
                    <img src={broomIcon} alt="Limpiar" />
                </button>


                <button id="download" className="btn-dibujo t-tip big" data-tip="Descargar" onClick={handleDownload}>
                    <img src={downloadIcon} alt="Descargar" />
                </button>
                <button id="save-cloud" className="btn-dibujo t-tip big" data-tip="Guardar en Cloud" onClick={handleSaveToCloudinary} disabled={isSaving}>
                    {isSaving ? "..." : <CloudUpload />}
                </button>
                <button id="print" className="btn-dibujo t-tip big" data-tip="Imprimir" onClick={handlePrint}>
                    <Printer />
                </button>
                <button id="expand" className="btn-dibujo t-tip big" data-tip="Ver en grande" onClick={() => setShowBackdrop(true)}>
                    <Expand />
                </button>
            </div>
            <hr />
        </div>
    );
};

export default ActionButtons;