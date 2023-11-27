// library
import { useEffect, useState } from "react";
import styled from "styled-components";

// component
import { SectionContainer, SectionLabel } from "./reservationStyles";
import { SectionDivider } from "./reservationStyles";
import Input from "../Input";
import Checkbox from "./Checkbox";

function ActualUserInfoSection({
  reservationPersonName,
  reservationPersonContact,
}: {
  reservationPersonName: string;
  reservationPersonContact: string;
}) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [actualUserName, setActualUserName] = useState<string>("");
  const [actualUserContact, setActualUserContact] = useState<string>("");

  useEffect(() => {
    if (isChecked) {
      setActualUserName(reservationPersonName);
      setActualUserContact(reservationPersonContact);
    } else {
      setActualUserName("");
      setActualUserContact("");
    }
  }, [isChecked, reservationPersonName, reservationPersonContact]);

  return (
    <>
      <SectionContainer>
        <SectionLabel>
          <h2>이용자 정보</h2>
          <span>*</span>
        </SectionLabel>
        <AlertBox>상품 이용 시 필요한 필수 정보입니다.</AlertBox>
        <CheckboxWrapper onClick={() => setIsChecked((prev) => !prev)}>
          <Checkbox isChecked={isChecked} />
          예약자 정보와 동일합니다.
        </CheckboxWrapper>
        <Input
          isRequired={true}
          label={"성명"}
          placeholder={"성명을 입력해주세요"}
          type="text"
          marginTop="20px"
          value={actualUserName}
          setValue={setActualUserName}
          readOnly={isChecked}
        />
        <Input
          isRequired={true}
          label={"연락처"}
          placeholder={"연락처를 입력해주세요"}
          type="text"
          value={actualUserContact}
          setValue={setActualUserContact}
          marginTop="10px"
          readOnly={isChecked}
        />
      </SectionContainer>
      <SectionDivider />
    </>
  );
}

export default ActualUserInfoSection;

const AlertBox = styled.div`
  padding: 9px;
  background-color: ${(props) => props.theme.Color.backgroundColor};
  font-size: 0.75rem;
  color: ${(props) => props.theme.Color.defaultFontColor};
  margin: 12px 0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: ${(props) => props.theme.Fs.default};
`;
