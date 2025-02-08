import { DashboardWrapper } from "@/modules/common/layouts/dashboard-wrapper";
import { useParams } from "react-router";
import { useRecordDetail } from "../hooks/use-record-detail";

import { RecordEditor } from "../components/record-editor/record-editor";

export function RecordDetailPage() {
  const params = useParams();

  const { data } = useRecordDetail({ recordId: params.id! });

  return (
    <DashboardWrapper path={`/records/${data?.file.name}`}>
      <h2 className="text-foreground text-lg">Name: {data?.file.name}</h2>
      <h3 className="text-muted-foreground text-sm">URI: {data?.file.uri}</h3>
      <div className="flex flex-col mt-4 gap-4">
        <RecordEditor record={data} />
      </div>
    </DashboardWrapper>
  );
}
