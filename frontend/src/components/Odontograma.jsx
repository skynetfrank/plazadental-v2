import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function Odontograma() {
  const params = useParams();
  const { odogramaId, nombre, apellido } = params;

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const cloudinaryx = "https://res.cloudinary.com/plazasky/image/upload/v1661258482/odontogramas/";

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
    const image = new Image();

    if (!odogramaId || odogramaId === "undefined" || odogramaId === "null" || odogramaId === " ") {
      image.src = "/odograma.jpg";
      contextRef.current.font = "15px Arial";
      contextRef.current.fillStyle = "#000000";
    } else {
      image.src = cloudinaryx + odogramaId;
    }

    image.onload = () => {
      context.drawImage(image, 0, 0, 500, 500);
      contextRef.current.fillText(
        "Paciente: " + nombre + " " + apellido + " " + " Creado el dia: " + dayjs(new Date()).format("DD/MM/YYYY"),
        20,
        490
      );
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    console.log("offsetX", offsetX, "offsetY", offsetY);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    nativeEvent.preventDefault();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const setToDraw = () => {
    contextRef.current.globalCompositeOperation = "source-over";
  };

  const setToErase = () => {
    contextRef.current.globalCompositeOperation = "destination-out";
  };

  const saveImageToLocal = (event) => {
    let link = event.currentTarget;
    link.setAttribute("download", "canvas.jpg");
    let image2 = canvasRef.current.toDataURL("image/jpg");
    link.setAttribute("href", image2);
  };

  return (
    <div className="odontograma-container">
      <canvas
        className="canvas-container"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>
      <div>
        <button onClick={setToDraw}>Draw</button>
        <button onClick={setToErase}>Erase</button>
        <a id="download_image_link" href="download_link" onClick={saveImageToLocal}>
          Download Image
        </a>
      </div>
    </div>
  );
}
