// hooks
import { useEffect, useState } from "react";

// libraries
import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// components
import DetailSectionTop from "../../components/Detail/DetailSectionTop";
import DetailDateAndCount from "../../components/Detail/DetailDateAndCount";
import DetailSectionBottomBox from "../../components/Detail/DetailSectionBottomBox";

// style
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import { useDate } from "../../hook/useDate";

export interface IAccommodation {
  id: number;
  name: string;
  image: string;
  address: string;
}

export interface IAccommodationRooms {
  roomTypeId: number;
  name: string;
  description: string;
  image: string;
  stock: number;
  capacity: number;
  price: number;
}

function DetailPage() {
  const [hotelAccommodation, setHotelAccommodation] = useState<null | IAccommodation>(null);
  const [roomAccommodation, setRoomAccommodation] = useState<IAccommodationRooms[]>([]);
  const { asTodayCheckIn, asTodayCheckOut } = useDate();

  const params = useParams();
  const { search } = useLocation();

  const refreshAccommodation = async (keyword: string, areaCode: string) => {
    try {
      const response = await axios.get(
        `https://travel-server.up.railway.app/accommodations?keyword=${keyword}&area-code=${areaCode}`
      );

      const { data } = response.data;
      setHotelAccommodation(data);
    } catch (e) {
      console.log(e);
    }
  };

  const refreshAccommodationRooms = async (accommodationId: string) => {
    try {
      const response = await axios.get(
        `https://travel-server.up.railway.app/rooms/${accommodationId}`
      );

      const { data } = response.data;
      setRoomAccommodation(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(search);

    let keyword = queryParams.get("keyword");
    if (keyword?.includes("[")) {
      keyword = keyword.split("[")[0];
    }

    const areaCode = queryParams.get("area-code");

    const accommodationId = params.id;

    history.replaceState(
      null,
      "",
      `/detail/${params.id}?keyword=${keyword}&area-code=${areaCode}&checkIn=${asTodayCheckIn}&checkOut=${asTodayCheckOut}&memberCount=${2}`
    );

    refreshAccommodation(keyword as string, areaCode as string);
    refreshAccommodationRooms(accommodationId as string);
  }, [asTodayCheckIn, asTodayCheckOut, params.areaCode, params.id, params.keyword, search]);

  if (hotelAccommodation && roomAccommodation) {
    return (
      <Container>
        <DetailSectionTop accommodation={hotelAccommodation} />
        <DetailDateAndCount />
        <DetailSectionBottomBox accommodation={roomAccommodation} />
      </Container>
    );
  }
}

export default DetailPage;

const Container = styled.section`
  background-color: ${({ theme }) => theme.Color.backgroundColor}};
`;
