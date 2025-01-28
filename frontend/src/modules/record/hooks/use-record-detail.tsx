import { $api } from "@/modules/common/api";

export const useRecordDetail = ({ recordId }: { recordId: string }) =>
  $api.useQuery("get", "/api/records/{id}", {
    params: {
      path: {
        id: recordId,
      },
    },
  });
