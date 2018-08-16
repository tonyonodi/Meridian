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
  height: 80%;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
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

const SearchResult = styled.li`
  padding: 5px;
`

interface IAddTimeZoneProps {
  addTimezone: (timezone: string) => void;
  close: () => void;
  timezones: string[];
}

interface IAddTimeZoneState {
  searchValue: string;
}

export default class AddTimeZone extends React.Component<
  IAddTimeZoneProps,
  IAddTimeZoneState
> {
  public searchInput: any;

  public state = { searchValue: "" };

  public handleChange = (event: any) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  public handleSubmit = (event: any) => {
    event.preventDefault();
    const timezone = this.filterTimezones(
      this.props.timezones,
      this.state.searchValue
    );

    if (timezone) {
      this.props.addTimezone(timezone[0]);
    }
    this.props.close();
  };

  public searchInputRef = (el: any) => (this.searchInput = el);

  public componentDidMount() {
    this.searchInput.focus();
  }

  public filterTimezones = (timezones: string[], searchValue: string) => {
    if (!/\S/.test(searchValue)) {
      return null;
    }
    return timezones.filter(timezone => {
      return timezone
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase());
    });
  };

  public searchResult = (timezone: string) => {
    return <SearchResult>{timezone}</SearchResult>;
  };

  public render() {
    const searchResults = this.filterTimezones(
      this.props.timezones,
      this.state.searchValue
    );

    return (
      <ParentView>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchInput
            type="text"
            onChange={this.handleChange}
            value={this.state.searchValue}
            innerRef={this.searchInputRef}
          />
          {searchResults ? (
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
