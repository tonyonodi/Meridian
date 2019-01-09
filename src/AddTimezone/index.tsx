// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import { ADD_TIMEZONE_FORM_WIDTH, PARENT_VIEW_WIDTH } from "../config";
import ITimezone from "../ITimezone";
import AddTimeZone from "./AddTimeZone";




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
  box-shadow: 2px 0 2px 2px rgba(0, 0, 0, 0.1);
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
  timeCursor: number;
  toggle: (state?: boolean) => void;
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

export default class AddTimeZoneButton extends React.Component<
  IAddTimeZoneButtonProps
> {
  public parentElement: HTMLElement;

  public componentDidMount() {
    window.addEventListener("keypress", this.handleKeypress);
    window.addEventListener("mousedown", this.handleMouseDown);
  }

  public componentWillUnmount() {
    window.removeEventListener("keypress", this.handleKeypress);
    window.removeEventListener("mousedown", this.handleMouseDown);
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

  public handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    this.props.toggle(true);
  };

  public handleMouseDown = (event: Event) => {
    const clickedElement = event.target;

    if (
      clickedElement instanceof Element &&
      clickedElement !== this.parentElement &&
      !this.parentElement.contains(clickedElement)
    ) {
      this.props.toggle(false);
    }
  };

  public refMethod = (element: HTMLElement) => {
    this.parentElement = element;
  };

  public render() {
    const { addTimezone, timezones, color, show, toggle } = this.props;

    return (
      <ParentView
        onClick={this.handleClick}
        show={show}
        bgColor={color}
        innerRef={this.refMethod}
      >
        <InnerView show={show}>
          {show ? (
            <AddTimeZone
              addTimezone={addTimezone}
              close={toggle}
              timeCursor={this.props.timeCursor}
              timezones={timezones}
              updateTime={this.props.updateTime}
            />
          ) : (
            <b>Add Timezone</b>
          )}
        </InnerView>
      </ParentView>
    );
  }
}
