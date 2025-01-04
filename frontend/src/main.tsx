import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";

// async function enableMocking() {
//   if (process.env.NODE_ENV !== "development") {
//     return;
//   }

//   const { worker } = await import("./mocks/browser.ts");

//   // `worker.start()` returns a Promise that resolves
//   // once the Service Worker is up and ready to intercept requests.
//   return worker.start({
//     onUnhandledRequest: (l, i) => {
//       console.log(l);

//       return;
//     }, // Neinterferujte s požadavky, které nejsou mockované
//     serviceWorker: {
//       url: "/mockServiceWorker.js",
//       options: {
//         scope: "/",
//       },
//     },
//   });
// }
// enableMocking().then(() => {
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// });
