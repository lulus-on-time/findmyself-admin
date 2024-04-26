import axios from "axios";
import {
  API_EDIT_ACCESS_POINT,
  API_GET_ACCESS_POINT_DETAIL,
  API_GET_ACCESS_POINT_GEOJSON,
  API_GET_ALL_ACCESS_POINT,
} from "@/config/endpoint";

const getAllAccessPoint = async () => {
  try {
    const response = await axios.get(API_GET_ALL_ACCESS_POINT);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAccessPointDetail = async (floorId: any) => {
  try {
    const response = await axios.get(API_GET_ACCESS_POINT_DETAIL(floorId));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAccessPointGeoJSON = async (floorId: any) => {
  try {
    const response = await axios.get(API_GET_ACCESS_POINT_GEOJSON(floorId));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const postEditAccessPoint = async (floorId: any, dataToSend: any) => {
  try {
    const response = await axios.post(
      API_EDIT_ACCESS_POINT(floorId),
      dataToSend,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  getAllAccessPoint,
  getAccessPointDetail,
  getAccessPointGeoJSON,
  postEditAccessPoint,
};
