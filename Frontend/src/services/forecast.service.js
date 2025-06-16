import axios from "axios";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getAllFiles = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/forecast/sheet-upload/`,
      getHeaders()
    );

    return response;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};
