const BASE_URL = "http://localhost:8080";

// ========== API ROUTES ==========

// FLOOR PLAN
const CREATE_FLOOR_PLAN = "/floors/create";
const GET_ALL_FLOOR_PLAN = "/floors/short";
const GET_FLOOR_PLAN_DETAIL = "/floors/";
const DELETE_FLOOR_PLAN = "/floors/";

// ACCESS POINT
const GET_ALL_ACCESS_POINT = "/aps";
const GET_ACCESS_POINT_DETAIL = "/aps/";

// ========== API URL ===========

// FLOOR PLAN
const API_CREATE_FLOOR_PLAN = `${BASE_URL}${CREATE_FLOOR_PLAN}`;
const API_GET_ALL_FLOOR_PLAN = `${BASE_URL}${GET_ALL_FLOOR_PLAN}`;
const API_GET_FLOOR_PLAN_DETAIL = (floorId: any) =>
  `${BASE_URL}${GET_FLOOR_PLAN_DETAIL}${floorId}`;
const API_DELETE_FLOOR_PLAN = (floorId: any) =>
  `${BASE_URL}${DELETE_FLOOR_PLAN}${floorId}`;

// ACCESS POINT
const API_GET_ALL_ACCESS_POINT = `${BASE_URL}${GET_ALL_ACCESS_POINT}`;
const API_GET_ACCESS_POINT_DETAIL = (floorId: any) =>
  `${BASE_URL}${GET_ACCESS_POINT_DETAIL}${floorId}`;

export {
  API_CREATE_FLOOR_PLAN,
  API_GET_ALL_FLOOR_PLAN,
  API_GET_FLOOR_PLAN_DETAIL,
  API_GET_ALL_ACCESS_POINT,
  API_DELETE_FLOOR_PLAN,
  API_GET_ACCESS_POINT_DETAIL,
};
