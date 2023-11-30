import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// components
import DetailSectionTop from "../../components/Detail/DetailSectionTop";
import DetailSectionBottomBox from "../../components/Detail/DetailSectionBottomBox";
import DetailDateAndCount from "../../components/Detail/DetailDateAndCount";

import DetailNoPage from "../../components/Detail/DetailNoPage";

// hooks
import { useDate } from "../../hook/useDate";
import { useDetailAPI } from "../../api/detail";

// library
import { useQuery } from "@tanstack/react-query";

// style
import styled from "styled-components";

export interface IAccommodation {
  id: number;
  name: string;
  image: string;
  address: string;
}

function DetailPage() {
  const [hotelAccommodation, setHotelAccommodation] = useState<null | IAccommodation>(null);
  const { asTodayCheckIn, asTodayCheckOut } = useDate();
  const { refreshAccommodation, refreshAccommodationRooms } = useDetailAPI();
  const params = useParams();
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const areaCode = searchParams.get("area-code") as string;
  const accommodationId = Number(params.id);

  let keyword = searchParams.get("keyword") as string;
  if (keyword?.includes("[")) {
    keyword = keyword.split("[")[0] as string;
  }

  const accommodationQuery = useQuery(["accommodation", keyword, areaCode], () => {
    return refreshAccommodation(keyword, areaCode, setHotelAccommodation);
  });

  const roomsQuery = useQuery(["rooms", accommodationId, asTodayCheckIn, asTodayCheckOut], () => {
    return refreshAccommodationRooms(
      accommodationId,
      String(20 + asTodayCheckIn),
      String(20 + asTodayCheckOut)
    );
  });

  if (accommodationQuery.isLoading || roomsQuery.isLoading) {
    return (
      <Container>
        <Skeleton />
      </Container>
    );
  }

  if (accommodationQuery.data && roomsQuery.data && hotelAccommodation) {
    history.replaceState(
      null,
      "",
      `/detail/${params.id}?keyword=${keyword}&area-code=${areaCode}&checkIn=${asTodayCheckIn}&checkOut=${asTodayCheckOut}&memberCount=${2}`
    );

    return (
      <Container>
        <DetailSectionTop accommodation={hotelAccommodation} />
        <DetailDateAndCount />
        <DetailSectionBottomBox />
      </Container>
    );
  }

  if (accommodationQuery.error || roomsQuery.error) {
    return (
      <Container>
        <DetailNoPage />
      </Container>
    );
  }
}

export default DetailPage;

const Container = styled.section`
  background-color: ${({ theme }) => theme.Color.backgroundColor}};
`;

const Skeleton = styled.div`
  width: 375px;
  height: 100vh;
  border-radius: ${({ theme }) => theme.Br.default};
  background-image: linear-gradient(
    100deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1)
  );
  margin-bottom: 60px;
  background-size: 400% 100%;
  color: rgba(0, 0, 0, 0);

  animation: skeleton-loading 7s linear infinite;
  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
