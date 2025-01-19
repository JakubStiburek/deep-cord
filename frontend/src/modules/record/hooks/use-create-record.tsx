import { useQueryClient } from "@tanstack/react-query";
import { $api } from "@/modules/common/api";

import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export function useCreateRecord({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  let toastId: string | number;

  const mutation = $api.useMutation("post", "/api/audio/files", {
    onMutate() {
      toastId = toast(
        <div className="flex items-center gap-2">
          <Loader2Icon className=" w-4 h-4 animate-spin duration-[3000]" />
          Creating new record...
        </div>
      );

      return { toastId };
    },

    onSuccess: () => {
      toast.dismiss(toastId);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/audio/files"] });

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
