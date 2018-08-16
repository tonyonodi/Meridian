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

interface IAddTimeZoneProps {
  addTimezone: (timezone: string) => void;
  close: () => void;
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
    this.props.addTimezone(this.state.searchValue);
    this.props.close();
  };

  public searchInputRef = (el: any) => (this.searchInput = el);

  public componentDidMount() {
    this.searchInput.focus()
  }

  public render() {
    return (
      <ParentView>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchInput
            type="text"
            onChange={this.handleChange}
            value={this.state.searchValue}
            innerRef={this.searchInputRef}
          />
        </SearchForm>
        <CloseButton onClick={this.props.close}>
          <Icon type="times" />
        </CloseButton>
      </ParentView>
    );
  }
}
