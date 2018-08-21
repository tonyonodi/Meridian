// tslint:disable:no-console
import * as fuzzysort from "fuzzysort";
import * as React from "react";
import styled from "styled-components";
import Icon from "./Icon";
import ITimezone from "./ITimezone";

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
  addTimezone: (timezone: ITimezone) => void;
  close: () => void;
  timezones: ITimezone[];
}

interface IAddTimeZoneState {
  searchValue: string;
  cursor: number;
  searchResults: ITimezone[];
}

export default class AddTimeZone extends React.Component<
  IAddTimeZoneProps,
  IAddTimeZoneState
> {
  public searchInput: any;

  public state = { searchValue: "", cursor: 0, searchResults: [] };

  public timezones: ITimezone[];

  public constructor(props: IAddTimeZoneProps) {
    super(props);

    this.timezones = props.timezones.map(timezone => {
      const { city, country } = timezone;
      return { ...timezone, niceName: `${city}, ${country}` };
    });
  }

  public handleChange = (event: any) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  public handleSubmit = (event: any) => {
    event.preventDefault();
    const { searchResults } = this.state;

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
      this.timezones,
      this.state.searchValue
    );
    this.setState({ searchResults });
  }

  public componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  public filterTimezones = (timezones: ITimezone[], searchValue: string) => {
    const fuzzysortResults = fuzzysort.go(searchValue, timezones, {
      key: "niceName",
      threshold: -100,
    });

    // Using reduce to convince type checker no results will be undefined
    const timezoneResults = fuzzysortResults.reduce((acc, { target }) => {
      const timezone = timezones.find(({ niceName }) => {
        return niceName === target;
      });
      if (timezone) {
        return [...acc, timezone];
      } else {
        return acc;
      }
    }, []) 

    return timezoneResults;
  };

  public handleKeyDown = (event: any) => {
    const { key } = event;
    switch (key) {
      case "Escape":
        this.props.close();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.setState(({ cursor, searchResults }) => {
          return {
            cursor: cursor >= searchResults.length - 1 ? cursor : cursor + 1,
          };
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

  public searchResult = (timezone: ITimezone, index: number) => {
    return (
      <SearchResult
        key={timezone.timezone}
        active={index === this.state.cursor}
      >
        {timezone.country
          ? `${timezone.city}, ${timezone.country}`
          : timezone.city}
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
