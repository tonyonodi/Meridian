import * as React from "react";
import styled from "styled-components";
import AddTimeZone from "./AddTimeZone";
import {
  // PALETTE,
  PARENT_VIEW_WIDTH,
  // WINDOW_HEIGHT_IN_DAYS,
  // WINDOW_HEIGHT_IN_MS,
} from "./config";
import ITimezone from "./ITimezone";

interface IParentView {
  show: boolean;
  color: string;
}

const ParentView = styled.div<IParentView>`
  width: ${({ show }) => (show ? 350 : PARENT_VIEW_WIDTH)}px;
  background: ${({ color }) => color};
  cursor: default;
`;

interface IInnerView {
  show: boolean;
}

const InnerView = styled.div<IInnerView>`
  position: fixed;
  height: 100vh;
  width: ${({ show }) => (show ? 350 : PARENT_VIEW_WIDTH)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  font-size: 1.2em;
`;

interface IAddTimeZoneButtonProps {
  addTimezone: (timezone: ITimezone) => void;
  color: string;
  timezones: ITimezone[];
}

interface IAddTimeZoneButtonState {
  show: boolean;
}

export default class AddTimeZoneButton extends React.Component<
  IAddTimeZoneButtonProps,
  IAddTimeZoneButtonState
> {
  public state = { show: false };

  public toggle = () => {
    this.setState(({ show }) => ({
      show: !show,
    }));
  };

  public render() {
    const { addTimezone, timezones, color } = this.props;
    const { show } = this.state;
    return (
      <ParentView onClick={this.toggle} show={show} color={color}>
        <InnerView show={show}>
          {show ? (
            <AddTimeZone
              addTimezone={addTimezone}
              close={this.toggle}
              timezones={timezones}
            />
          ) : (
            "Add Timezone"
          )}
        </InnerView>
      </ParentView>
    );
  }
}
