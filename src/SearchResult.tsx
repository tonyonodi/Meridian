import * as React from "react";
import styled from "styled-components";
import ITimezone from "./ITimezone";

interface ISearchResultView {
  active: boolean;
}

const SearchResultView = styled.li<ISearchResultView>`
  padding: 5px;
  background: ${({ active }) => (active ? "rgba(255, 255, 255, 0.3)" : "none")};
`;

interface ISearchResult {
  active: boolean;
  timezone: ITimezone;
  handleClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}

export default ({ active, timezone, handleClick }: ISearchResult) => {
  return (
    <SearchResultView
      key={timezone.timezone}
      onClick={handleClick}
      active={active}
    >
      {timezone.country
        ? `${timezone.city}, ${timezone.country}`
        : timezone.city}
    </SearchResultView>
  );
};
