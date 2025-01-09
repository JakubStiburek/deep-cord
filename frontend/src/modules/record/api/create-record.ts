import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function createRecordApi(formData: FormData) {
  const response = await axios.post(`${API_URL}/api/audio/files`, formData);
  return response.data;
}
