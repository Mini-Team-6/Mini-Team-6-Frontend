import { useEffect } from "react";
// library
import styled, { css } from "styled-components";

// logo
import HeaderLogo from "../../assets/logo/headerLogo.svg?react";

// Icon
import ArrowUp from "../../assets/icons/arrowUp.svg?react";
import ArrowRight from "../../assets/icons/arrowRight.svg?react";
import { useNavigate } from "react-router-dom";

import useUserStore from "../../components/Store/UserStore";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ isOpen, setIsOpen }: Props) {
  const { userEmail, setUserEmail, isLoggedIn, setIsLoggedIn } = useUserStore();

  const navigate = useNavigate();

  const handleBackGroundClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleAuthBtnClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserEmail("");
    } else {
      navigate("/login");
    }
    setIsOpen(false);
  };
  
  const handleSidebarMenuClick = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email") || "";

    if (token) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, [setIsLoggedIn, setUserEmail]);

  return (
    <SidebarLayout $isOpen={isOpen}>
      <SidebarTopBox>
        <SidebarTopBoxLogo>
          <ArrowUpSVG onClick={handleBackGroundClick} />
          <HeaderLogoSVG />
          <TransparentArrowUpSVG />
        </SidebarTopBoxLogo>
        <SidebarTopBoxText>
          {isLoggedIn ? `안녕하세요 ${userEmail}님 환영합니다!` : "로그인 후 예약하세요!"}
        </SidebarTopBoxText>
        <SidebarTopLogoutBtnBox onClick={handleAuthBtnClick}>
          {isLoggedIn ? "로그아웃" : "로그인"}
          <ArrowRightSVG />
        </SidebarTopLogoutBtnBox>
      </SidebarTopBox>
      {isLoggedIn ? (
        <SidebarMenuListBox>
          <SidebarMenuBox onClick={() => handleSidebarMenuClick("/mypage")}>
            내 정보 관리
          </SidebarMenuBox>
          <SidebarMenuBox onClick={() => handleSidebarMenuClick("/cart")}>장바구니</SidebarMenuBox>
          <SidebarMenuBox onClick={() => handleSidebarMenuClick("/reservationlist")}>
            예약내역
          </SidebarMenuBox>
        </SidebarMenuListBox>
      ) : null}

      <SidebarBottomBox $isLoggedIn={isLoggedIn} onClick={handleBackGroundClick} />
    </SidebarLayout>
  );
}

export default Sidebar;

const SidebarLayout = styled.div<{ $isOpen: boolean }>`
  z-index: 2;

  transition: all 0.75s ease;

  position: fixed;
  top: -100%;
  ${(props) =>
    props.$isOpen &&
    css`
      top: 0;
    `}

  width: 375px;
  height: 100%;

  transform: translateX(-50%);
  left: 50%;
`;

const SidebarTopBox = styled.div`
  background-color: ${({ theme }) => theme.Color.mainColor};
  width: 100%;
  height: 13rem;

  padding: ${({ theme }) => theme.Padding.header};

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SidebarTopBoxLogo = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ArrowUpSVG = styled(ArrowUp)`
  cursor: pointer;
  fill: white;
`;

const TransparentArrowUpSVG = styled(ArrowUp)`
  fill: ${({ theme }) => theme.Color.mainColor};
`;

const HeaderLogoSVG = styled(HeaderLogo)`
  fill: white;
  margin: 0 0 0 0.25rem;
`;

const SidebarTopBoxText = styled.p`
  margin: 1rem 0 0 0;

  color: white;
  font-size: ${({ theme }) => theme.Fs.default};
  font-weight: 400;
  text-align: center;
`;

const SidebarTopLogoutBtnBox = styled.button`
  margin: 4rem 0 0 0;

  font-weight: 400;
  font-size: ${({ theme }) => theme.Fs.default};
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    > svg {
      transform: translateX(50%);
    }
  }
`;

const ArrowRightSVG = styled(ArrowRight)`
  transition: all 0.25s ease;

  fill: white;
`;

const SidebarMenuListBox = styled.div`
  background-color: #fff;

  padding: 0 1rem;

  & > div:last-child {
    border: none;
  }

  &:hover {
    cursor: pointer;
  }
`;

const SidebarMenuBox = styled.div`
  height: 5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;

  border-bottom: ${({ theme }) => theme.Border.thinBorder};
`;

const SidebarBottomBox = styled.div<{ $isLoggedIn: boolean }>`
  background-color: ${({ theme }) => theme.Color.borderColor};

  width: 100%;
  height: ${(props) => (props.$isLoggedIn ? "calc(100% - 28rem)" : "calc(100% - 13rem)")};
  opacity: 0.7;
`;
