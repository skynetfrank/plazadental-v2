import { useState, useEffect, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import odogramaBaseImage from "./images/odograma1.jpg";

// --- CONSTANTES ---
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

export const useOdontogramaCanvas = ({ idPaciente, nombrePaciente, imageUrl, currentAction, currentColor }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const pendingDrawRequestsRef = useRef([]);
  const animationFrameIdRef = useRef(null);
  const odogramaImageRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");

  const localStorageKey = `odontogramaState_${idPaciente}`;

  // --- FUNCIONES DE UTILIDAD ---
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${day}-${month}-${year}`;
  }, []);

  const fecha = formatDate(new Date());

  const setupContext = useCallback((ctx, { color, size = 3, font = "bold 16px serif" } = {}) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.font = font;
  }, []);

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

  const extraccion = useCallback(
    (posx, posy, ctx) => {
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
    },
    [] // No tiene dependencias externas al hook
  );

  const ausente = useCallback(
    (posx, posy, ctx) => {
      if (esDibujable(posx, posy)) {
        ctx.beginPath();
        ctx.moveTo(posx, calibrarY(posy) - 75);
        ctx.lineTo(posx, calibrarY(posy) + 75);
        ctx.stroke();
      }
    },
    [] // No tiene dependencias externas al hook
  );

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

  const drawAction = useCallback(
    (ctx, command) => {
      const { type, x, y, color, size } = command;
      setupContext(ctx, { color, size });

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
        default:
          drawAction(ctx, command);
          break;
      }
    },
    [drawAction, setupContext]
  );

  const drawLoop = useCallback(() => {
    if (pendingDrawRequestsRef.current.length === 0) {
      animationFrameIdRef.current = requestAnimationFrame(drawLoop);
      return;
    }

    const pointsToDraw = [...pendingDrawRequestsRef.current];
    pendingDrawRequestsRef.current = [];

    const ctx = contextRef.current;
    setupContext(ctx, { color: currentColor });
    ctx.beginPath();
    ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);

    pointsToDraw.forEach((pos) => {
      if (esDibujable(pos.x, pos.y)) {
        ctx.lineTo(pos.x, pos.y);
      }
    });
    ctx.stroke();
    lastPositionRef.current = pointsToDraw[pointsToDraw.length - 1];
    animationFrameIdRef.current = requestAnimationFrame(drawLoop);
  }, [currentColor, setupContext]);

  const redrawCanvas = useCallback(
    (commands) => {
      const canvas = canvasRef.current;
      if (!canvas || !odogramaImageRef.current) return;
      const ctx = contextRef.current;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = odogramaImageRef.current;
      const yOffset = odogramaImageRef.current.src.includes(odogramaBaseImage) ? 30 : 0;
      const scale = canvas.width / img.naturalWidth;
      const scaledHeight = img.naturalHeight * scale;
      ctx.drawImage(img, 0, yOffset, canvas.width, scaledHeight);

      if (odogramaImageRef.current.src.includes(odogramaBaseImage)) {
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(`Odograma: ${nombrePaciente} - ${fecha}`, 15, 20);
      }

      commands.forEach((command) => executeCommand(ctx, command));
    },
    [executeCommand, fecha, nombrePaciente]
  );

  const addCommandToHistory = useCallback(
    (command) => {
      const newHistory = [...history, command];
      setHistory(newHistory);
      setRedoStack([]);
    },
    [history]
  );

  const getPointerPosition = useCallback((evt) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let pointer = evt;
    if (evt.type.startsWith("touch")) {
      pointer = evt.type === "touchend" ? evt.changedTouches[0] : evt.touches[0];
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (pointer.clientX - rect.left) * scaleX;
    const y = (pointer.clientY - rect.top) * scaleY;

    return { x, y };
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
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
        animationFrameIdRef.current = requestAnimationFrame(drawLoop);
      }

      setupContext(contextRef.current, { color: currentColor, size: 3 });
    },
    [currentAction, getPointerPosition, currentColor, setupContext, drawLoop]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (e.type === "touchmove") {
        e.preventDefault();
      }
      if (currentAction === MARCAR_AREA && isMouseDownRef.current) {
        // Solo acumulamos los puntos, no dibujamos nada aquí.
        pendingDrawRequestsRef.current.push(getPointerPosition(e));
      }
    },
    [currentAction, getPointerPosition]
  );

  const handleMouseUp = useCallback(
    (e) => {
      isMouseDownRef.current = false;
      cancelAnimationFrame(animationFrameIdRef.current);

      if (e.type === "touchend") {
        e.preventDefault();
      }
      const p = getPointerPosition(e);
      let { x, y } = p;

      if (!esDibujable(x, y)) {
        if (currentAction === MARCAR_AREA) {
          pendingDrawRequestsRef.current = [];
          redrawCanvas(history);
        }
        return;
      }

      const command = { type: currentAction, x, y, color: currentColor, size: 3 };

      if (currentAction === MARCAR_AREA) {
        // Al soltar, tomamos todos los puntos acumulados (los del último frame + los del historial del trazo)
        const finalPoints = [...(history[history.length - 1]?.points || []), ...pendingDrawRequestsRef.current];

        if (finalPoints.length > 1) {
          command.points = finalPoints;
          // Reemplazamos el último comando parcial con el comando completo
          addCommandToHistory(command);
        } else {
          redrawCanvas(history);
        }
        pendingDrawRequestsRef.current = [];
      } else {
        drawAction(contextRef.current, command);
        addCommandToHistory(command);
      }
    },
    [currentAction, getPointerPosition, redrawCanvas, history, addCommandToHistory, drawAction, currentColor]
  );

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
        setHistory([]);
        setRedoStack([]);
        redrawCanvas([]);
      }
    });
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
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    const newHistory = [...history, nextState];
    setHistory(newHistory);

    const newRedoStack = redoStack.slice(0, redoStack.length - 1);
    setRedoStack(newRedoStack);

    redrawCanvas(newHistory);
  }, [history, redoStack, redrawCanvas]);

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

  const handleSaveToCloudinary = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    const image = canvas.toDataURL("image/jpeg", 1.0);

    try {
      const response = await fetch("/api/pacientes/upload-odontograma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          imageID: idPaciente + ".jpg",
          idPaciente,
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

  // --- EFECTOS ---

  useEffect(() => {
    let initialHistory = [];
    if (!imageUrl) {
      const savedStateJSON = localStorage.getItem(localStorageKey);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        initialHistory = savedState.history || [];
      }
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    contextRef.current = ctx;
    canvas.width = 530;
    canvas.height = 460;

    const imageSource = imageUrl || odogramaBaseImage;
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      odogramaImageRef.current = img;
      redrawCanvas(initialHistory);
    };

    img.onerror = () => {
      console.error(`Error al cargar la imagen desde: ${imageSource}. Se intentará usar la imagen de respaldo.`);
      img.src = odogramaBaseImage;
    };

    img.src = imageSource;
  }, [imageUrl, localStorageKey, redrawCanvas]);

  useEffect(() => {
    const stateToSave = { history, redoStack };
    localStorage.setItem(localStorageKey, JSON.stringify(stateToSave));
  }, [history, redoStack, localStorageKey]);

  useEffect(() => {
    switch (currentAction) {
      case MARCAR_AREA:
        setCursorStyle("crosshair");
        break;
      case SIN_SELECCION:
        setCursorStyle("default");
        break;
      default:
        setCursorStyle("pointer");
        break;
    }
  }, [currentAction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const eventOptions = { passive: false };

    canvas.addEventListener("touchstart", handleMouseDown, eventOptions);
    canvas.addEventListener("touchmove", handleMouseMove, eventOptions);
    canvas.addEventListener("touchend", handleMouseUp, eventOptions);

    return () => {
      canvas.removeEventListener("touchstart", handleMouseDown, eventOptions);
      canvas.removeEventListener("touchmove", handleMouseMove, eventOptions);
      canvas.removeEventListener("touchend", handleMouseUp, eventOptions);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
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
  };
};
