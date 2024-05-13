const BASE_URL = "http://35.219.115.59";

// ========== API ROUTES ==========

// FLOOR PLAN
const CREATE_FLOOR_PLAN = "/floors/create";
const GET_ALL_FLOOR_PLAN = "/floors/short";
const GET_FLOOR_PLAN_DETAIL = "/floors/";
const DELETE_FLOOR_PLAN = "/floors/";
const EDIT_FLOOR_PLAN = (floorId: any) => `/floors/${floorId}/edit`;

// ACCESS POINT
const GET_ALL_ACCESS_POINT = "/aps";
const GET_ACCESS_POINT_DETAIL = "/aps/";
const GET_ACCESS_POINT_GEOJSON = (floorId: any) =>
  `/aps/${floorId}?type=geojson`;
const EDIT_ACCESS_POINT = (floorId: any) => `/aps/${floorId}/edit`;

// ========== API URL ===========

// FLOOR PLAN
const API_CREATE_FLOOR_PLAN = `${BASE_URL}${CREATE_FLOOR_PLAN}`;
const API_GET_ALL_FLOOR_PLAN = `${BASE_URL}${GET_ALL_FLOOR_PLAN}`;
const API_GET_FLOOR_PLAN_DETAIL = (floorId: any) =>
  `${BASE_URL}${GET_FLOOR_PLAN_DETAIL}${floorId}`;
const API_DELETE_FLOOR_PLAN = (floorId: any) =>
  `${BASE_URL}${DELETE_FLOOR_PLAN}${floorId}`;
const API_EDIT_FLOOR_PLAN = (floorId: any) =>
  `${BASE_URL}${EDIT_FLOOR_PLAN(floorId)}`;

// ACCESS POINT
const API_GET_ALL_ACCESS_POINT = `${BASE_URL}${GET_ALL_ACCESS_POINT}`;
const API_GET_ACCESS_POINT_DETAIL = (floorId: any) =>
  `${BASE_URL}${GET_ACCESS_POINT_DETAIL}${floorId}`;
const API_GET_ACCESS_POINT_GEOJSON = (floorId: any) =>
  `${BASE_URL}${GET_ACCESS_POINT_GEOJSON(floorId)}`;
const API_EDIT_ACCESS_POINT = (floorId: any) =>
  `${BASE_URL}${EDIT_ACCESS_POINT(floorId)}`;

export {
  API_CREATE_FLOOR_PLAN,
  API_GET_ALL_FLOOR_PLAN,
  API_GET_FLOOR_PLAN_DETAIL,
  API_DELETE_FLOOR_PLAN,
  API_EDIT_FLOOR_PLAN,
  API_GET_ALL_ACCESS_POINT,
  API_GET_ACCESS_POINT_DETAIL,
  API_GET_ACCESS_POINT_GEOJSON,
  API_EDIT_ACCESS_POINT,
};
