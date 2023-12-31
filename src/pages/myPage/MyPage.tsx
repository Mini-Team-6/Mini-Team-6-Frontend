import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

function MyPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const saveUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.patch(
        "https://travel-server.up.railway.app/members/mypage",
        {
          email: userEmail,
          name: userName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const responseData = response.data;
        console.log("사용자 정보가 성공적으로 업데이트되었습니다");
        localStorage.setItem("userName", responseData.name);
      } else {
        console.error("사용자 정보 업데이트에 실패했습니다");
      }
    } catch (error) {
      console.error("오류가 발생했습니다!", error);
    }

    toggleEdit();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get("https://travel-server.up.railway.app/members/mypage", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        const { email, name, phone } = response.data.data;
        setUserEmail(email);
        setUserName(name);
        setUserPhone(phone);
      } else {
        console.error("사용자 데이터를 가져오지 못했습니다");
      }
    } catch (error) {
      console.error("오류가 발생했습니다!", error);
    }
  };

  return (
    <MypageWrap>
      <ProfileFix>
        <p>내 정보 수정 {">"}</p>
      </ProfileFix>
      <InputWrap>
        {isEditing ? (
          <>
            <input placeholder="유저 이메일" value={userEmail} onChange={handleEmailChange} />
            <button onClick={saveUserInfo}>저장</button>
          </>
        ) : (
          <>
            <span>이메일 : {userEmail}</span>
            <button onClick={toggleEdit}>수정</button>
          </>
        )}
      </InputWrap>
      <SpanWrap>
        {isEditing ? (
          <>
            <input placeholder="예약자 이름" value={userName} onChange={handleNameChange} />
          </>
        ) : (
          <>
            <span>유저 닉네임 : {userName || "Test"}</span>
          </>
        )}
      </SpanWrap>
      <SpanWrap>
        <span>휴대폰 번호 :</span>
        <span>{userPhone || "010-1234-5678"}</span>
      </SpanWrap>
      <TextWrap>
        <p>
          개인 정보 보호를 위해 내 정보는 모두 안전하게 암호화됩니다.
          <br />
          개인 정보 변경은 YA어때 앱에서만 가능합니다.
        </p>
        <hr />
      </TextWrap>
      <ProfileFix>
        <a href={"./reservation-history"}>예약 내역 확인 {">"}</a>
      </ProfileFix>
      <CheckForm></CheckForm>
      <BottomMenu>
        <button>로그아웃</button>
        <button>회원탈퇴</button>
      </BottomMenu>
    </MypageWrap>
  );
}

export default MyPage;

const MypageWrap = styled.div`
  padding: 14px;
`;

const ProfileFix = styled.div`
  padding: 20px 0;
  p,
  a {
    font-weight: bold;
  }
`;

const InputWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  input {
    border: ${(props) => props.theme.Border.thickBorder};
    border-radius: ${(props) => props.theme.Br.default};
    padding: 0 10px;
    &:hover {
      border-color: ${(props) => props.theme.Color.hoverColor};
    }
    &:focus {
      border-color: ${(props) => props.theme.Color.activeColor};
    }
  }
  button {
    border: ${(props) => props.theme.Border.thickBorder};
    border-radius: 8px;
    padding: 4px;
    &:hover {
      background-color: ${(props) => props.theme.Color.hoverColor};
      color: ${(props) => props.theme.Color.componentColor};
    }
  }
`;

const SpanWrap = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: left;
  span:nth-child(2) {
    margin-left: 20px;
    margin-bottom: 10px;
  }
  input {
    border: ${(props) => props.theme.Border.thickBorder};
    border-radius: ${(props) => props.theme.Br.default};
    padding: 0 10px;
    &:hover {
      border-color: ${(props) => props.theme.Color.hoverColor};
    }
    &:focus {
      border-color: ${(props) => props.theme.Color.activeColor};
    }
  }
`;

const TextWrap = styled.div`
  p {
    font-size: ${(props) => props.theme.Fs.caption};
    color: ${(props) => props.theme.Color.mutedFontColor};
  }

  hr {
    margin: 10px 0;
    background-color: ${(props) => props.theme.Color.mutedFontColor};
    height: 5px;
    border: 0;
  }
`;

const CheckForm = styled.div`
  height: 50vh;
`;

const BottomMenu = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  background-color: ${(props) => props.theme.Color.mutedFontColor};
  button {
    padding: 0 6px;
    height: 25px;
    font-size: ${(props) => props.theme.Fs.default};
  }
  button:first-child {
    border-radius: ${(props) => props.theme.Br.default};
    background-color: ${(props) => props.theme.Color.mainColor};
    color: ${(props) => props.theme.Color.componentColor};
    &:hover {
      background-color: ${(props) => props.theme.Color.hoverColor};
    }
  }
`;
