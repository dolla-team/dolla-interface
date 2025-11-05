import { useNavigate as useReactNavigate } from "react-router-dom";

export default function useNavigate() {
  const navigateNative = useReactNavigate();

  const navigate = async (path: string) => {
    try {
      const res = await fetch("/version.json", { cache: "no-store" });
      const { version } = await res.json();
      const current = localStorage.getItem("app_version");
      console.log("current version", current, version);

      localStorage.setItem("app_version", version);
      if (current && current !== version) {
        navigateNative(path);
        window.location.reload();
      } else {
        navigateNative(path);
      }
    } catch (err) {
      navigateNative(path);
    }
  };
  return navigate;
}
