import { useEffect, useRef } from "react";

export default function WinnerImg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 534;
    canvas.height = 318;

    let time = 0;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate sketch offset based on time
      const sketchIntensity = 2; // Adjust this for more/less shaking
      const sketchX = Math.sin(time * 0.1) * sketchIntensity;
      const sketchY = Math.cos(time * 0.15) * sketchIntensity;

      // Save context state
      ctx.save();

      // Apply sketch effect by drawing multiple slightly offset copies
      ctx.globalAlpha = 0.3;
      ctx.globalCompositeOperation = "multiply";

      // Draw multiple offset copies for sketch effect
      for (let i = 0; i < 3; i++) {
        const offsetX = sketchX + (Math.random() - 0.5) * 4;
        const offsetY = sketchY + (Math.random() - 0.5) * 4;

        ctx.drawImage(image, offsetX, offsetY, canvas.width, canvas.height);
      }

      // Restore context and draw main image
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      time += 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation when image loads
    if (image.complete) {
      draw();
    } else {
      image.onload = draw;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[534px] h-[318px] z-[2]">
      <img
        ref={imageRef}
        src="/btc/winner-result.png"
        alt="winner"
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
