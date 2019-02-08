// tslint:disable:no-console
// tslint:disable:jsx-no-lambda
import * as React from "react";
import styled from "styled-components";
import { debounce } from "lodash";
import * as fuzzysort from "fuzzysort";
import Icon, { IconTypes } from "../Icon";
import ITimezone from "../ITimezone";
import SearchResult from "./SearchResult";
import ISearchResult from "./ISearchResult";
import { MERIDIAN_API_URL } from "../config";

interface IParentView {
  bgColor: [number, number, number];
}

const Close = styled.button`
  width: 40px;
  color: white;
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  &:focus {
    outline: none;
  }
  &:focus svg {
    filter: drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.3));
    transform: translateY(-4px);
    transition: transform 1s;
  }
`;

const ParentView = styled.div<IParentView>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgb(${({ bgColor }) => bgColor.join(", ")});
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 80vh;
  color: white;
`;

const Title = styled.h2`
  margin-bottom: 0;
`;

const SearchInputParent = styled.div`
  position: relative;
`;

const searchIconStyle = {
  position: "absolute",
  width: 26,
  bottom: 13,
};

const loadingIconStyle = {
  position: "absolute",
  width: 26,
  bottom: 8,
};

const SearchInput = styled.input`
  background: none;
  border: none;
  width: 100%;
  border-bottom: solid 1px #d2d2d2;
  font-size: 2rem;
  padding: 5px;
  padding-left: 35px;
  color: white;
  margin-bottom: 2px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-bottom: solid 3px white;
    margin-bottom: 0;
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
  bgColor: [number, number, number];
  close: (state?: boolean) => void;
  timeCursor: number;
  clockMode: boolean;
  timezones: ITimezone[];
  updateTime: ({
    activateClockMode,
    time,
  }: {
    activateClockMode?: boolean;
    time: number;
  }) => void;
}

interface IAutosuggestResponseError {
  kind: "error";
  results: ISearchResult[];
}

interface IAutosuggestResponseSuccess {
  kind: "success";
  results: ISearchResult[];
}

type AutosuggestResponse =
  | IAutosuggestResponseError
  | IAutosuggestResponseSuccess;

interface IAddTimeZoneState {
  searchValue: string;
  cursor: number;
  searchResultsMap: {
    [searchValue: string]: AutosuggestResponse;
  };
}

export default class AddTimeZone extends React.Component<
  IAddTimeZoneProps,
  IAddTimeZoneState
> {
  public storedTimeCursor: number;
  public storedClockModeActive: boolean;

  public searchInput: any;

  public state = { searchValue: "", cursor: 0, searchResultsMap: {} };

  public timezones: ITimezone[];

  public searchAndUpdateResults = debounce(async (searchValue: string) => {
    const { searchResultsMap } = this.state;
    if (searchResultsMap[searchValue]) {
      return;
    }

    let places: ISearchResult[];
    try {
      const response = await fetch(
        `${MERIDIAN_API_URL}/autosuggest/${searchValue}`
      );
      places = await response.json();
    } catch (error) {
      console.error(error);
      const offlineResults = this.filterTimezones(
        this.props.timezones,
        searchValue
      );
      this.setState(previousState => {
        return {
          searchResultsMap: {
            ...previousState.searchResultsMap,
            [searchValue]: {
              kind: "error",
              results: offlineResults,
            } as IAutosuggestResponseError,
          },
        };
      });

      return;
    }

    this.setState(previousState => {
      return {
        searchResultsMap: {
          ...previousState.searchResultsMap,
          [searchValue]: {
            kind: "success",
            results: places,
          } as IAutosuggestResponseSuccess,
        },
      };
    });
  }, 500);

  constructor(props: IAddTimeZoneProps) {
    super(props);

    this.storedTimeCursor = props.timeCursor;
    this.storedClockModeActive = props.clockMode;
  }

  public handleResize = () => {
    this.props.updateTime({
      time: this.storedTimeCursor,
      activateClockMode: this.storedClockModeActive,
    });
  };

  public componentDidMount() {
    setTimeout(() => {
      if (this.searchInput && this.searchInput.focus) {
        this.searchInput.focus();
      }
    }, 0);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("resize", this.handleResize);
  }

  public componentWillUnmount() {
    setTimeout(() => {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("keydown", this.handleKeyDown);
    }, 3000);
  }

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  public handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { searchResultsMap, searchValue } = this.state;
    const searchResults =
      searchResultsMap[searchValue] && searchResultsMap[searchValue].results;

    if (searchResults && searchResults.length > 0) {
      this.props.addTimezone(searchResults[this.state.cursor]);
      this.props.close(false);
    }
  };

  public searchInputRef = (el: any) => (this.searchInput = el);

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

  public async componentDidUpdate(
    prevProps: IAddTimeZoneProps,
    prevState: IAddTimeZoneState
  ) {
    const { searchValue } = this.state;

    if (prevState.searchValue === searchValue || searchValue.trim() === "") {
      return;
    }

    this.searchAndUpdateResults(searchValue);
  }

  public handleKeyDown = (event: any) => {
    const { key } = event;
    switch (key) {
      case "Escape":
        this.props.close(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.setState(({ cursor, searchResultsMap, searchValue }) => {
          const results = searchResultsMap[searchValue];
          if (!results) return null;

          return {
            cursor: cursor >= results.results.length - 1 ? cursor : cursor + 1,
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

  public closeModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    this.props.close();
  };

  public render() {
    const { searchResultsMap, searchValue } = this.state;
    const loadingResults =
      searchValue.trim() !== "" && searchResultsMap[searchValue] === undefined;
    const searchResults = searchResultsMap[searchValue];

    return (
      <ParentView bgColor={this.props.bgColor}>
        <Close onClick={this.closeModal}>
          <Icon type={IconTypes.Times} />
        </Close>
        <SearchForm onSubmit={this.handleSubmit}>
          <Title>Search Places</Title>
          <SearchInputParent>
            {loadingResults ? (
              <Icon type={IconTypes.LoadingSpinner} style={loadingIconStyle} />
            ) : (
              <Icon type={IconTypes.Search} style={searchIconStyle} />
            )}
            <SearchInput
              type="text"
              onChange={this.handleChange}
              value={this.state.searchValue}
              innerRef={this.searchInputRef}
            />
          </SearchInputParent>
          {(() => {
            if (searchResults === undefined) {
              return null;
            }

            return (
              <React.Fragment>
                {searchResults.kind === "error" ? (
                  <p>
                    Unable to retrieve time zones. Showing limited offline
                    results.
                  </p>
                ) : null}
                <SearchResults>
                  {searchResults.results.map(
                    (searchResult: ISearchResult, index: number) => (
                      <SearchResult
                        active={this.state.cursor === index}
                        searchResult={searchResult}
                        handleClick={this.handleResultClick(searchResult)}
                      />
                    )
                  )}
                </SearchResults>
              </React.Fragment>
            );
          })()}
        </SearchForm>
      </ParentView>
    );
  }
}
