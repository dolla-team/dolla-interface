import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    //-----------Var Inits--------------
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let confetti: any[] = [];
    const confettiCount = 300;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;

    // Load confetti image
    const confettiImage = new Image();
    confettiImage.src = "/btc/confetti-btc.png";

    //-----------Functions--------------
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const randomRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const initConfetti = () => {
      window.howl.coinDrop.play();
      for (let i = 0; i < confettiCount; i++) {
        const baseSize = randomRange(15, 35); // Base size for square confetti
        confetti.push({
          dimensions: {
            x: baseSize, // Square width
            y: baseSize // Square height
          },

          position: {
            x: randomRange(0, canvas.width),
            y: canvas.height - 1
          },

          rotation: randomRange(0, 2 * Math.PI),
          scale: {
            x: 1,
            y: 1
          },

          velocity: {
            x: randomRange(-25, 25),
            y: randomRange(0, -50)
          }
        });
      }
    };

    //---------Render-----------
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        // Move canvas to position and rotate
        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        // Apply forces to velocity
        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(
          confetto.velocity.y + gravity,
          terminalVelocity
        );
        confetto.velocity.x +=
          Math.random() > 0.5 ? Math.random() : -Math.random();

        // Set position
        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        // Delete confetti when out of frame
        if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

        // Loop confetto x position
        if (confetto.position.x > canvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = canvas.width;

        // Spin confetto by scaling y
        confetto.scale.y = Math.cos(confetto.position.y * 0.1);

        // Draw confetti image instead of rectangle
        if (confettiImage.complete) {
          ctx.drawImage(confettiImage, -width / 2, -height / 2, width, height);
        }

        // Reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      // Fire off another round of confetti
      // if (confetti.length <= 10) {
      //   initConfetti();
      // }

      window.requestAnimationFrame(render);
    };

    //---------Execution--------
    initConfetti();
    render();

    //----------Resize----------
    window.addEventListener("resize", resizeCanvas);

    //------------Click------------
    window.addEventListener("click", initConfetti);

    return () => {
      window.howl.coinDrop.stop();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", initConfetti);
    };
  }, []);

  return ReactDOM.createPortal(
    (
      <canvas
        ref={canvasRef}
        className="!fixed top-0 left-0 w-full h-full !z-[600] pointer-events-none"
      />
    ) as any,
    document.body
  ) as unknown as React.ReactPortal
}
