import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderLogo from "../../assets/logo/headerLogo.svg?react";
import Input from "../../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserStore from "../../components/Store/UserStore";

function LoginPage() {
  const navigate = useNavigate();
  const { setUserEmail, setIsLoggedIn } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("https://travel-server.up.railway.app/members/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        const { token } = data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        setIsLoggedIn(true);
        setUserEmail(email);
        navigate("/");
      } else {
        throw new Error(data.message || "로그인 실패");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <LoginContainer>
      <CustomToastContainer />
      <LogoWrap onClick={() => navigate("/")}>
        <HeaderLogoSVG />
      </LogoWrap>
      <form onSubmit={handleSubmit}>
        <InputWrap>
          <Input
            isRequired={true}
            label={"이메일"}
            placeholder={"이메일을 입력해주세요."}
            type={"text"}
            value={email}
            onChange={handleEmailChange}
          />
          <Input
            isRequired={true}
            label={"비밀번호"}
            placeholder={"비밀번호를 입력해주세요."}
            type={"password"}
            value={password}
            onChange={handlePasswordChange}
          />
        </InputWrap>
        {error && <p>{error}</p>}
        <button type="submit">로그인</button>
        <a href="./Signup">회원가입</a>
      </form>
    </LoginContainer>
  );
}

export default LoginPage;

const LoginContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: ${(props) => props.theme.Br.default};
  text-align: center;

  button {
    width: 100%;
    background-color: ${(props) => props.theme.Color.mainColor};
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: ${(props) => props.theme.Br.default};
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.Color.hoverColor};
    }
    &:active {
      background-color: ${(props) => props.theme.Color.activeColor};
    }
  }

  a {
    font-size: ${(props) => props.theme.Fs.default};
  }
`;

const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const HeaderLogoSVG = styled(HeaderLogo)`
  cursor: pointer;
  fill: ${(props) => props.theme.Color.mainColor};
  margin-bottom: 20px;
  font-size: 1.4rem;
`;

const InputWrap = styled.div`
  margin-bottom: 10px;

  input {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    display: inline-block;
    border: ${(props) => props.theme.Border.thinBorder};
    border-radius: 6px;
    box-sizing: border-box;
  }

  input:focus {
    outline: 2px solid ${(props) => props.theme.Color.activeColor};
  }

  input::placeholder {
    color: ${(props) => props.theme.Color.defaultFontColor};
    opacity: 0.4;
  }
`;

const CustomToastContainer = styled(ToastContainer)`
  .Toastify__toast-body {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .Toastify__close-button {
    height: auto;
    width: auto;
    min-width: auto;
    padding: 2px;
  }

  .Toastify__toast {
    min-height: auto;
    padding: 10px;
    font-size: 14px;
  }
`;
