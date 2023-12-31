import { useNavigate } from "react-router-dom";
import axios from "axios";

// config
import { API_BASE_URL } from "./config";

// interfaces
import { IAccommodation } from "../pages/detailPage/DetailPage";

// store
import { accommodationRoomsList } from "../store/accommodationList";

type SetAccommodationType = (value: IAccommodation) => void;

export const useDetailAPI = () => {
  const navigate = useNavigate();

  const { setAccommodationRooms } = accommodationRoomsList();

  // 호텔 정보 API
  const refreshAccommodation = async (
    keyword: string,
    areaCode: string,
    setHotelAccommodation: SetAccommodationType
  ) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/accommodations?keyword=${keyword}&area-code=${areaCode}`
      );

      setHotelAccommodation(data.data);

      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // 해당 호텔 객실 정보 API
  const refreshAccommodationRooms = async (
    accommodationId: number,
    checkIn: string,
    checkOut: string
  ) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/rooms/${accommodationId}?check-in=${checkIn}&check-out=${checkOut}`
      );

      setAccommodationRooms(data.data);

      return data;
    } catch (e) {
      console.error(e);
    }
  };

  const postAccommodationRooms = async (
    roomTypeId: number,
    accommodationId: number,
    guestNumber: number,
    checkIn: string,
    checkOut: string,
    keyword: string,
    areaCode: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/carts`,
        {
          roomTypeId: roomTypeId,
          accommodationId: accommodationId,
          guestNumber: guestNumber,
          checkIn: checkIn,
          checkOut: checkOut,
          keyword: keyword,
          areaCode: areaCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.status >= 200 && response.status < 300) {
        navigate("/cart");
      }

      return response;
    } catch (e) {
      console.error(e);
    }
  };

  return { refreshAccommodation, refreshAccommodationRooms, postAccommodationRooms };
};
