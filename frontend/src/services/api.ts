import axios from "axios";

const API_URL = "http://localhost:8000";

export const detectImage = async (image: string) => {
  const response = await axios.post(`${API_URL}/detect`, {
    image,
  });

  return response.data;
};