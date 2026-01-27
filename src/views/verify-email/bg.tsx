import { useEffect, useRef } from "react";
import "./bg.css";

interface BlackholeBgProps {
  isSpread?: boolean; // Control spread effect via props
}

export default function BlackholeBg({ isSpread = false }: BlackholeBgProps) {
  const blackholeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<{
    collapse: boolean;
    expanse: boolean;
    returning: boolean;
  } | null>(null);

  useEffect(() => {
    if (!blackholeRef.current) return;
    const container = blackholeRef.current;
    const h = container.offsetHeight;
    const w = container.offsetWidth;
    // Double canvas size when isSpread is true
    const scale = isSpread ? 2 : 1;
    const cw = w * scale;
    const ch = h * scale;
    const maxorbit = 280.5; // distance from center (increased by 10%)
    const centery = ch / 2;
    const centerx = cw / 2;

    const startTime = new Date().getTime();
    let currentTime = 0;
    let animationFrameId: number;

    const stars: Star[] = [];
    // Use object reference so draw function can access updated value
    const state = {
      collapse: isSpread, // Controlled via props instead of hover
      expanse: false, // if clicked
      returning: false // if particles are returning to orbit
    };
    stateRef.current = state;

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    // Move canvas left by 300px when isSpread is true
    if (isSpread) {
      canvas.style.left = "-300px";
    }
    canvasRef.current = canvas;
    container.appendChild(canvas);
    const context = canvas.getContext("2d");

    if (!context) return;

    context.globalCompositeOperation = "multiply";

    function setDPI(canvas: HTMLCanvasElement, dpi: number) {
      // Set up CSS size if it's not set up already
      if (!canvas.style.width) canvas.style.width = canvas.width + "px";
      if (!canvas.style.height) canvas.style.height = canvas.height + "px";

      const scaleFactor = dpi / 96;
      canvas.width = Math.ceil(canvas.width * scaleFactor);
      canvas.height = Math.ceil(canvas.height * scaleFactor);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(scaleFactor, scaleFactor);
    }

    function rotate(
      cx: number,
      cy: number,
      x: number,
      y: number,
      angle: number
    ) {
      const radians = angle;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const nx = cos * (x - cx) + sin * (y - cy) + cx;
      const ny = cos * (y - cy) - sin * (x - cx) + cy;
      return [nx, ny];
    }

    setDPI(canvas, 192);

    class Star {
      orbital: number;
      x: number;
      y: number;
      yOrigin: number;
      speed: number;
      rotation: number;
      startRotation: number;
      id: number;
      color: string;
      hoverPos: number;
      hoverX: number;
      expansePos: number;
      prevR: number;
      prevX: number;
      prevY: number;
      trail: number = 0;
      originalY: number;
      constructor() {
        // Get a weighted random number, so that the majority of stars will form in the center of the orbit
        const rands = [];
        rands.push(Math.random() * (maxorbit / 2) + 1);
        rands.push(Math.random() * (maxorbit / 2) + maxorbit);

        this.orbital = rands.reduce((p, c) => p + c, 0) / rands.length;

        this.x = centerx; // All of these stars are at the center x position at all times
        this.y = centery + this.orbital; // Set Y position starting at the center y + the position in the orbit

        this.yOrigin = centery + this.orbital; // this is used to track the particles origin

        this.speed = ((Math.floor(Math.random() * 2.5) + 1.5) * Math.PI) / 180; // The rate at which this star will orbit
        this.rotation = 0; // current Rotation
        this.startRotation =
          ((Math.floor(Math.random() * 360) + 1) * Math.PI) / 180; // Starting rotation

        this.id = stars.length; // This will be used when expansion takes place

        // All stars will spread on hover
        // Calculate random position for expansion on hover (spread across container)
        const spreadAngle = Math.random() * Math.PI * 2; // Random angle in radians

        // Double the spread distance (increase range by 2x)
        // Allow stars to spread beyond container bounds for wider range
        const maxSpreadDistance = Math.min(cw, ch); // Double the distance (was /2, now full width/height)
        const spreadDistance = Math.sqrt(Math.random()) * maxSpreadDistance; // Square root for uniform area distribution

        // Calculate hover position spread across wider area (may extend beyond container)
        const targetX = centerx + Math.cos(spreadAngle) * spreadDistance;
        const targetY = centery + Math.sin(spreadAngle) * spreadDistance;
        // Allow positions to extend beyond container for wider spread
        this.hoverX = targetX;
        this.hoverPos = targetY;

        this.color = "rgba(255,255,255," + (1 - this.orbital / maxorbit) + ")"; // Color the star white, but make it more transparent the further out it is generated
        this.expansePos =
          centery +
          (this.id % 100) * -10 +
          (Math.floor(Math.random() * 20) + 1); // Where the star will go when expansion takes place

        this.prevR = this.startRotation;
        this.prevX = this.x;
        this.prevY = this.y;

        // Store original position for returning
        this.originalY = this.yOrigin;

        stars.push(this);
      }

      draw() {
        if (!state.expanse && !state.returning) {
          // Slow down rotation speed by half when spreading
          const rotationSpeed = state.collapse ? this.speed / 2 : this.speed;
          this.rotation = this.startRotation + currentTime * rotationSpeed;
          if (!state.collapse) {
            // not hovered - return to center orbit
            if (this.y > this.yOrigin) {
              this.y -= 2.5;
            }
            if (this.y < this.yOrigin - 4) {
              this.y += (this.yOrigin - this.y) / 10;
            }
            // Return x to center
            if (Math.abs(this.x - centerx) > 1) {
              this.x += (centerx - this.x) / 10;
            } else {
              this.x = centerx;
            }
          } else {
            // on hover - all stars spread across container
            this.trail = 1;
            const distanceToTargetY = this.hoverPos - this.y;
            const distanceToTargetX = this.hoverX - this.x;
            const distance = Math.sqrt(
              distanceToTargetX * distanceToTargetX +
              distanceToTargetY * distanceToTargetY
            );

            if (distance > 1) {
              // Move towards hover position with smooth interpolation
              // Use adaptive speed: faster when far, slower when close
              const speed = Math.min(0.15, distance / 50);
              this.y += distanceToTargetY * speed;
              this.x += distanceToTargetX * speed;
              // Allow stars to move beyond container bounds for wider spread
            } else {
              // Close enough to target, maintain position
              this.y = this.hoverPos;
              this.x = this.hoverX;
            }
          }
        } else if (state.expanse && !state.returning) {
          this.rotation = this.startRotation + currentTime * (this.speed / 2);
          if (this.y > this.expansePos) {
            this.y -= Math.floor(this.expansePos - this.y) / -80; // Slower expansion for better visibility
          }
        } else if (state.returning) {
          // Returning to original orbit slowly
          this.rotation = this.startRotation + currentTime * this.speed;
          if (Math.abs(this.y - this.originalY) > 2) {
            this.y += (this.originalY - this.y) / 50; // Much slower return
          } else {
            this.y = this.originalY;
            this.yOrigin = this.originalY;
          }
          // Return x to center
          if (Math.abs(this.x - centerx) > 1) {
            this.x += (centerx - this.x) / 50;
          } else {
            this.x = centerx;
          }
        }

        if (!context) return;

        context.save();
        context.fillStyle = this.color;
        context.strokeStyle = this.color;
        context.beginPath();
        const oldPos = rotate(
          centerx,
          centery,
          this.prevX,
          this.prevY,
          -this.prevR
        );
        context.moveTo(oldPos[0], oldPos[1]);
        context.translate(centerx, centery);
        context.rotate(this.rotation);
        context.translate(-centerx, -centery);
        context.lineTo(this.x, this.y);
        context.stroke();
        context.restore();

        this.prevR = this.rotation;
        this.prevX = this.x;
        this.prevY = this.y;
      }
    }

    // Animation loop
    function loop() {
      const now = new Date().getTime();
      currentTime = (now - startTime) / 50;

      if (!context) return;
      context.clearRect(0, 0, cw, ch); // Clear canvas with transparent background

      for (let i = 0; i < stars.length; i++) {
        // For each star
        if (stars[i] !== undefined) {
          stars[i].draw(); // Draw it
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    function init() {
      if (!context) return;
      context.clearRect(0, 0, cw, ch); // Initial clear of the canvas with transparent background
      for (let i = 0; i < 1250; i++) {
        // create 1250 stars (reduced by half)
        new Star();
      }
      loop();
    }

    init();

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      canvasRef.current = null;
    };
  }, [isSpread]);

  // Update canvas position when isSpread changes
  useEffect(() => {
    if (canvasRef.current) {
      if (isSpread) {
        canvasRef.current.style.left = "-500px";
        canvasRef.current.style.top = "-200px";
      } else {
        canvasRef.current.style.left = "0px";
        canvasRef.current.style.top = "-40px";
      }
    }
  }, [isSpread]);

  return (
    <div
      ref={blackholeRef}
      className="w-full h-full absolute top-[-100px] right-0"
    ></div>
  );
}
