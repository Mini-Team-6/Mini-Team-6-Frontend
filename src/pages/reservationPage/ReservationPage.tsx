// library
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

// component
import ReservationInfoSection from "../../components/Reservation/ReservationInfoSection";
import ReservationPersonInfoSection from "../../components/Reservation/ReservationPersonInfoSection";
import ActualUserInfoSection from "../../components/Reservation/ActualUserInfoSection";
import PaymentSelectionSection from "../../components/Reservation/PaymentSelectionSection";
import PaymentCautions from "../../components/Reservation/PaymentCautions";
import Loading from "../../components/Loading";

// api
import useReservationApi from "../../api/reservation";

// function
import {
  addHyphensToDate,
  calculateNumberOfNights,
  removeHyphensFromDate,
} from "../../utils/formatOrCalculateData";
import { addCommasToNumber } from "../../utils/addCommasToNumber";
import { scrollToTop } from "../../utils/scrollToTop";

//type
import type {
  CartReservation,
  ReservationInfo,
  ReservationRoomsProps,
  SingleReservation,
  StateInfo,
} from "../../types/reservationTypes";

function ReservationPage() {
  useEffect(() => {
    scrollToTop();
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { getData, postCartReservation, postSingleReservation } = useReservationApi();

  // 예약자 정보
  const [reservationPersonName, setReservationPersonName] = useState<string>("");
  const [reservationPersonContact, setReservationPersonContact] = useState<string>("");

  // 결제수단
  const [paymentType, setPaymentType] = useState<string>("");

  // 카트 예약시 정보
  const [searchParams] = useSearchParams();
  const cartIds = searchParams.get("cartIds");

  // 단건 예약시 정보
  const location = useLocation();
  const reservationFromDetail = location.state;

  // 예약 정보
  const [reservationInfoList, setReservationInfoList] = useState<ReservationInfo[]>([]);
  const [hasNoData, setHasNoData] = useState<boolean>(false);

  useEffect(() => {
    if (cartIds) {
      // 카트 예약
      getCartReservationInfo(cartIds);
    } else if (reservationFromDetail !== null) {
      // 단건 예약
      getSingleReservationInfo();
    } else {
      // 잘못된 접근
      setHasNoData(true);
    }
  }, [cartIds, reservationFromDetail]);

  /** 카트 정보 fetch 후 선택된 item들을 예약 정보에 저장 */
  const getCartReservationInfo = async (cartId: string) => {
    try {
      const ids = cartId.split(",");
      setIsLoading(true);
      const data = await getData("carts");
      const filteredData = await data.data.filter((item: ReservationInfo) =>
        ids.includes(item.id.toString())
      );
      setReservationInfoList(filteredData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  /** 단건 예약 정보를 location.state에서 가져와서 예약 정보에 저장 */
  const getSingleReservationInfo = async () => {
    const singleReservationInfo: ReservationInfo = createReservationInfo(
      location.state.reservation
    );
    setReservationInfoList([singleReservationInfo]);
  };

  /** 단건 예약 정보 state를 ReservationInfo 타입으로 변환 */
  const createReservationInfo = (data: StateInfo): ReservationInfo => {
    return {
      id: Number(data.accomodationId),
      guestNumber: data.guestNumber ?? 0,
      checkIn: addHyphensToDate(data.checkIn),
      checkOut: addHyphensToDate(data.checkOut),
      roomGetResponse: {
        id: data.roomTypeId,
        roomTypeId: data.roomTypeId,
        name: data.roomName,
        description: "",
        price: data.price,
        image: "",
        stock: 0,
        capacity: data.capacity,
        accommodation: null,
      },
      accommodationGetResponse: {
        AccommodationId: Number(data.accomodationId),
        accommodationType: "",
        name: data.accomodationName,
        location: {
          address: "",
          phone: "",
          areaCode: data.areaCode,
          latitude: 0,
          longitude: 0,
        },
        image: "",
        description: "",
      },
    };
  };

  /** 예약 정보를 ReservationRoomsProps 타입으로 변환*/
  const convertToReservationRoomsProps = (
    reservationInfo: ReservationInfo[]
  ): ReservationRoomsProps[] => {
    return reservationInfo.map((info) => {
      const {
        accommodationGetResponse: {
          AccommodationId: accommodationId,
          name: accommodationName,
          location: { areaCode },
        },
        roomGetResponse: { roomTypeId },
        checkIn,
        checkOut,
        guestNumber,
      } = info;

      return {
        accommodationId,
        accommodationName,
        areaCode,
        roomTypeId,
        checkIn: removeHyphensFromDate(checkIn),
        checkOut: removeHyphensFromDate(checkOut),
        guestNumber,
      };
    });
  };

  /** post /reservations/from-cart api를 위한 req body 리턴 */
  const convertToCartReservation = (
    cartId: string,
    paymentType: string,
    reservationInfo: ReservationInfo[]
  ): CartReservation => {
    const cartIds: number[] = cartId.split(",").map((id: string) => parseInt(id));
    const reservationRooms = convertToReservationRoomsProps(reservationInfo);

    return {
      cartIds,
      paymentType,
      reservationRooms,
    };
  };

  /** post /reservations api를 위한 req body 리턴 */
  const convertToSingleReservation = (
    paymentType: string,
    reservationInfo: ReservationInfo[]
  ): SingleReservation => {
    const reservationRooms = convertToReservationRoomsProps(reservationInfo);

    return {
      paymentType,
      reservationRooms,
    };
  };

  /** 예약 상황(카트 or 단건)에 맞게 결제(=예약 생성) api 호출 및 에러 핸들링 */
  const postReservation = async () => {
    if (paymentType === "") {
      alert("결제 수단을 선택해주세요");
      return;
    }
    try {
      setIsLoading(true);
      if (cartIds) {
        const data = convertToCartReservation(cartIds, paymentType, reservationInfoList);
        await postCartReservation(data);
      } else if (reservationFromDetail !== null) {
        const data = convertToSingleReservation(paymentType, reservationInfoList);
        await postSingleReservation(data);
      }
      alert("예약에 성공했습니다.");
      navigate("/reservation-history");
    } catch (error) {
      alert("예약에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const priceToPay: number = reservationInfoList.reduce((acc: number, item: ReservationInfo) => {
    const nightsCount = calculateNumberOfNights(item.checkIn, item.checkOut);
    return acc + item.roomGetResponse.price * nightsCount;
  }, 0);

  if (hasNoData) return <ErrorPage>잘못된 접근 방식입니다</ErrorPage>;
  else
    return (
      <>
        {isLoading && <Loading />}
        <ReservationInfoSection reservationInfoList={reservationInfoList} />
        <ReservationPersonInfoSection
          reservationPersonName={reservationPersonName}
          setReservationPersonName={setReservationPersonName}
          reservationPersonContact={reservationPersonContact}
          setReservationPersonContact={setReservationPersonContact}
        />
        <ActualUserInfoSection
          reservationPersonName={reservationPersonName}
          reservationPersonContact={reservationPersonContact}
        />
        <PaymentSelectionSection paymentType={paymentType} setPaymentType={setPaymentType} />
        <PaymentCautions />
        <SectionBottom>
          <button onClick={postReservation}>{addCommasToNumber(priceToPay)}원 결제하기</button>
        </SectionBottom>
      </>
    );
}

export default ReservationPage;

const SectionBottom = styled.div`
  margin-bottom: 1rem;
  padding: 0 1rem;

  button {
    text-align: center;
    cursor: pointer;
    width: 100%;
    padding: 1rem;
    background-color: ${({ theme }) => theme.Color.mainColor};
    color: ${({ theme }) => theme.Color.componentColor};
    font-size: ${({ theme }) => theme.Fs.default};
    font-weight: 600;
    border-radius: ${({ theme }) => theme.Br.default};
    &:hover {
      transition: all 0.3s;
      background-color: ${({ theme }) => theme.Color.hoverColor};
    }
  }
`;

const ErrorPage = styled.div`
  display: flex;
  padding-top: 100px;
  width: 100%;
  justify-content: center;
  font-weight: bold;
`;
