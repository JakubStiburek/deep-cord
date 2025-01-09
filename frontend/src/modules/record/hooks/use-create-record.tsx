import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { createRecordApi } from "../api/create-record";

export function useCreateRecord({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const toastId = toast(
        <div className="flex items-center gap-2">
          <Loader2Icon className=" w-4 h-4 animate-spin duration-[3000]" />
          Creating new record...
        </div>
      );
      return {
        response: await createRecordApi(formData),
        toastId,
      };
    },
    onSuccess: ({ toastId }) => {
      toast.dismiss(toastId);
      queryClient.invalidateQueries({ queryKey: ["rates"] });

      onSuccess();
      toast.success("New record created");
    },
    onError: (error: Error & { response: { data: { message: string } } }) => {
      console.log(error);
      toast.error(
        `Error: ${error.response?.data?.message || "Error creating new record"}`
      );
    },
  });

  return mutation;
}
