import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Simple draw-to-sign canvas. Exposes getDataUrl / clear / isEmpty via ref.
 */
const SignaturePad = forwardRef(function SignaturePad({ disabled = false, className = "" }, ref) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const emptyRef = useRef(true);
  const lastPointRef = useRef(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const cssWidth = Math.max(280, parent?.clientWidth || 480);
    const cssHeight = 160;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2.25;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    emptyRef.current = true;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const pointerPos = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDraw = (event) => {
    if (disabled) return;
    event.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = pointerPos(event);
    try {
      canvasRef.current?.setPointerCapture?.(event.pointerId);
    } catch {
      // ignore capture failures
    }
  };

  const moveDraw = (event) => {
    if (!drawingRef.current || disabled) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const from = lastPointRef.current;
    const to = pointerPos(event);
    if (!ctx || !from) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    lastPointRef.current = to;
    emptyRef.current = false;
  };

  const endDraw = (event) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture?.(event.pointerId);
    } catch {
      // ignore
    }
  };

  useImperativeHandle(ref, () => ({
    isEmpty: () => emptyRef.current,
    clear: () => resizeCanvas(),
    getDataUrl: () => {
      if (emptyRef.current) return "";
      return canvasRef.current?.toDataURL("image/png") || "";
    },
  }));

  return (
    <div className={`agreement-sign__pad-wrap ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="agreement-sign__pad"
        aria-label="Draw your signature"
        onPointerDown={startDraw}
        onPointerMove={moveDraw}
        onPointerUp={endDraw}
        onPointerCancel={endDraw}
        onPointerLeave={endDraw}
      />
    </div>
  );
});

export default SignaturePad;
