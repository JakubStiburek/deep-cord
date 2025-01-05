import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { DashboardLayout } from "@/modules/common/layouts/dashboard-layout";
import { RecordListPage } from "@/modules/record/pages/record-list-page";
import { RecordDetailPage } from "@/modules/record/pages/record-detail-page";
import { NotFoundPage } from "@/modules/common/pages/not-found";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/records" replace />} />
          <Route
            path="/records"
            element={<RecordListPage />}
            handle={{ crumb: () => "records" }}
          />
          <Route path="records/:id" element={<RecordDetailPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
