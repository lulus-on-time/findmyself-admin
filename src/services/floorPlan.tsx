import axios from "axios";
import { API_CREATE_FLOOR_PLAN } from "@/config/endpoint";

export const postCreateFloorPlan = async (dataToSend: any) => {
  try {
    const response = await axios.post(API_CREATE_FLOOR_PLAN, dataToSend);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
