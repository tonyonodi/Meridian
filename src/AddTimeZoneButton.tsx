import * as React from "react";
import styled from "styled-components";
import AddTimeZone from "./AddTimeZone";
import {
  // PALETTE,
  PARENT_VIEW_WIDTH,
  // WINDOW_HEIGHT_IN_DAYS,
  // WINDOW_HEIGHT_IN_MS,
} from "./config";

const ParentView = styled.div`
  width: ${PARENT_VIEW_WIDTH}px;
  background: rgba(255, 255, 255, 0.2);
  cursor: default;
`;

const Inner = styled.div`
  position: fixed;
  height: 100vh;
  display: flex;
  width: ${PARENT_VIEW_WIDTH}px;
  text-align: center;
  align-items: center;
  color: white;
  font-size: 1.2em;
`;

interface IAddTimeZoneButtonState {
  show: boolean;
}

export default class AddTimeZoneButton extends React.Component<
  any,
  IAddTimeZoneButtonState
> {
  public state = { show: false };

  public toggle = () => {
    this.setState(({ show }) => ({
      show: !show,
    }));
  };

  public render() {
    const { addTimezone, timezones } = this.props;
    return (
      <ParentView onClick={this.toggle}>
        {this.state.show ? (
          <AddTimeZone
            addTimezone={addTimezone}
            close={this.toggle}
            timezones={timezones}
          />
        ) : (
          <Inner>Add Timezone</Inner>
        )}
      </ParentView>
    );
  }
}
