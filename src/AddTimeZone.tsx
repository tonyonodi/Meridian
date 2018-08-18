// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import Icon from "./Icon";

const ParentView = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchForm = styled.form`
  max-width: 90%;
  height: 80%;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  width: 100%;
  border-bottom: solid 2px black;
  font-size: 2rem;
  &:focus {
    outline: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  background: none;
  border: none;
  top: 20px;
  right: 20px;
  & svg {
    height: 2rem;
  }
  &:focus {
    outline: none;
  }
`;

const SearchResults = styled.ul`
  padding-left: 0;
  list-style: none;
  margin: 0;
`;

interface ISearchResult {
  active: boolean;
  children: string;
}

const SearchResult = styled.li<ISearchResult>`
  padding: 5px;
  background: ${({ active }) => (active ? "red" : "none")};
`;

interface IAddTimeZoneProps {
  addTimezone: (timezone: string) => void;
  close: () => void;
  timezones: string[];
}

interface IAddTimeZoneState {
  searchValue: string;
  cursor: number;
  searchResults: string[];
}

export default class AddTimeZone extends React.Component<
  IAddTimeZoneProps,
  IAddTimeZoneState
> {
  public searchInput: any;

  public state = { searchValue: "", cursor: 0, searchResults: [] };

  public handleChange = (event: any) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  public handleSubmit = (event: any) => {
    event.preventDefault();
    const {searchResults} = this.state

    if (searchResults.length > 0) {
      this.props.addTimezone(searchResults[this.state.cursor]);
    }
    this.props.close();
  };

  public searchInputRef = (el: any) => (this.searchInput = el);

  public componentDidMount() {
    this.searchInput.focus();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.searchValue === this.state.searchValue) {
      return;
    }
    const searchResults = this.filterTimezones(
      this.props.timezones,
      this.state.searchValue
    );
    this.setState({ searchResults });
  }

  public componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  public filterTimezones = (timezones: string[], searchValue: string) => {
    return timezones.filter(timezone => {
      return timezone
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase());
    });
  };

  public handleKeyDown = (event: any) => {
    const { key } = event;
    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        this.setState(({ cursor }) => {
          return { cursor: cursor + 1 };
        });
        break;
      case "ArrowUp":
        event.preventDefault();
        this.setState(({ cursor }) => {
          return { cursor: cursor <= 0 ? 0 : cursor - 1 };
        });
        break;
    }
  };

  public searchResult = (timezone: string, index: number) => {
    return (
      <SearchResult key={timezone} active={index === this.state.cursor}>
        {timezone}
      </SearchResult>
    );
  };

  public render() {
    const { searchResults, searchValue } = this.state;

    return (
      <ParentView>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchInput
            type="text"
            onChange={this.handleChange}
            value={this.state.searchValue}
            innerRef={this.searchInputRef}
          />
          {searchResults.length > 0 && searchValue ? (
            <SearchResults>
              {searchResults.map(this.searchResult)}
            </SearchResults>
          ) : null}
        </SearchForm>
        <CloseButton onClick={this.props.close}>
          <Icon type="times" />
        </CloseButton>
      </ParentView>
    );
  }
}
