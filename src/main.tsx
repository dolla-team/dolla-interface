import "./polyfills";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app.tsx";
import ErrorPage from "./views/error-page";
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN as string,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true
  });
}

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<ErrorPage />}>
    <App />
  </Sentry.ErrorBoundary>
);
