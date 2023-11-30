// library
import axios from "axios";

// config
import { API_BASE_URL } from "./config";

// type
import { CartReservation, SingleReservation } from "../types/reservationTypes";

const getAuth = () => {
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    return token;
  }
};

/** endPoint를 입력하면 해당 주소로 get 요청 후 res.data를 return하는 함수 */
const getData = async (endPoint: string) => {
  const apiURL = `${API_BASE_URL}/${endPoint}`;
  const config = {
    headers: { Authorization: `Bearer ${getAuth()}` },
  };
  const result = await axios.get(apiURL, config);

  return result.data;
};

const postSingleReservation = async (data: SingleReservation) => {
  const apiURL = `${API_BASE_URL}/reservations`;
  const config = {
    headers: { Authorization: `Bearer ${getAuth()}` },
  };

  const result = await axios.post(apiURL, data, config);

  return result.data;
};

const postCartReservation = async (data: CartReservation) => {
  const apiURL = `${API_BASE_URL}/reservations/from-cart`;
  const config = {
    headers: { Authorization: `Bearer ${getAuth()}` },
  };

  const result = await axios.post(apiURL, data, config);

  return result.data;
};

export { getData, postSingleReservation, postCartReservation };
