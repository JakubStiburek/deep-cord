import { BrowserRouter, Routes, Route } from "react-router";

import { ThemeProvider } from "@/modules/common/providers/theme-provider";

import { DashboardLayout } from "./modules/common/layouts/dashboard-layout";
import { RecordListPage } from "./modules/record/pages/record-list-page";
import { RecordDetailPage } from "./modules/record/pages/record-detail-page";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<RecordListPage />} />
            <Route path="/detail" element={<RecordDetailPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
