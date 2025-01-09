import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchRecordsListApi = async () => {
  const res = await axios.get(`${API_URL}/api/audio/files`);

  return res.data?.files;
};
