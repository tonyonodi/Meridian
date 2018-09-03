// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import Icon from "./Icon";

const ParentView = styled.div`
  position: fixed;
  box-sizing: border-box;
  right: 0;
  top: 0;
  color: white;
  width: 60px;
  padding: 10px;
  height: 98vh;
`;

interface IClockButton {
  clockModeActive: boolean;
}

const ClockButton = styled.button<IClockButton>`
  border: none;
  background: none;
  padding: 0;
  width: 100%;
  color: white;
  opacity: ${({ clockModeActive }) => (clockModeActive ? 1 : 0.25)};
`;

interface IToolbarProps {
  clockPosition: number | null;
  updateTime: (
    { t_0, timeCursor }: { t_0: number; timeCursor: number }
  ) => void;
}

export default class Toolbar extends React.Component<IToolbarProps> {
  public handleClick = () => {
    const timeToGoTo = new Date().getTime();

    this.props.updateTime({
      t_0: timeToGoTo,
      timeCursor: timeToGoTo,
    });
  };

  public render() {
    return (
      <ParentView className="toolbar">
        <ClockButton
          onClick={this.handleClick}
          clockModeActive={this.props.clockPosition !== null}
        >
          <Icon type="clock" />
        </ClockButton>
      </ParentView>
    );
  }
}
