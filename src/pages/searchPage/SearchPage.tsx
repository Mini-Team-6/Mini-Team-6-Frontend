// library
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

// component
import SearchInput from "./SearchInput";
import LocationSelect from "./LocationSelect";
import SearchReslutList from "./SearchReslutList";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const areaCode = searchParams.get("area-code") || "";

  return (
    <SearchPageLayout>
      <SearchPageHeader>
        <SearchInput
          placeholder="숙소명을 입력하세요"
          keyword={keyword}
          setSearchParams={setSearchParams}
        />
        <SelectLocationBox>
          <LocationSign>
            <div>지역</div>
          </LocationSign>
          <LocationSelect areaCode={areaCode} setSearchParams={setSearchParams} />
        </SelectLocationBox>
      </SearchPageHeader>
      <SearchReslutList keyword={keyword} areaCode={areaCode} />
    </SearchPageLayout>
  );
}

export default SearchPage;

const SearchPageLayout = styled.div`
  padding: 0 1.25rem 0.75rem 1.25rem;
`;

const SearchPageHeader = styled.div`
  position: sticky;
  top: 2.75rem;

  padding: 0.75rem 0 0.75rem 0;
  border-bottom: ${({ theme }) => theme.Border.thinBorder};

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  background-color: #fff;
`;

const SelectLocationBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LocationSign = styled.div`
  width: 3.5rem;
  height: 2rem;

  background-color: ${({ theme }) => theme.Color.mainColor};
  border-radius: ${({ theme }) => theme.Br.default};

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
  color: white;
`;
