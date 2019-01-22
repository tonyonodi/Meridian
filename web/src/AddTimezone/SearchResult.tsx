import * as React from "react";
import styled from "styled-components";
import ISearchResult from "./ISearchResult";

interface ISearchResultView {
  active: boolean;
}

const SearchResultView = styled.li<ISearchResultView>`
  font-size: 2rem;
  padding: 5px;
  background: ${({ active }) => (active ? "rgba(255, 255, 255, 0.3)" : "none")};
`;

interface ISearchResultProps {
  active: boolean;
  searchResult: ISearchResult;
  handleClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}

export default ({ active, handleClick, searchResult }: ISearchResultProps) => {
  return (
    <SearchResultView
      key={`${searchResult.niceName}_${searchResult.timezone}`}
      onClick={handleClick}
      active={active}
    >
      {searchResult.niceName}
    </SearchResultView>
  );
};
