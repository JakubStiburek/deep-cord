import { useQuery } from "@tanstack/react-query";
import { fetchRecordsListApi } from "../api/fetch-records";

export const useRecords = () => {
  const query = useQuery({
    queryKey: ["records"],
    queryFn: fetchRecordsListApi,
  });
  return query;
};
