// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import { ADD_TIMEZONE_FORM_WIDTH, PARENT_VIEW_WIDTH } from "../config";
import ITimezone from "../ITimezone";
import Modal from "../Modal";
import AddTimeZone from "./AddTimeZone";

interface IParentView {
  show: boolean;
  bgColor: [number, number, number];
  index: number;
  pageXOffset: number;
}

const ParentView = styled.div<IParentView>`
  position: relative;
  width: ${({ show }) =>
    show ? ADD_TIMEZONE_FORM_WIDTH : PARENT_VIEW_WIDTH}px;
  cursor: default;
  &:after {
    content: "";
    display: block;
    position: sticky;
    background: rgb(${({ bgColor }) => bgColor.join(", ")});
    width: ${PARENT_VIEW_WIDTH}px;
    height: 100vh;
    top: 0;
    z-index: -1;
    box-shadow: 2px 0 2px 2px rgba(0, 0, 0, 0.1);
  }
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
  index: number;
  pageXOffset: number;
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

  public handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    this.props.toggle(true);
  };

  public refMethod = (element: HTMLElement) => {
    this.parentElement = element;
  };

  public render() {
    const { addTimezone, index, pageXOffset, timezones, color, show, toggle } = this.props;

    return (
      <ParentView
        onClick={this.handleClick}
        show={show}
        bgColor={color}
        innerRef={this.refMethod}
        index={index}
        pageXOffset={pageXOffset}
      >
        <InnerView show={show}>
          {show ? (
            <Modal>
              <AddTimeZone
                addTimezone={addTimezone}
                bgColor={color}
                close={toggle}
                timeCursor={this.props.timeCursor}
                timezones={timezones}
                updateTime={this.props.updateTime}
              />
            </Modal>
          ) : (
            <b>Add Timezone</b>
          )}
        </InnerView>
      </ParentView>
    );
  }
}
