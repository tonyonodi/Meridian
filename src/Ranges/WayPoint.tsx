import * as React from "react";
import styled from "styled-components";
import getFractionalPositionFromTime from "../lib/getFractionalPositionFromTime";

const WaypointView = styled.div`
  position: absolute;
  color: white;
  transform: translateY(-50%);
  z-index: 10;
  &:before {
    content: "";
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background: white;
    display: inline-block;
    border: solid 5px black;
    box-sizing: border-box;
    transform: translateY(4px);
    margin-right: 4px;
  }
`;

interface IWaypointComponent {
  appWidth: number;
  t_0: number;
  text: string;
  time: number;
}

export default ({ appWidth, time, text, t_0 }: IWaypointComponent) => {
  const fractionalPosition = getFractionalPositionFromTime({
    t_0,
    time,
  });
  const topOffset = fractionalPosition * document.body.clientHeight;
  const left = `${appWidth + 10}px`;
  return <WaypointView style={{ top: topOffset, left }}>{text}</WaypointView>;
};
