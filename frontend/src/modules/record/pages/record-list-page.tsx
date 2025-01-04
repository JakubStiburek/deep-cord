import { useDropzone } from "react-dropzone";
import { useState, useCallback, useEffect } from "react";

import axios from "axios";

import { UploadsTable } from "@/modules/record/components/uploads-table";

const API_URL = import.meta.env.VITE_API_URL;

export function RecordListPage() {
  const [files, setFiles] = useState([]);

  const fetchFiles = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/audio/files`);
      setFiles(response.data.files);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      setSelectedFiles((prevState) => [...prevState, file]);
    });
  }, []);

  const [uploadStatus, setUploadStatus] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mp3": [".mp3"],
    },
    multiple: false,
  });

  const onUpload = async () => {
    setUploadStatus("Uploading....");
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await axios.post(`${API_URL}/api/audio/files`, formData);
      console.log(response.data);
      fetchFiles();
      setUploadStatus("upload successful");
    } catch (error) {
      console.log("fileUpload" + error);
      setUploadStatus("Upload failed..");
    }
  };
  return (
    <div>
      <div
        className={
          "border-primary-500 rounded-md border-[1px] h-60 flex justify-center items-center"
        }
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop file(s) here ...</p>
        ) : (
          <p>Drag and drops file(s) here, or click to select files</p>
        )}
      </div>
      {selectedFiles.length > 0 && (
        <div>
          <button onClick={onUpload}>Upload</button>
          <p>{uploadStatus}</p>
        </div>
      )}
      <UploadsTable data={files} />
    </div>
  );
}
