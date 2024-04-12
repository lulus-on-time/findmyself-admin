const BASE_URL = "http://localhost:8080";

// API ROUTES
const CREATE_FLOOR_PLAN = "/floors/create";
const GET_FLOOR_LIST = "/floors/short";

// API URL
const API_CREATE_FLOOR_PLAN = `${BASE_URL}${CREATE_FLOOR_PLAN}`;
const API_GET_FLOOR_LIST = `${BASE_URL}${GET_FLOOR_LIST}`;

export { API_CREATE_FLOOR_PLAN, API_GET_FLOOR_LIST as API_GET_ALL_FLOOR };
