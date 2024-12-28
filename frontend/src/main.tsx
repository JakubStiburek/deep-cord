import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  // @ts-expect-error Ignored
  const { worker } = await import("./mocks/browser.js");

  return await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
      options: {
        scope: "/api",
      },
    },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
