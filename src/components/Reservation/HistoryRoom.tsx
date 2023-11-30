// library
import styled from "styled-components";
// import { useState, useEffect } from "react";

// component
import { HistoryRoomProps } from "../../pages/reservationPage/ReservationHistoryPage";
import dummy from "../../assets/dummy.png";

function HistoryRoom({ room }: { room: HistoryRoomProps }) {
  return (
    <>
      <RoomDivider />
      <HistoryRoomContainer>
        <span>예약 번호 {room.id}</span>
        <div>
          <div>
            <h2>{"스탠포드 호텔 서울"}</h2>
            <a href="">숙소 상세 보기 &gt;</a>
          </div>
          <h3>{"더블 디럭스"}</h3>
        </div>
        <div>
          <img src={dummy} alt="숙소 사진" />
          <ReservationDescription>
            <span>체크인: {room.check_in}</span>
            <span>체크아웃: {room.check_out}</span>
          </ReservationDescription>
        </div>
      </HistoryRoomContainer>
    </>
  );
}

export default HistoryRoom;

const HistoryRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  gap: 0.5rem;
  color: ${({ theme }) => theme.Fs.mainFontColor};

  span {
    font-size: ${({ theme }) => theme.Fs.default};
    color: #404040;
    font-weight: 700;
  }

  > div:nth-child(2) {
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.Fs.tagTitle};
    font-weight: 700;
  }

  h3 {
    font-size: ${({ theme }) => theme.Fs.default};
  }

  > div:last-child {
    display: flex;
    gap: 12px;

    img {
      width: 80px;
      object-fit: cover;
      border-radius: ${({ theme }) => theme.Br.default};
    }
  }
`;

const ReservationDescription = styled.div`
  display: flex;
  flex-direction: column;

  span {
    font-weight: 500;
    font-size: ${({ theme }) => theme.Fs.default};
  }
`;

const RoomDivider = styled.div`
  width: 100%;
  height: 0.125rem;
  background-color: ${({ theme }) => theme.Color.borderColor};
`;
