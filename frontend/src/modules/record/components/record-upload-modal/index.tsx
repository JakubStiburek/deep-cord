import { useDropzone } from "react-dropzone";
import { Button } from "@/modules/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/common/components/ui/dialog";
import { Input } from "@/modules/common/components/ui/input";
import { Label } from "@/modules/common/components/ui/label";
import {
  PropsWithChildren,
  useCallback,
  useState,
  useEffect,
  FormEvent,
} from "react";

import { toast } from "sonner";

import { useCreateRecord } from "../../hooks/use-create-record";

export function RecordUploadModal({
  children,
  open,
  setOpen,
}: PropsWithChildren & { open: boolean; setOpen: (open: boolean) => void }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [recordName, setRecordName] = useState("");

  const resetForm = () => {
    setSelectedFiles([]);
    setRecordName("");
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFiles([acceptedFiles[0]]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileSelect,
  } = useDropzone({
    onDrop,
    accept: {
      "audio/mp3": [".mp3"],
    },
    multiple: false,
    noDragEventsBubbling: true,
  });

  const mutation = useCreateRecord({
    onSuccess: () => {
      setOpen(false);
      resetForm();
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFiles[0]);
    formData.append("name", recordName);

    mutation.mutate(formData);
  };
  return (
    <Dialog {...{ open, onOpenChange: setOpen }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create new record</DialogTitle>
            <DialogDescription>
              Select file to upload and name of your record. Click "create" when
              you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="file">Audio file</Label>
              <div
                className="border-primary-500 rounded-md border-[1px] h-60 flex justify-center items-center cursor-pointer"
                {...getRootProps()}
              >
                <input
                  key={
                    selectedFiles.length > 0 ? selectedFiles[0].name : "empty"
                  }
                  {...getInputProps()}
                />
                {selectedFiles.length < 1 ? (
                  isDragActive ? (
                    <p>Drop file here...</p>
                  ) : (
                    <p>Drag and drop a file here, or click to select one</p>
                  )
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <p>{selectedFiles[0].name}</p>
                    <Button
                      type="button"
                      variant={"outline"}
                      onClick={openFileSelect}
                    >
                      Select other file
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Record name</Label>
              <Input
                id="name"
                value={recordName}
                onChange={(e) => setRecordName(e.target.value)}
                placeholder="e.g. my record"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={selectedFiles.length < 1 || mutation.isPending}
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
