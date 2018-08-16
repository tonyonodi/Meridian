// tslint:disable:no-console
import * as React from "react";

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
  public state = { searchValue: "" };

  public handleChange = (event: any) => {
    this.setState({ searchValue: event.target.value });
  };

  public handleSubmit = (event: any) => {
    event.preventDefault();
    this.props.addTimezone(this.state.searchValue);
    this.props.close();
  };

  public render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            onChange={this.handleChange}
            value={this.state.searchValue}
          />
        </form>
        <button onClick={this.props.close}>Close</button>
      </div>
    );
  }
}
