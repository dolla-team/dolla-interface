import "./polyfills";
import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./app.tsx";
import("./index.css")

createRoot(document.getElementById("root")!).render(<App />);
