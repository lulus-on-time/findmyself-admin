import axios from "axios";
import { API_CREATE_FLOOR_PLAN, API_GET_ALL_FLOOR } from "@/config/endpoint";

const postCreateFloorPlan = async (dataToSend: any) => {
  try {
    const response = await axios.post(API_CREATE_FLOOR_PLAN, dataToSend);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getFloorListData = async () => {
  try {
    const response = await axios.get(API_GET_ALL_FLOOR);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { postCreateFloorPlan, getFloorListData as getAllFloorData };
