import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

// hooks
import { useDetailAPI } from "../../api/detail";

// library
import { useQuery } from "@tanstack/react-query";

// icon
import Cart from "../../assets/icons/cart.svg?react";
import Hotel from "../../assets/icons/defaultHotel.svg";

// style
import styled from "styled-components";

export interface AccommodationRoom {
  room: {
    roomTypeId: number;
    name: string;
    description: string;
    image?: string;
    stock: number;
    capacity: number;
    price?: number;
  };
}

interface accommodationSend {
  roomTypeId: number;
  accommodationId: number;
  guestNumber: number;
  checkIn: string;
  checkOut: string;
  keyword: string;
  areaCode: string;
}

function DetailSectionBottom({ room }: AccommodationRoom) {
  const { name, stock, image, capacity, description, roomTypeId, price } = room;

  const [currentState, setCurrentState] = useState<accommodationSend>({
    roomTypeId: roomTypeId,
    accommodationId: 0,
    guestNumber: 0,
    checkIn: "",
    checkOut: "",
    keyword: "",
    areaCode: "",
  });

  const { postAccommodationRooms } = useDetailAPI();

  const formatPrice = price?.toLocaleString();

  const roomState = {
    name: name,
    description: description,
    image: image,
    capacity: capacity,
  };

  const navigate = useNavigate();
  const params = useParams();

  const moveRoomDetail = () => {
    navigate(`/room/${roomTypeId}`, { state: { roomState } });
  };

  const sendQuery = useQuery(
    [
      "sendCart",
      roomTypeId,
      currentState.accommodationId,
      currentState.guestNumber,
      currentState.checkIn,
      currentState.checkOut,
      currentState.keyword,
      currentState.areaCode,
    ],
    () => {
      return postAccommodationRooms(
        currentState.roomTypeId,
        currentState.accommodationId,
        currentState.guestNumber,
        currentState.checkIn,
        currentState.checkOut,
        currentState.keyword,
        currentState.areaCode
      );
    },
    {
      enabled: false,
    }
  );

  const sendCart = async () => {
    const searchParams = new URLSearchParams(location.search);
    const checkIn = String(`20${searchParams.get("checkIn")}`);
    const checkOut = String(`20${searchParams.get("checkOut")}`);
    const accommodationId = Number(params.id);
    const guestNumber = Number(searchParams.get("memberCount"));
    const keyword = String(searchParams.get("keyword"));
    const areaCode = String(searchParams.get("area-code"));

    setCurrentState({
      roomTypeId: roomTypeId,
      checkIn: checkIn,
      checkOut: checkOut,
      accommodationId: accommodationId,
      guestNumber: guestNumber,
      keyword: keyword,
      areaCode: areaCode,
    });

    setTimeout(() => {
      sendQuery.refetch();
      console.log(12);
    }, 300);
  };

  const moveReservation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      const searchParams = new URLSearchParams(location.search);
      const checkIn = String(`20${searchParams.get("checkIn")}`);
      const checkOut = String(`20${searchParams.get("checkOut")}`);
      const accommodationId = params.id;
      const accomodationName = searchParams.get("keyword") as string;
      const areaCode = searchParams.get("area-code") as string;
      const guestNumber = searchParams.get("memberCount");

      const reservation = {
        accomodationId: accommodationId,
        accomodationName: accomodationName,
        areaCode: areaCode,
        roomTypeId: roomTypeId,
        roomName: name,
        checkIn: checkIn,
        checkOut: checkOut,
        guestNumber: guestNumber,
        capacity: capacity,
        price: price,
      };

      navigate("/reservation", { state: { reservation } });
    }
  };

  if (sendQuery.error) {
    navigate("/login");
  } else {
    return (
      <Container>
        <div>
          <TitleSection>{name}</TitleSection>
          {!image ? <img src={Hotel} alt="non-image" /> : <img src={image} alt="room-image" />}
        </div>
        <BottomSection>
          <PriceSection>
            <span>가격</span>
            {stock !== 0 ? (
              <span>{formatPrice}원</span>
            ) : (
              <span className="stockNonePrice">{formatPrice}원</span>
            )}
          </PriceSection>
          <RoomSection>
            <span>객실 이용 안내</span>
            <button onClick={moveRoomDetail}>바로가기</button>
          </RoomSection>
          {stock !== 0 ? (
            <ReserveSection>
              <ReserveSectionTop>
                <div>
                  <span>기준 2인</span>
                  <span> &nbsp;/&nbsp;</span>
                  <span>최대 {capacity}인</span>
                </div>
                <span>남은 객실 {stock}</span>
              </ReserveSectionTop>
              <div>
                <button className="cartButton">
                  <Cart onClick={sendCart} />
                </button>
                <button onClick={moveReservation}>예약하기</button>
              </div>
            </ReserveSection>
          ) : (
            <ReserveSection>
              <ReserveSectionTop>
                <span>남은 객실 {stock}</span>
              </ReserveSectionTop>
              <div className="disabledButton">
                <span>예약 마감</span>
              </div>
            </ReserveSection>
          )}
        </BottomSection>
        {sendQuery.isFetching && (
          <Skeleton>
            <SkeletonSpan>장바구니로 이동합니다.</SkeletonSpan>
          </Skeleton>
        )}
      </Container>
    );
  }
}

export default DetailSectionBottom;

const Container = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  padding: 0.35rem 1rem;
  padding-bottom: 0.8rem;
  img {
    border-radius: ${({ theme }) => theme.Br.default};
  }
  ${({ theme }) => `
    background-color: ${theme.Color.componentColor};
  `}
`;
const TitleSection = styled.h3`
  ${({ theme }) => `
  padding: 0.4rem 0; 
  color: ${theme.Color.mainFontColor};
  font-size: ${theme.Fs.default};
  font-weight: 600;
`}
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  border: ${({ theme }) => theme.Border.thinBorder};
  border-radius: ${({ theme }) => theme.Br.default};
  margin-top: 0.35rem;
`;

const PriceSection = styled.div`
  ${({ theme }) => `
    span {
      display: inline-block;
      color: ${theme.Color.mainFontColor};
      font-size: ${theme.Fs.default};
      font-weight: 600;
    }
    span.stockNonePrice {
      color: ${theme.Color.captionFontColor};
    }
    display: flex;
    justify-content: space-between;
    margin: 0 0.8rem;
    padding: 0.8rem 0;
    padding-bottom: 0.75rem;
    border-bottom: ${theme.Border.thinBorder};
  `}
`;

const RoomSection = styled.div`
  ${({ theme }) => `
    span {
      display: inline-block;
      color: ${theme.Color.mainFontColor};
      font-size: ${theme.Fs.default};
      font-weight: 600;
    }
    button {
      all: unset;
      cursor: pointer;
      color: ${theme.Color.captionFontColor};
      font-size:${theme.Fs.caption};
      font-weight: 600;
      &:hover {
        transition: all 0.3s;
        color: ${theme.Color.mainFontColor};
      }
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    padding-bottom: 0.5rem;
  `}
`;

const ReserveSection = styled.div`
  ${({ theme }) => `
  span {
   display: inline-block;
   color: ${theme.Color.captionFontColor};
   font-size: ${theme.Fs.caption};
   font-weight: 600;
  }
  div {
    display: flex;
    button {
      all: unset;
      cursor: pointer;
      margin-left: 0.3rem;
      padding: 0.5rem 0.7rem;
      color: ${theme.Color.componentColor};
      background-color: ${theme.Color.mainColor};
      font-size: ${theme.Fs.default};
      font-weight: 600;
      border-radius: ${theme.Br.default};
      &:hover {
        transition: all 0.3s;
        background-color: ${theme.Color.hoverColor};
      }
     }
     button.cartButton {
      padding: 0.4rem 0.5rem;
      background-color: ${theme.Color.componentColor};
      border: ${theme.Border.thinBorder};
      &:hover {
        transition: all 0.3s;
        background-color: ${theme.Color.backgroundColor};
      }
     }
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  padding-bottom: 0.5rem;
  `}
`;
const ReserveSectionTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const Skeleton = styled.div`
  position: absolute;
  bottom: 13px;
  left: 16.5px;
  width: 339.5px;
  height: 50px;
  background-image: linear-gradient(
    100deg,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 1)
  );
  background-size: 400% 100%;
  color: rgba(0, 0, 0, 0);
`;

const SkeletonSpan = styled.div`
  color: ${({ theme }) => theme.Color.componentColor};
  font-size: ${({ theme }) => theme.Fs.caption};
  padding-top: 16px;
  text-align: center;
`;
