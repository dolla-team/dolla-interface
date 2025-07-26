// import "./index.css";
import("./index.css")
let x: any;

export default function Temp() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    var $card = e.target as HTMLElement;

    var pos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    // math for mouse position
    var l = pos[0];
    var t = pos[1];
    var h = $card.clientHeight;
    var w = $card.clientWidth;
    var px = Math.abs(Math.floor((100 / w) * l) - 100);
    var py = Math.abs(Math.floor((100 / h) * t) - 100);
    var pa = 50 - px + (50 - py);
    // math for gradient / background positions
    var lp = 50 + (px - 50) / 1.5;
    var tp = 50 + (py - 50) / 1.5;
    var px_spark = 50 + (px - 50) / 7;
    var py_spark = 50 + (py - 50) / 7;
    var p_opc = 20 + Math.abs(pa) * 1.5;
    var ty = ((tp - 50) / 2) * -1;
    var tx = ((lp - 50) / 1.5) * 0.5;
    // css to apply for active card
    var grad_pos = `background-position: ${lp}% ${tp}%;`;
    var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`;
    var opc = `opacity: ${p_opc / 100};`;
    var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`;
    // need to use a <style> tag for psuedo elements
    var style = `
      .card:hover:before { ${grad_pos} }  /* gradient */
      .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
    `;
    // set / apply css class and style
    $card.classList.remove("active");
    $card.classList.remove("animated");
    // @ts-ignore
    $card.style = tf;

    const hoverEl = document.querySelector(".hover");

    if (hoverEl) hoverEl.innerHTML = style;

    clearTimeout(x);
  };
  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    var $card = e.target as HTMLElement;

    $card.style.transform = "";
    x = setTimeout(() => {
      $card.classList.add("animated");
    }, 2500);
  };
  return (
    <section className="cards bg-black w-screen h-screen relative">
      {["charizard", "pika", "eevee"].map((item: string) => (
        <div className="three-d-wrapper" key={item}>
          <div
            className={`card ${item}`}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
          ></div>
        </div>
      ))}
      <style className="hover"></style>
    </section>
  );
}
