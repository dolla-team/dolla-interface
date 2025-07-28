import "./polyfills";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@near-wallet-selector/modal-ui/styles.css";
import App from "./app.tsx";

createRoot(document.getElementById("root")!).render(<App />);
