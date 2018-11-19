import * as React from "react";
import styled from "styled-components";
import AddTimeZone from "./AddTimeZone";
import {
  // PALETTE,
  ADD_TIMEZONE_FORM_WIDTH,
  PARENT_VIEW_WIDTH,
  // WINDOW_HEIGHT_IN_DAYS,
  // WINDOW_HEIGHT_IN_MS,
} from "./config";
import ITimezone from "./ITimezone";

interface IParentView {
  show: boolean;
  bgColor: [number, number, number];
}

const ParentView = styled.div<IParentView>`
  position: relative;
  width: ${({ show }) =>
    show ? ADD_TIMEZONE_FORM_WIDTH : PARENT_VIEW_WIDTH}px;
  background: rgb(${({ bgColor }) => bgColor.join(", ")});
  cursor: default;
`;

interface IInnerView {
  show: boolean;
}

const InnerView = styled.div<IInnerView>`
  position: sticky;
  top: 0;
  left: 0;
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
  color: [number, number, number];
  show: boolean;
  timezones: ITimezone[];
  toggle: (state?: boolean) => void;
}

export default class AddTimeZoneButton extends React.Component<
  IAddTimeZoneButtonProps
> {
  public componentDidMount() {
    window.addEventListener("keypress", this.handleKeypress);
  }

  public componentWillUnmount() {
    window.removeEventListener("keypress", this.handleKeypress);
  }

  public handleKeypress = (event: any) => {
    if (document.activeElement !== window.document.body) {
      return;
    }

    switch (event.key) {
      case "n":
        event.preventDefault();
        this.props.toggle(true);
        break;
    }
  };

  public handleClick = (event: any) => {
    this.props.toggle(true);
  };

  public render() {
    const { addTimezone, timezones, color, show, toggle } = this.props;

    return (
      <ParentView onClick={this.handleClick} show={show} bgColor={color}>
        <InnerView show={show}>
          {show ? (
            <AddTimeZone
              addTimezone={addTimezone}
              close={toggle}
              timezones={timezones}
            />
          ) : (
            <b>Add Timezone</b>
          )}
        </InnerView>
      </ParentView>
    );
  }
}
