import { useEffect, useState } from "react";

// hook
import { useDate } from "../../hook/useDate";

// icons
import Member from "../../assets/icons/User.svg?react";
import Calendar from "../../assets/icons/Calendar.svg?react";

// style
import styled from "styled-components";

function DetailDateAndCount() {
  const [member, setMember] = useState<number>(1);
  const { month, date } = useDate();

  useEffect(() => {
    if (member < 1) {
      alert("예약 인원은 최소 1명 이상이어야 합니다.");
      setMember(1);
    }
  }, [member]);

  return (
    <Container>
      <TitleSection>
        <h3>날짜 및 인원 선택</h3>
      </TitleSection>
      <DateSection>
        <DateSectionLeft>
          <CalendarSVG />
          <div>
            <span>{month && date ? `${month}월 ${date}일 ~ ${month}월 ${date + 1}일` : null}</span>
            <span>· 1박</span>
          </div>
        </DateSectionLeft>
        <div>
          <button>변경</button>
        </div>
      </DateSection>
      <MemberCountSection>
        <MemberCountSectionLeft>
          <MemberSVG />
          <div>
            <span>{member}명</span>
          </div>
        </MemberCountSectionLeft>
        <div>
          <button
            onClick={() => {
              setMember((prev) => prev + 1);
            }}
          >
            증가
          </button>
          &nbsp;
          <button
            onClick={() => {
              setMember((prev) => prev - 1);
            }}
          >
            감소
          </button>
        </div>
      </MemberCountSection>
    </Container>
  );
}

export default DetailDateAndCount;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  padding: 0.8rem 1rem;
  ${({ theme }) => `
    background-color: ${theme.Color.componentColor}
  `}
`;
const TitleSection = styled.div`
  ${({ theme }) => `
    margin-bottom: 0.5rem;
    h3 {
      color: ${theme.Color.mainFontColor};
      font-size: ${theme.Fs.default};
      font-weight: 600;
    }
  `}
`;

const DateSection = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    span {
      color: ${theme.Color.mainFontColor};
      font-size: ${theme.Fs.default};
      font-weight: 600;
    }
    button {
      all: unset;
      color: ${theme.Color.mainFontColor};
      font-size: ${theme.Fs.caption};
      cursor: pointer;
      &:hover {
        transition: all 0.2s;
        font-weight: 600;
      }
    }
    border-bottom: ${theme.Border.thinBorder}
  `}
`;

const DateSectionLeft = styled.div`
  display: flex;
  align-items: center;
`;

const MemberCountSection = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
    span {
      color: ${theme.Color.mainFontColor};
      font-size: ${theme.Fs.default};
      font-weight: 600;
    }
    button {
      all: unset;
      color: ${theme.Color.mainFontColor};
      font-size: ${theme.Fs.caption};
      cursor: pointer;
      &:hover {
        transition: all 0.2s;
        font-weight: 600;
      }
    }
  `}
`;

const MemberCountSectionLeft = styled.div`
  display: flex;
  align-items: center;
`;

const CalendarSVG = styled(Calendar)`
  display: block;
  margin-right: 0.35rem;
`;

const MemberSVG = styled(Member)`
  display: block;
  margin-right: 0.35rem;
`;