// tslint:disable:jsx-no-lambda
import * as React from "react";
import styled from "styled-components";
import getFractionalPositionFromTime from "../lib/getFractionalPositionFromTime";

const WaypointView = styled.div`
  position: absolute;
  color: white;
  transform: translateY(-50%);
  z-index: 10;
  font-weight: bold;
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
  id: string;
  rangeId: string;
  t_0: number;
  text: string;
  time: number;
  deleteWaypoint: (
    {
      rangeId,
      waypointId,
    }: {
      rangeId: string;
      waypointId: string;
    }
  ) => void;
}

export default ({
  appWidth,
  id,
  rangeId,
  time,
  text,
  t_0,
  deleteWaypoint,
}: IWaypointComponent) => {
  const fractionalPosition = getFractionalPositionFromTime({
    t_0,
    time,
  });
  const topOffset = fractionalPosition * document.body.clientHeight;
  const left = `${appWidth + 10}px`;
  return (
    <WaypointView style={{ top: topOffset, left }}>
      {text}
      <button
        onClick={() =>
          deleteWaypoint({
            rangeId,
            waypointId: id,
          })
        }
      >
        Delete
      </button>
    </WaypointView>
  );
};
