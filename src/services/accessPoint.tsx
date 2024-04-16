import axios from "axios";
import { API_GET_ALL_ACCESS_POINT } from "@/config/endpoint";

const getAllAccessPoint = async () => {
  try {
    const response = await axios.get(API_GET_ALL_ACCESS_POINT);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { getAllAccessPoint };
