import React, { useState, useEffect, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import odogramaBaseImage from "./images/odograma1.jpg"; // Importamos la imagen local
import ActionButtons from "./ActionButtons";

// --- CONSTANTES ---
// Se mantienen fuera del componente ya que no cambian.
const MARCAR_EXTRACCION = 1;
const MARCAR_CARIES = 2;
const MARCAR_AREA = 3;
const MARCAR_FRACTURA = 4;
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
const SIN_SELECCION = 0;

// eslint-disable-next-line react/prop-types
const Odontograma = ({ idPaciente, nombrePaciente, imageUrl, onCerrar }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isMouseDownRef = useRef(false);
  // --- Optimizaciones de rendimiento ---
  const lastPositionRef = useRef({ x: 0, y: 0 }); // Guarda la última posición del puntero
  const animationFrameIdRef = useRef(null); // ID para requestAnimationFrame
  const pendingDrawRequestsRef = useRef([]); // Cola de puntos a dibujar

  const [currentColor, setCurrentColor] = useState("#343A40"); // Nuevo color por defecto
  const [currentAction, setCurrentAction] = useState(SIN_SELECCION);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isSaving, setIsSaving] = useState(false); // Estado para el feedback de guardado
  const [showBackdrop, setShowBackdrop] = useState(false); // Estado para el backdrop
  const [cursorStyle, setCursorStyle] = useState("default"); // Estado para el estilo del cursor
  const odogramaImageRef = useRef(null); // Ref para la imagen base

  // --- FUNCIONES DE UTILIDAD ---
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${day}-${month}-${year}`;
  }, []);

  const fecha = formatDate(new Date());
  const localStorageKey = `odontogramaState_${idPaciente}`;

  const setupContext = useCallback((ctx, { color, size = 3, font = "bold 16px serif" } = {}) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.font = font;
  }, []);

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

  const ausente = useCallback((posx, posy, ctx) => {
    if (esDibujable(posx, posy)) {
      ctx.beginPath();
      ctx.moveTo(posx, calibrarY(posy) - 75);
      ctx.lineTo(posx, calibrarY(posy) + 75);
      ctx.stroke();
    }
  }, []); // No tiene dependencias externas al hook

  // --- LÓGICA DE DIBUJO MODULARIZADA ---
  const drawCaries = (ctx, { x, y }) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawLineaVertical = (ctx, { x, y }) => {
    ctx.strokeStyle = "rgb(0, 0,255)";
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 10);
    ctx.lineTo(x - 3, y + 10);
    ctx.moveTo(x + 2, y - 10);
    ctx.lineTo(x + 2, y + 10);
    ctx.stroke();
  };

  const drawImplante = (ctx, { x, y }) => {
    y = y - 5;
    ctx.lineWidth = 3;
    ctx.beginPath();
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
    ctx.stroke();
  };

  const drawPuenteFijo = (ctx, { x, y }) => {
    const xoffset = 12;
    x = x - xoffset;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.moveTo(x + 4, y);
    ctx.lineTo(x + 21, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 25, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawRemovible = (ctx, { x, y }) => {
    x = x - 15;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y - 6);
    ctx.lineTo(x + 17, y);
    ctx.lineTo(x + 25, y - 6);
    ctx.lineTo(x + 32, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 35, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawHipersensibilidad = (ctx, { x, y }) => {
    y = y - 15;
    x = x - 5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8, y + 4);
    ctx.lineTo(x, y + 8);
    ctx.lineTo(x + 8, y + 12);
    ctx.lineTo(x, y + 16);
    ctx.lineTo(x + 8, y + 20);
    ctx.lineTo(x, y + 24);
    ctx.stroke();
  };

  const drawProcesoApical = (ctx, { x, y }) => {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawFistula = (ctx, { x, y }) => {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawInfraoclusion = (ctx, { x, y }) => {
    x = x - 5;
    y = y - 5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 5, y - 10);
    ctx.lineTo(x + 5, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y);
    ctx.lineTo(x + 5, y + 15);
    ctx.fill();
    ctx.stroke();
  };

  const drawExtrusion = (ctx, { x, y }) => {
    ctx.lineWidth = 2;
    x = x - 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y - 15);
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 5, y + 10);
    ctx.fill();
    ctx.stroke();
  };

  const drawInclinacion = (ctx, { x, y }) => {
    ctx.lineWidth = 2;
    y = y - 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y + 5);
    ctx.lineTo(x, y + 10);
    ctx.moveTo(x + 5, y + 5);
    ctx.lineTo(x - 10, y + 5);
    ctx.fill();
    ctx.stroke();
  };

  const drawRotacion = (ctx, { x, y }) => {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y - 15);
    ctx.lineTo(x + 10, y);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 5, y, 10, 0, Math.PI, false);
    ctx.stroke();
  };

  const drawFractura = (ctx, { x, y }) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y);
    ctx.lineTo(x - 5, y + 5);
    ctx.lineTo(x - 10, y + 5);
    ctx.lineTo(x - 10, y + 10);
    ctx.lineTo(x - 15, y + 10);
    ctx.stroke();
  };

  const drawLineaHorizontal = (ctx, { x, y }) => {
    ctx.strokeStyle = "rgb(0, 0,255)";
    x = x - 10;
    y = y - 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x + 20, y + 5);
    ctx.stroke();
  };

  // Función para dibujar acciones de un solo clic
  const drawAction = useCallback(
    (ctx, command) => {
      const { type, x, y, color, size } = command;
      setupContext(ctx, { color, size });

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
          drawCaries(ctx, command);
          break;
        case LINEA_VERTICAL:
          drawLineaVertical(ctx, command);
          break;
        case MARCAR_IMPLANTE:
          drawImplante(ctx, command);
          break;
        case MARCAR_PUENTE_FIJO:
          drawPuenteFijo(ctx, command);
          break;
        case MARCAR_REMOVIBLE:
          drawRemovible(ctx, command);
          break;
        case MARCAR_HIPERSENSE:
          drawHipersensibilidad(ctx, command);
          break;
        case MARCAR_APICAL:
          drawProcesoApical(ctx, command);
          break;
        case MARCAR_FISTULA:
          drawFistula(ctx, command);
          break;
        case MARCAR_EMPAQ_ALIMENTO:
          ctx.fillText("E", x - 7, y + 5);
          break;
        case MARCAR_INFRAOCLUSION:
          drawInfraoclusion(ctx, command);
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
          setupContext(ctx, { color, font: "bold 25px Verdana" });
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
          drawExtrusion(ctx, command);
          break;
        case MARCAR_INCLINACION:
          drawInclinacion(ctx, command);
          break;
        case MARCAR_ROTACION:
          drawRotacion(ctx, command);
          break;
        case MARCAR_FRACTURA:
          drawFractura(ctx, command);
          break;
        case LINEA_HORIZONTAL:
          drawLineaHorizontal(ctx, command);
          break;
        default:
          break;
      }
    },
    [ausente, extraccion, setupContext]
  );

  const executeCommand = useCallback(
    (ctx, command) => {
      const { type, color, size, points } = command;
      setupContext(ctx, { color, size });
      ctx.lineCap = "round";

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
    [drawAction, setupContext]
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
      // --- SOLUCIÓN ---
      // El desplazamiento solo se aplica si es la imagen base (odontograma nuevo).
      const yOffset = odogramaImageRef.current.src.includes(odogramaBaseImage) ? 30 : 0;
      const scale = canvas.width / img.naturalWidth;
      const scaledHeight = img.naturalHeight * scale;
      ctx.drawImage(img, 0, yOffset, canvas.width, scaledHeight);

      // --- VALIDACIÓN MEJORADA ---
      // Solo se escribe el nombre y la fecha si la imagen cargada es la imagen base (odontograma nuevo).
      if (odogramaImageRef.current.src.includes(odogramaBaseImage)) {
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(`Odograma: ${nombrePaciente} - ${fecha}`, 15, 20);
      }

      // 3. Re-ejecutar todos los comandos del historial
      commands.forEach((command) => executeCommand(ctx, command));
    },
    [executeCommand, fecha, nombrePaciente]
  );

  useEffect(() => {
    // Al montar, intentar cargar el estado desde localStorage
    let initialHistory = [];
    // Solo cargamos desde localStorage si es un odontograma nuevo (sin imageUrl)
    if (!imageUrl) {
      const savedStateJSON = localStorage.getItem(localStorageKey);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        initialHistory = savedState.history || [];
      }
    }

    // Inicializar el canvas y redibujar el historial cargado
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    contextRef.current = ctx;
    canvas.width = 530;
    canvas.height = 460;

    // --- Lógica de carga de imagen refactorizada ---
    // 1. Determinar la fuente de la imagen
    const imageSource = imageUrl || odogramaBaseImage;

    // 2. Crear y configurar el objeto de imagen
    const img = new Image();
    img.crossOrigin = "Anonymous";

    // 3. Manejar la carga exitosa
    img.onload = () => {
      odogramaImageRef.current = img;
      redrawCanvas(initialHistory);
    };

    // 4. Manejar errores de carga (ej. URL de Cloudinary rota)
    img.onerror = () => {
      console.error(`Error al cargar la imagen desde: ${imageSource}. Se intentará usar la imagen de respaldo.`);
      img.src = odogramaBaseImage; // Intenta cargar la imagen base como fallback
    };

    // 5. Iniciar la carga de la imagen
    img.src = imageSource;
  }, []); // Ahora se ejecuta solo una vez al montar, gracias a la 'key' en el padre.

  // Guardar en localStorage cada vez que el historial cambie
  useEffect(() => {
    const stateToSave = { history, redoStack };
    localStorage.setItem(localStorageKey, JSON.stringify(stateToSave));
  }, [history, redoStack, localStorageKey]);

  // Efecto para cambiar el cursor según la herramienta seleccionada
  useEffect(() => {
    switch (currentAction) {
      case MARCAR_AREA:
        setCursorStyle("crosshair"); // Cursor para dibujo libre
        break;
      case SIN_SELECCION:
        setCursorStyle("default"); // Cursor por defecto
        break;
      default:
        setCursorStyle("pointer"); // Cursor para acciones de un solo clic
        break;
    }
  }, [currentAction]);

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
    if (posy < 50 || posy >= 400) return false;
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
        return;
      }
      isMouseDownRef.current = true;
      const currentPosition = getPointerPosition(e);
      lastPositionRef.current = currentPosition;

      if (currentAction === MARCAR_AREA) {
        pendingDrawRequestsRef.current = [currentPosition];
      }

      setupContext(contextRef.current, { color: currentColor, size: 3 });
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
        setupContext(ctx, { color: currentColor });
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
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se borrará todo el progreso. Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, limpiar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, se ejecuta la limpieza
        setHistory([]);
        setRedoStack([]);
        redrawCanvas([]);
      }
    });
  }, [redrawCanvas, setHistory, setRedoStack]);

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
          imageID: idPaciente + ".jpg",
          idPaciente, // El ID para que el backend sepa qué imagen sobrescribir
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
      // --- MEJORA: Feedback de error más detallado ---
      const errorMessage = error.message || "No se pudo conectar con el servidor.";
      Swal.fire({
        title: "Error",
        text: `Error al guardar: ${errorMessage}`,
        icon: "error",
        footer: "Sugerencia: Revisa tu conexión a internet e inténtalo de nuevo.",
        confirmButtonText: "Entendido",
      });
    } finally {
      setIsSaving(false);
    }
  }, [idPaciente]);

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
            onMouseLeave={() => (isMouseDownRef.current = false)} // Extra: para evitar que se quede dibujando si el mouse sale del canvas
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
