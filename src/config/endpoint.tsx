const BASE_URL = "http://localhost:8080";

// API ROUTES
const CREATE_FLOOR_PLAN = "/floors/create";
const GET_FLOOR_PLAN_LIST = "/floors/short";
const GET_FLOOR_PLAN_DETAIL = "/floors?floorId=";

// API URL
const API_CREATE_FLOOR_PLAN = `${BASE_URL}${CREATE_FLOOR_PLAN}`;
const API_GET_FLOOR_PLAN_LIST = `${BASE_URL}${GET_FLOOR_PLAN_LIST}`;
const API_GET_FLOOR_PLAN_DETAIL = (floorId: any) =>
  `${BASE_URL}${GET_FLOOR_PLAN_DETAIL}${floorId}`;

export {
  API_CREATE_FLOOR_PLAN,
  API_GET_FLOOR_PLAN_LIST,
  API_GET_FLOOR_PLAN_DETAIL,
};
