import { UploadsTable } from "@/modules/record/components/record-uploads-table";
import { DashboardPaper } from "@/modules/common/layouts/dashboard-paper";
import { RecordUploadModal } from "../components/record-upload-modal";
import { PlusIcon } from "lucide-react";
import { Button } from "@/modules/common/components/ui/button";

import { useState } from "react";

export function RecordListPage() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardPaper>
      <div className="flex justify-end">
        <RecordUploadModal
          {...{
            open,
            setOpen: (value) => {
              setOpen(value);
            },
          }}
        >
          <Button size={"sm"} variant={"secondary"}>
            <PlusIcon className="h-5 w-5 font-extrabold" /> New record
          </Button>
        </RecordUploadModal>
      </div>

      <UploadsTable />
    </DashboardPaper>
  );
}
