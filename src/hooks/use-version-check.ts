import { useEffect } from "react";

export default function useVersionCheck() {
  useEffect(() => {
    async function checkVersion() {
      try {
        const res = await fetch("/version.json", { cache: "no-store" });
        const { version } = await res.json();
        const current = localStorage.getItem("app_version");

        console.log("current version", current, version);

        localStorage.setItem("app_version", version);
        if (current && current !== version) {
          window.location.reload();
        }
      } catch (err) {
        console.warn("Version check failed:", err);
      }
    }

    // Initial check on mount
    checkVersion();

    // Dispatch a custom event whenever the URL changes
    const dispatchLocationChange = () => {
      window.dispatchEvent(new Event("locationchange"));
    };

    // Intercept pushState and replaceState to detect SPA navigations
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      // @ts-expect-error preserve this binding
      const ret = originalPushState.apply(this, args);
      dispatchLocationChange();
      return ret;
    } as typeof window.history.pushState;

    window.history.replaceState = function (...args) {
      // @ts-expect-error preserve this binding
      const ret = originalReplaceState.apply(this, args);
      dispatchLocationChange();
      return ret;
    } as typeof window.history.replaceState;

    // Translate back/forward navigations to the same custom event
    const onPopState = () => {
      dispatchLocationChange();
    };
    window.addEventListener("popstate", onPopState);

    // Run version check whenever pathname changes
    const onLocationChange = () => {
      checkVersion();
    };
    window.addEventListener("locationchange", onLocationChange);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("locationchange", onLocationChange);
      // Restore original history methods
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);
}
