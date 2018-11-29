// tslint:disable:no-console
// tslint:disable:jsx-no-lambda
import * as fuzzysort from "fuzzysort";
import * as React from "react";
import styled from "styled-components";
import ITimezone from "./ITimezone";
import SearchResult from "./SearchResult";

const SearchForm = styled.form`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  width: 100%;
  border-bottom: solid 2px white;
  font-size: 2rem;
  color: white;
  &:focus {
    outline: none;
  }
`;

const SearchResults = styled.ul`
  padding-left: 0;
  list-style: none;
  margin: 0;
  overflow: auto;
  text-align: left;
`;

interface IAddTimeZoneProps {
  addTimezone: (timezone: ITimezone) => void;
  close: (state?: boolean) => void;
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

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  public handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { searchResults } = this.state;

    if (searchResults.length > 0) {
      this.props.addTimezone(searchResults[this.state.cursor]);
    }
    this.props.close(false);
  };

  public searchInputRef = (el: any) => (this.searchInput = el);

  public componentDidMount() {
    this.searchInput.focus();
    window.addEventListener("keydown", this.handleKeyDown);
    window.scrollTo(document.body.clientWidth, window.scrollY);
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
    }, []);

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

  public handleResultClick = (timezone: ITimezone) => (
    event: React.MouseEvent<HTMLLIElement>
  ) => {
    event.stopPropagation();
    this.props.addTimezone(timezone);
    this.props.close();
  };

  public render() {
    const { searchResults, searchValue } = this.state;

    return (
      <SearchForm onSubmit={this.handleSubmit}>
        <SearchInput
          type="text"
          onChange={this.handleChange}
          value={this.state.searchValue}
          innerRef={this.searchInputRef}
        />
        {searchValue ? (
          <SearchResults>
            {searchResults.map((timezone, index) => (
              <SearchResult
                active={index === this.state.cursor}
                timezone={timezone}
                handleClick={this.handleResultClick(timezone)}
              />
            ))}
          </SearchResults>
        ) : null}
      </SearchForm>
    );
  }
}
