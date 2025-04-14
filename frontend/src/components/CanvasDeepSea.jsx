import { useRef, useState, useEffect } from "react";

const CanvasDeepSea = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set initial canvas style
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
  }, [brushColor, brushSize]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      imageRef.current = new Image();
      imageRef.current.src = event.target.result;

      imageRef.current.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = imageRef.current.width;
        canvas.height = imageRef.current.height;
        canvas.getContext("2d").drawImage(imageRef.current, 0, 0);
      };
    };
    reader.readAsDataURL(file);
  };

  // Drawing functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Download image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async () => {
    const canvas = canvasRef.current;
    const base64Image = canvas.toDataURL("image/png").split(",")[1];

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/plazasky}/upload`, {
        method: "POST",
        body: JSON.stringify({
          file: `data:image/png;base64,${base64Image}`,
          upload_preset: "pototito",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Upload successful:", data);
      alert("Image uploaded to Cloudinary successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />

      <div>
        <label>
          Brush Color:
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
        </label>

        <label>
          Brush Size:
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
          {brushSize}
        </label>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: "1px solid black", marginTop: "20px" }}
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={downloadImage}>Download Image</button>
        <button onClick={uploadToCloudinary} style={{ marginLeft: "10px" }}>
          Upload to Cloudinary
        </button>
      </div>
    </div>
  );
};

export default CanvasDeepSea;
