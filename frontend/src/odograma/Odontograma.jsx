import React, { useState, useEffect, useRef, useCallback } from "react";
import Swal from "sweetalert2";

import { Undo, Redo, CloudUpload, Printer } from "lucide-react";

import odogramaBaseImage from "./images/odograma1.jpg"; // Importamos la imagen local
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
// Se mantienen fuera del componente ya que no cambian.
const MARCAR_EXTRACCION = 1;
const MARCAR_CARIES = 2;
const MARCAR_AREA = 3;
const MARCAR_FRACTURA = 4;
const LINEA_VERTICAL = 5;
const LINEA_HORIZONTAL = 6;
const DIENTE_AUSENTE = 7;
const MARCAR_BOX_UP = 8;
const MARCAR_BOX_DOWN = 9;
const MARCAR_IMPLANTE = 10;
const MARCAR_LIMPIAR = 12;
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
const SIN_SELECCION = 0;

const strToDMA = (nfecha) => {
  //parametro: string en forma AAAA-MM-DD
  //return: string en forma DD-MM-AAAA
  const dma = nfecha.split("-").reverse().join("-");
  return dma;
};

const dateToAMD = (cfecha) => {
  //parametro: una fecha tipo Date();
  //return: string en forma AAAA-MM-DD
  let year = cfecha.getFullYear(); // YYYY
  let month = ("0" + (cfecha.getMonth() + 1)).slice(-2); // MM
  let day = ("0" + cfecha.getDate()).slice(-2); // DD
  return year + "-" + month + "-" + day;
};

// --- CONFIGURACIÓN DE BOTONES (Para renderizado dinámico) ---
const actionButtons = [
  {
    id: "marcador",
    tip: "Marcador",
    action: MARCAR_AREA,
    content: <img src={markerIcon} alt="Marcador" />,
  },
  { id: "caries", tip: "Caries", action: MARCAR_CARIES, content: <img src={cariesIcon} alt="Caries" /> },
  { id: "sellante", tip: "Sellante", action: MARCAR_SELLANTE, content: "S", className: "font-bold text-xl" },
  {
    id: "extraccion",
    tip: "Extraccion",
    action: MARCAR_EXTRACCION,
    content: <img src={extraccionIcon} alt="Extraccion" />,
  },
  {
    id: "ausente",
    tip: "Diente Ausente",
    action: DIENTE_AUSENTE,
    content: <img src={ausenteIcon} alt="Ausente" />,
  },
  {
    id: "puenteFijo",
    tip: "Puente Fijo",
    action: MARCAR_PUENTE_FIJO,
    content: <img src={puentefijoIcon} alt="Puente Fijo" />,
  },
  {
    id: "lineaV",
    tip: "Diastema",
    action: LINEA_VERTICAL,
    content: <img src={paralelasVIcon} alt="Diastema" />,
  },
  {
    id: "lineaH",
    tip: "Por Definir",
    action: LINEA_HORIZONTAL,
    content: <img src={paralelasHIcon} alt="Por Definir" />,
  },
  {
    id: "implante",
    tip: "Implante",
    action: MARCAR_IMPLANTE,
    content: <img src={implanteIcon} alt="Implante" />,
  },
  {
    id: "removible",
    tip: "Removible",
    action: MARCAR_REMOVIBLE,
    content: <img src={removibleIcon} alt="Removible" />,
  },
  {
    id: "hipersense",
    tip: "Hipersensibilidad",
    action: MARCAR_HIPERSENSE,
    content: <img src={hipersenseIcon} alt="Hipersensibilidad" />,
  },
  {
    id: "apical",
    tip: "Proceso Apical",
    action: MARCAR_APICAL,
    content: <img src={apicalIcon} alt="Apical" />,
  },
  { id: "fistula", tip: "Fistula", action: MARCAR_FISTULA, content: <img src={fistulaIcon} alt="Fistula" /> },
  {
    id: "extrusion",
    tip: "Extrusion",
    action: MARCAR_EXTRUSION,
    content: <img src={extrusionIcon} alt="Extrusion" />,
  },
  {
    id: "infraoclusion",
    tip: "Infraoclusion",
    action: MARCAR_INFRAOCLUSION,
    content: <img src={infraoclusionIcon} alt="Infraoclusion" />,
  },
  {
    id: "inclinacion",
    tip: "Inclinacion",
    action: MARCAR_INCLINACION,
    content: <img src={inclinacionIcon} alt="Inclinacion" />,
  },
  {
    id: "rotacion",
    tip: "Rotacion",
    action: MARCAR_ROTACION,
    content: <img src={rotacionIcon} alt="Rotacion" />,
  },
  {
    id: "empaq-alimento",
    tip: "Empaquetamiento de Alimentos",
    action: MARCAR_EMPAQ_ALIMENTO,
    content: <img src={empaqAlimentosIcon} alt="Empaquetamiento" />,
  },
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
  { id: "btncolor-negro", color: "rgba(0, 0, 0, 0.9)" },
  { id: "btncolor-naranja", color: "#e68106" },
  { id: "btncolor-rojo", color: "#FF0000" },
  { id: "btncolor-azul", color: "rgba(0, 0, 255, 0.9)" },
  { id: "btncolor-verde", color: "#008800" },
];
const Odontograma = ({ idPaciente, nombrePaciente, apellidoPaciente, onCerrar, imageUrl, imageID }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isMouseDownRef = useRef(false);
  // --- Optimizaciones de rendimiento ---
  const lastPositionRef = useRef({ x: 0, y: 0 }); // Guarda la última posición del puntero
  const animationFrameIdRef = useRef(null); // ID para requestAnimationFrame
  const pendingDrawRequestsRef = useRef([]); // Cola de puntos a dibujar

  const [currentColor, setCurrentColor] = useState("rgba(0, 0, 0, 0.9)");
  const [currentAction, setCurrentAction] = useState(SIN_SELECCION);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isSaving, setIsSaving] = useState(false); // Estado para el feedback de guardado
  const odogramaImageRef = useRef(null); // Ref para la imagen base

  const fecha = strToDMA(dateToAMD(new Date()));
  const localStorageKey = `odontogramaState_${idPaciente}`;

  const extraccion = useCallback((posx, posy, ctx) => {
    if (esDibujable(posx, posy)) {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(posx - 10, calibrarY(posy) - 75);
      ctx.lineTo(posx + 10, calibrarY(posy) + 75);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(posx + 10, calibrarY(posy) - 75);
      ctx.lineTo(posx - 10, calibrarY(posy) + 75);
      ctx.stroke();
    }
  }, []); // No tiene dependencias externas al hook

  // Función para dibujar acciones de un solo clic
  const drawAction = useCallback(
    (ctx, command) => {
      let { type, x, y, color } = command;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.font = "bold 16px serif";

      // La lógica de dibujo para cada acción se mantiene casi idéntica
      // Solo se cambia la forma de acceder al contexto (ctx)
      switch (type) {
        case MARCAR_EXTRACCION:
          extraccion(x, y, ctx);
          break;
        case DIENTE_AUSENTE:
          ausente(x, y, ctx);
          break;
        case MARCAR_CARIES:
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case LINEA_VERTICAL:
          ctx.strokeStyle = "rgb(0, 0,255)";
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x - 3, y - 10);
          ctx.moveTo(x + 2, y);
          ctx.lineTo(x + 2, y - 10);
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x - 3, y + 10);
          ctx.moveTo(x + 2, y);
          ctx.lineTo(x + 2, y + 10);
          break;
        case MARCAR_IMPLANTE:
          y = y - 5;
          ctx.lineWidth = 3;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 10, y);
          ctx.moveTo(x, y);
          ctx.lineTo(x - 10, y);
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 7);
          ctx.moveTo(x, y + 8);
          ctx.lineTo(x + 10, y + 8);
          ctx.moveTo(x, y + 8);
          ctx.lineTo(x - 10, y + 8);
          break;
        case MARCAR_PUENTE_FIJO:
          let xoffset = 12;
          x = x - xoffset;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.lineTo(x + 20, y);
          ctx.arc(x + 25, y, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();
          break;
        case MARCAR_REMOVIBLE:
          x = x - 15;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();
          ctx.lineTo(x + 10, y - 6);
          ctx.lineTo(x + 17, y);
          ctx.lineTo(x + 25, y - 6);
          ctx.lineTo(x + 32, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x + 35, y, 3, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();
          break;
        case MARCAR_HIPERSENSE:
          y = y - 15;
          x = x - 5;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y);
          ctx.lineTo(x + 8, y + 4);
          ctx.lineTo(x, y + 8);
          ctx.lineTo(x + 8, y + 12);
          ctx.lineTo(x, y + 16);
          ctx.lineTo(x + 8, y + 20);
          ctx.lineTo(x, y + 24);
          break;
        case MARCAR_APICAL:
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.strokeStyle = color;
          ctx.closePath();
          break;
        case MARCAR_FISTULA:
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();
          break;
        case MARCAR_EMPAQ_ALIMENTO:
          ctx.fillText("E", x - 7, y + 5);
          break;
        case MARCAR_INFRAOCLUSION:
          x = x - 5;
          y = y - 5;
          ctx.lineWidth = 2;
          ctx.moveTo(x + 5, y - 10);
          ctx.lineTo(x + 5, y);
          ctx.moveTo(x, y);
          ctx.lineTo(x + 10, y);
          ctx.lineTo(x + 5, y + 15);
          ctx.fill();
          ctx.closePath();
          break;
        case MARCAR_PROFUNDIDAD_SONDAJE:
          ctx.fillText("PS", x - 10, y + 5);
          break;
        case MARCAR_INSERSION_CLINICA:
          ctx.fillText("N.I.C", x - 20, y + 5);
          break;
        case MARCAR_SANGRAMIENTO_SONDAJE:
          ctx.fillText("S.S", x - 12, y + 5);
          break;
        case MARCAR_SELLANTE:
          ctx.font = "bold 25px Verdana";
          ctx.fillText("S", x - 12, y + 5);
          break;
        case MARCAR_MUCOSA_MASTICADORA:
          ctx.fillText("M.M", x - 15, y + 5);
          break;
        case MARCAR_DEFECTO_MUCOGINGIVAL:
          ctx.fillText("D.M.G", x - 25, y + 5);
          break;
        case MARCAR_MOVILIDAD_DENTARIA:
          ctx.fillText("M.O.V.", x - 25, y + 5);
          break;
        case MARCAR_COMPROMISO_FURCACION:
          ctx.fillText("C.F.", x - 15, y + 5);
          break;
        case MARCAR_PROTESIS_DEFECTUOSA:
          ctx.fillText("P.D.", x - 13, y + 5);
          break;
        case MARCAR_FRENILLO:
          ctx.fillText("Y", x - 7, y + 5);
          break;
        case MARCAR_EXTRUSION:
          ctx.lineWidth = 2;
          x = x - 5;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 5, y - 15);
          ctx.lineTo(x + 10, y);
          ctx.moveTo(x + 5, y);
          ctx.lineTo(x + 5, y + 10);
          ctx.fill();
          ctx.closePath();
          break;
        case MARCAR_INCLINACION:
          ctx.lineWidth = 2;
          y = y - 5;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 10, y + 5);
          ctx.lineTo(x, y + 10);
          ctx.moveTo(x + 5, y + 5);
          ctx.lineTo(x - 10, y + 5);
          ctx.fill();
          ctx.closePath();
          break;
        case MARCAR_ROTACION:
          ctx.lineWidth = 2;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 5, y - 15);
          ctx.lineTo(x + 10, y);
          ctx.moveTo(x, y);
          ctx.fill();
          ctx.arc(x - 5, y, 10, 0, Math.PI, false);
          break;
        case MARCAR_FRACTURA:
          ctx.strokeStyle = color;
          ctx.moveTo(x, y);
          ctx.lineTo(x - 5, y);
          ctx.lineTo(x - 5, y + 5);
          ctx.lineTo(x - 10, y + 5);
          ctx.lineTo(x - 10, y + 10);
          ctx.lineTo(x - 15, y + 10);
          break;
        case LINEA_HORIZONTAL:
          ctx.strokeStyle = "rgb(0, 0,255)";
          x = x - 10;
          y = y - 3;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 20, y);
          ctx.moveTo(x, y + 5);
          ctx.lineTo(x + 20, y + 5);
          break;
        default:
          break;
      }
      ctx.stroke();
    },
    [extraccion]
  );

  const executeCommand = useCallback(
    (ctx, command) => {
      const { type, color, size, points } = command;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = size || 3;
      ctx.lineCap = "round";
      ctx.font = "bold 16px serif";

      switch (type) {
        case MARCAR_AREA:
          if (points && points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
          }
          break;
        // La lógica de dibujo de handleMouseUp se mueve aquí
        default:
          // Reutilizamos la lógica de handleMouseUp para los clics simples
          drawAction(ctx, command);
          break;
      }
    },
    [drawAction]
  );

  const redrawCanvas = useCallback(
    (commands) => {
      const canvas = canvasRef.current;
      if (!canvas || !odogramaImageRef.current) return;
      const ctx = contextRef.current;

      // 1. Limpiar y dibujar fondo
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Dibujar imagen base y texto
      // Se escala la imagen para que ocupe todo el ancho del canvas, manteniendo la proporción.
      const img = odogramaImageRef.current;
      const scale = canvas.width / img.naturalWidth;
      const scaledHeight = img.naturalHeight * scale;
      ctx.drawImage(img, 0, 30, canvas.width, scaledHeight);
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "#000000";
      // ctx.fillText(`Examen Clinico Intraoral - ${fecha}`, 15, 20);
      ctx.fillText(`Odograma: ${nombrePaciente} ${apellidoPaciente} - ${fecha}`, 15, 20);
      ctx.font = "bold 14px Arial";

      // 3. Re-ejecutar todos los comandos del historial
      commands.forEach((command) => executeCommand(ctx, command));
    },
    [nombrePaciente, apellidoPaciente, fecha, executeCommand]
  );

  useEffect(() => {
    // Al montar, intentar cargar el estado desde localStorage
    const savedStateJSON = localStorage.getItem(localStorageKey);
    let initialHistory = [];
    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);
      initialHistory = savedState.history || [];
      setHistory(initialHistory);
      setRedoStack(savedState.redoStack || []);
    }

    // Inicializar el canvas y redibujar el historial cargado
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    contextRef.current = ctx;
    canvas.width = 530;
    canvas.height = 460;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      odogramaImageRef.current = img;
      redrawCanvas(initialHistory);
    };
    img.onerror = () => {
      console.error(`Error al cargar la imagen desde: ${imageUrl}. Usando imagen de respaldo.`);
      // Si falla la carga desde Cloudinary, usa la imagen base local
      const fallbackImg = new Image();
      fallbackImg.src = odogramaBaseImage;
      fallbackImg.onload = () => {
        odogramaImageRef.current = fallbackImg;
        redrawCanvas(initialHistory);
      };
    };
    // Usa la URL de Cloudinary si existe, de lo contrario, la imagen base
    img.src = imageUrl || odogramaBaseImage;
  }, [localStorageKey, redrawCanvas, imageUrl]); // Se ejecuta si la URL de la imagen cambia

  // Guardar en localStorage cada vez que el historial cambie
  useEffect(() => {
    const stateToSave = { history, redoStack };
    localStorage.setItem(localStorageKey, JSON.stringify(stateToSave));
  }, [history, redoStack, localStorageKey]);

  const addCommandToHistory = useCallback(
    (command) => {
      const newHistory = [...history, command];
      setHistory(newHistory);
      setRedoStack([]); // Limpiar el stack de rehacer
    },
    [history]
  );

  const getPointerPosition = useCallback(
    (evt) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      // Determinar el puntero correcto según el tipo de evento
      let pointer = evt; // Por defecto para eventos de mouse
      if (evt.type.startsWith("touch")) {
        // Para touchend, usar changedTouches. Para los demás, usar touches.
        pointer = evt.type === "touchend" ? evt.changedTouches[0] : evt.touches[0];
      }

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (pointer.clientX - rect.left) * scaleX;
      const y = (pointer.clientY - rect.top) * scaleY;

      return { x, y };
    },
    [] // Sin dependencias, ya que solo usa refs y lógica pura
  );

  // La función getMousePos ahora es un alias para mantener la compatibilidad del código existente.
  const getMousePos = getPointerPosition;

  const esDibujable = (posx, posy) => {
    if (posx < 5 || posx >= 515) return false;
    if (posy < 50 || posy >= 380) return false;
    if (posy >= 220 && posy <= 250) return false;
    return true;
  };

  const calibrarY = (y) => {
    if (y >= 250 && y <= 400) return 325;
    if (y >= 50 && y <= 215) return 140;
    return y;
  };

  // --- Bucle de dibujo optimizado ---
  const optimizedDrawLoop = useCallback(() => {
    if (pendingDrawRequestsRef.current.length === 0) {
      animationFrameIdRef.current = null;
      return;
    }

    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);

    // Dibujamos los puntos pendientes pero no los eliminamos de la cola todavía
    const pointsToDraw = [...pendingDrawRequestsRef.current];

    pointsToDraw.forEach((pos) => {
      if (esDibujable(pos.x, pos.y)) {
        ctx.lineTo(pos.x, pos.y);
        lastPositionRef.current = pos; // Actualizamos la última posición
      }
    });

    ctx.stroke();
    lastPositionRef.current = pointsToDraw[pointsToDraw.length - 1];

    animationFrameIdRef.current = requestAnimationFrame(optimizedDrawLoop);
  }, []); // esDibujable y calibrarY no dependen de props/estado, no necesitan ser dependencias

  const handleMouseDown = useCallback(
    (e) => {
      // Para eventos táctiles, prevenimos el scroll de la página
      if (e.type === "touchstart") {
        e.preventDefault();
      }
      if (currentAction === SIN_SELECCION) {
        Swal.fire({
          title: "Modo Dibujo",
          text: "No has seleccionado ningún comando.",
          icon: "warning",
          confirmButtonText: "Entendido",
        });
        return;
      }
      isMouseDownRef.current = true;
      const ctx = contextRef.current;
      const currentPosition = getPointerPosition(e);
      lastPositionRef.current = currentPosition;

      if (currentAction === MARCAR_AREA) {
        pendingDrawRequestsRef.current = [currentPosition];
      }

      ctx.lineWidth = 3; // currentSize
      ctx.lineCap = "round";
      ctx.strokeStyle = currentColor;
    },
    [currentAction, getPointerPosition, currentColor]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (e.type === "touchmove") {
        e.preventDefault();
      }
      if (currentAction === MARCAR_AREA && isMouseDownRef.current) {
        const currentPosition = getPointerPosition(e);
        pendingDrawRequestsRef.current.push(currentPosition);

        // Dibujamos el segmento directamente para feedback visual inmediato
        const ctx = contextRef.current;
        ctx.beginPath();
        ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
        if (esDibujable(currentPosition.x, currentPosition.y)) {
          ctx.lineTo(currentPosition.x, currentPosition.y);
          ctx.stroke();
        }
        lastPositionRef.current = currentPosition;
      }
    },
    [currentAction, getPointerPosition, currentColor]
  ); // Añadido currentColor por si acaso, aunque se usa en mousedown

  const handleMouseUp = useCallback(
    (e) => {
      isMouseDownRef.current = false;

      if (e.type === "touchend") {
        e.preventDefault();
      }
      const p = getPointerPosition(e);
      let { x, y } = p;

      if (!esDibujable(x, y)) {
        // Limpiar el dibujo libre si se suelta fuera del área
        if (currentAction === MARCAR_AREA) {
          pendingDrawRequestsRef.current = [];
          redrawCanvas(history);
        }
        return;
      }

      const command = { type: currentAction, x, y, color: currentColor, size: 3 };

      if (currentAction === MARCAR_AREA) {
        if (pendingDrawRequestsRef.current.length > 1) {
          command.points = [...pendingDrawRequestsRef.current];
          addCommandToHistory(command);
        } else {
          // Si fue solo un clic, no un arrastre, redibujamos para limpiar el punto
          redrawCanvas(history);
        }
        pendingDrawRequestsRef.current = [];
      } else {
        // Para acciones de un solo clic, se dibuja y se guarda el comando
        drawAction(contextRef.current, command);
        addCommandToHistory(command);
      }
    },
    [currentAction, getPointerPosition, redrawCanvas, history, addCommandToHistory, drawAction, currentColor]
  );

  const ausente = useCallback((posx, posy, ctx) => {
    if (esDibujable(posx, posy)) {
      ctx.beginPath();
      ctx.moveTo(posx, calibrarY(posy) - 75);
      ctx.lineTo(posx, calibrarY(posy) + 75);
      ctx.stroke();
    }
  }, []); // No tiene dependencias externas al hook

  const handleSaveToCloudinary = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    // Obtener la imagen como base64. Usamos jpeg para consistencia con la descarga.
    const image = canvas.toDataURL("image/jpeg", 1.0);

    try {
      // Ahora la petición se hace a nuestro propio backend
      const response = await fetch("/api/pacientes/upload-odontograma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image, // La imagen en base64
          imageID, // El ID para que el backend sepa qué imagen sobrescribir
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el servidor");
      }

      console.log("Respuesta del servidor:", data);
      Swal.fire({
        title: "Guardado",
        text: "Odontograma guardado exitosamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al guardar en Cloudinary:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al guardar el odontograma en la nube.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    } finally {
      setIsSaving(false);
    }
  }, [idPaciente, imageID]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.download = `${idPaciente}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [idPaciente]);

  const handlePrint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    const printWindow = window.open("", "_blank", "height=600,width=800");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Odontograma</title>
            <style>
              @page { size: auto;  margin: 0mm; }
              body { margin: 0; text-align: center; }
              img { max-width: 100%; max-height: 98vh; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = function () {
        printWindow.print();
        printWindow.close();
      };
    }
  }, []);

  const handleClearCanvas = useCallback(() => {
    // Simplemente vuelve a dibujar el canvas inicial
    setHistory([]);
    setRedoStack([]);
    redrawCanvas([]);
  }, [redrawCanvas]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    setRedoStack([...redoStack, lastState]);

    const newHistory = history.slice(0, history.length - 1);
    setHistory(newHistory);
    redrawCanvas(newHistory);
  }, [history, redoStack, redrawCanvas]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return; // No rehacer si no hay nada en el stack

    const nextState = redoStack[redoStack.length - 1];
    const newHistory = [...history, nextState];
    setHistory(newHistory);

    const newRedoStack = redoStack.slice(0, redoStack.length - 1);
    setRedoStack(newRedoStack);

    redrawCanvas(newHistory);
  }, [history, redoStack, redrawCanvas]);

  // Efecto para manejar los eventos táctiles de forma manual y poder usar { passive: false }
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Opciones para el listener para poder usar preventDefault()
    const eventOptions = { passive: false };

    // Adjuntar los listeners
    canvas.addEventListener("touchstart", handleMouseDown, eventOptions);
    canvas.addEventListener("touchmove", handleMouseMove, eventOptions);
    canvas.addEventListener("touchend", handleMouseUp, eventOptions);

    // Función de limpieza para remover los listeners cuando el componente se desmonte
    return () => {
      canvas.removeEventListener("touchstart", handleMouseDown, eventOptions);
      canvas.removeEventListener("touchmove", handleMouseMove, eventOptions);
      canvas.removeEventListener("touchend", handleMouseUp, eventOptions);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]); // Dependencias

  return (
    <div className="child__container">
      <button id="btn-cerrar" onClick={onCerrar}>
        Volver
      </button>
      <div className="odograma__container">
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
                />
              ))}
              <button id="color-actual" className="btn-color" style={{ backgroundColor: currentColor }}>
                actual
              </button>
            </div>
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
            <button
              id="redo"
              className="btn-dibujo t-tip"
              data-tip="Rehacer"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
            >
              <Redo />
            </button>
            <button id="clear" className="btn-dibujo t-tip" data-tip="Deshacer Todo" onClick={handleClearCanvas}>
              <img src={broomIcon} alt="Limpiar" />
            </button>
            <button id="download" className="btn-dibujo t-tip" data-tip="Descargar" onClick={handleDownload}>
              <img src={downloadIcon} alt="Descargar" />
            </button>
            <button
              id="save-cloud"
              className="btn-dibujo t-tip"
              data-tip="Guardar en Cloud"
              onClick={handleSaveToCloudinary}
              disabled={isSaving}
            >
              {isSaving ? "..." : <CloudUpload />}
            </button>
            <button id="print" className="btn-dibujo t-tip" data-tip="Imprimir" onClick={handlePrint}>
              <Printer />
            </button>
          </div>
          <hr />
        </div>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            id="canvas"
            onMouseDown={handleMouseDown} // Evento para mouse
            onMouseMove={handleMouseMove} // Evento para mouse
            onMouseUp={handleMouseUp} // Evento para mouse
            onMouseLeave={() => (isMouseDownRef.current = false)} // Extra: para evitar que se quede dibujando si el mouse sale del canvas
          />
        </div>
      </div>
    </div>
  );
};

export default Odontograma;
