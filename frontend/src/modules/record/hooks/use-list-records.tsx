import { $api } from "@/modules/common/api";

export const useRecords = () => $api.useQuery("get", "/api/audio/files");
