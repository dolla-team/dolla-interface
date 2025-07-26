import { Buffer } from "buffer";
import process from "process";

if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
  (window as any).process = process;
}

if (typeof global === "undefined") {
  (window as any).global = window;
}

if (typeof window !== "undefined") {
  (document as any)._createElement = document.createElement;
  document.createElement = function (tagName: any) {
    if (tagName.toLowerCase() === "link") {
      const link = (document as any)._createElement(tagName);
      link.onerror = function () {
        const _link = (document as any)._createElement("link");
        _link.href = link.href;
        _link.rel = "stylesheet";
        document.head.appendChild(_link);
      };
      return link;
    }
    return (document as any)._createElement(tagName);
  };
}