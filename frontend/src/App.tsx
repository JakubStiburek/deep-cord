import { ThemeProvider } from "@/modules/common/providers/theme-provider";
import Router from "./router";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router />
    </ThemeProvider>
  );
}
