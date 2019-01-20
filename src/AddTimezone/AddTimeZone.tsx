// tslint:disable:no-console
// tslint:disable:jsx-no-lambda
import * as fuzzysort from "fuzzysort";
import * as React from "react";
import styled from "styled-components";
import Icon, { IconTypes } from "../Icon";
import ITimezone from "../ITimezone";
import SearchResult from "./SearchResult";

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
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  width: 100%;
  border-bottom: solid 1px #d2d2d2;
  font-size: 2rem;
  color: white;
  padding: 5px;
  &:focus {
    outline: none;
    border-bottom: solid 3px white;
  }
`;

const SearchResults = styled.ul`
  padding-left: 0;
  list-style: none;
  margin: 0;
  overflow: auto;
  text-align: left;
  color: white;
`;

interface IAddTimeZoneProps {
  addTimezone: (timezone: ITimezone) => void;
  bgColor: [number, number, number];
  close: (state?: boolean) => void;
  timezones: ITimezone[];
  timeCursor: number;
  updateTime: (
    {
      activateClockMode,
      time,
    }: {
      activateClockMode?: boolean;
      time: number;
    }
  ) => void;
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
    setTimeout(() => {
      this.searchInput.focus();
    }, 0);
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

  public handleFocus = () => {
    const timeCursorOnFocus = this.props.timeCursor;
    let scrollCount = 0;
    let prevPageYOffset = window.pageYOffset;

    const scrollListener = () => {
      // ignore horizontal scrolling
      if (window.pageYOffset === prevPageYOffset) {
        return;
      }
      prevPageYOffset = window.pageYOffset;

      scrollCount++;
      if (scrollCount < 10) {
        this.props.updateTime({ time: timeCursorOnFocus });
      } else {
        window.removeEventListener("scroll", scrollListener);
      }
    };

    const resizeListener = () => {
      window.addEventListener("scroll", scrollListener);
    };
    window.addEventListener("resize", resizeListener);

    window.setTimeout(() => {
      window.removeEventListener("resize", resizeListener);
      window.removeEventListener("scroll", scrollListener);
    }, 2000);
  };

  public closeModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    this.props.close();
  };

  public render() {
    const { searchResults, searchValue } = this.state;

    return (
      <ParentView bgColor={this.props.bgColor}>
        <Close onClick={this.closeModal}>
          <Icon type={IconTypes.Times} />
        </Close>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchInput
            type="text"
            onChange={this.handleChange}
            value={this.state.searchValue}
            innerRef={this.searchInputRef}
            onFocus={this.handleFocus}
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
      </ParentView>
    );
  }
}
