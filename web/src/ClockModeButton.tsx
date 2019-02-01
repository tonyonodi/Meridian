import * as React from "react";
import styled from "styled-components";
import Icon, { IconTypes } from "./Icon";

const diametre = 50;
const margin = 10;

const ParentView = styled.div`
  position: fixed;
  bottom: ${margin}px;
  right: ${margin}px;
  width: ${diametre}px;
  height: ${diametre}px;
  border-radius: ${diametre}px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #de4330;
  color: white;
  z-index: 900;
  transition: transform 0.5s;
  svg {
    width: 30px;
    margin-top: -1px;
  }
`;

interface IClockModeButton {
  updateTime: (
    { activateClockMode, time }: { activateClockMode: boolean; time: number }
  ) => void;
  clockModeActive: boolean;
}

export default ({ updateTime, clockModeActive }: IClockModeButton) => {
  const handleClick = () => {
    updateTime({
      activateClockMode: true,
      time: new Date().getTime(),
    });
  };

  return (
    <ParentView
      onClick={handleClick}
      style={{ transform: clockModeActive ? "" : `translateX(100px)` }}
    >
      <Icon type={IconTypes.Clock} />
    </ParentView>
  );
};
