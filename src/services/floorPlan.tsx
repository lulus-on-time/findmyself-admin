import axios from "axios";
import {
  API_CREATE_FLOOR_PLAN,
  API_GET_FLOOR_PLAN_DETAIL,
  API_GET_FLOOR_PLAN_LIST,
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

const getFloorPlanList = async () => {
  try {
    const response = await axios.get(API_GET_FLOOR_PLAN_LIST);
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

export { postCreateFloorPlan, getFloorPlanList, getFloorPlanDetail };
