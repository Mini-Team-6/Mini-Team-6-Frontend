import styled from "styled-components";
import { useEffect, useState } from "react";
import useReservationApi from "../../api/reservation";
import ReservationHistoryItem from "../../components/Reservation/ReservationHistoryItem";
import Loading from "../../components/Loading";

export interface HistoryRoomProps {
  id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  guest_number: number;
  status: string;
}

export interface ReservationHistory {
  id: number;
  created_at: string;
  paymentType: string;
  reservation_rooms: HistoryRoomProps[];
}

function ReservationHistoryPage() {
  // const [reservationHistory, setReservationHistory] = useState<ReservationHistory[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getData } = useReservationApi();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getData("reservations");
      setIsLoading(false);
      // setReservationHistory(data.data);
      console.log(data);
    } catch (error) {
      console.log(error);
      alert("예약 내역 조회를 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <PageContainer>
        {Dummy?.length !== 0 ? (
          Dummy?.map((item, index) => {
            return <ReservationHistoryItem key={index} item={item} />;
          })
        ) : (
          <ErrorPage>예약 내역이 없습니다.</ErrorPage>
        )}
      </PageContainer>
    </>
  );
}

export default ReservationHistoryPage;

const Dummy: ReservationHistory[] = [
  {
    id: 1,
    created_at: "2023.11.29(수)",
    paymentType: "KAKAO_PAY",
    reservation_rooms: [
      {
        id: 4930294802894,
        room_id: 1,
        check_in: "2023.11.29(수)",
        check_out: "2023.11.30(목)",
        guest_number: 2,
        status: "RESERVED",
      },
      {
        id: 4930294802823,
        room_id: 1,
        check_in: "2023.11.29(수)",
        check_out: "2023.11.30(금)",
        guest_number: 1,
        status: "RESERVED",
      },
    ],
  },
  {
    id: 1,
    created_at: "2023.11.30(수)",
    paymentType: "CARD",
    reservation_rooms: [
      {
        id: 4930294802894,
        room_id: 1,
        check_in: "2023.12.01(금)",
        check_out: "2023.12.02(토)",
        guest_number: 2,
        status: "RESERVED",
      },
    ],
  },
];

const PageContainer = styled.section`
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 16px;
`;

const ErrorPage = styled.div`
  display: flex;
  padding-top: 100px;
  width: 100%;
  justify-content: center;
  font-weight: bold;
`;
