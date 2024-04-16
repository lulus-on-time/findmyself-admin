import axios from "axios";
import {
  API_CREATE_FLOOR_PLAN,
  API_GET_ALL_FLOOR_PLAN,
  API_GET_FLOOR_PLAN_DETAIL,
} from "@/config/endpoint";

const postCreateFloorPlan = async (dataToSend: any) => {
  try {
    const response = await axios.post(API_CREATE_FLOOR_PLAN, dataToSend);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllFloorPlan = async () => {
  try {
    const response = await axios.get(API_GET_ALL_FLOOR_PLAN);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getFloorPlanDetail = async (floorId: any) => {
  try {
    const response = await axios.get(API_GET_FLOOR_PLAN_DETAIL(floorId));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { postCreateFloorPlan, getAllFloorPlan, getFloorPlanDetail };
