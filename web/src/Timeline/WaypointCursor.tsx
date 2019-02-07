import * as React from "react";
import styled from "styled-components";
import { IRangeWaypoint } from "../Ranges/IRange";
import ITimezone from "src/ITimezone";
import getFractionalPositionFromTime from "src/lib/getFractionalPositionFromTime";
import { DateTime } from "luxon";

interface IParentView {
  bgColor: [number, number, number];
}

const ParentView = styled.div<IParentView>`
  position: absolute;
  transform: translateY(-50%);
  font-style: italic;
  background: rgb(${({ bgColor }) => bgColor.join(", ")});
  width: 100%;
  text-align: center;
  padding-right: 10px;
  z-index: 1;
  font-weight: 700;
  font-size: 1.2rem;
  &:before {
    content: "";
    top: -50px;
    background: linear-gradient(
      rgba(${({ bgColor }) => bgColor.join(", ")}, 0),
      rgba(${({ bgColor }) => bgColor.join(", ")}, 1)
    );
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
  }
  &:after {
    content: "";
    background: linear-gradient(
      rgba(${({ bgColor }) => bgColor.join(", ")}, 1),
      rgba(${({ bgColor }) => bgColor.join(", ")}, 0)
    );
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
  }
`;

interface IWaypointCursorProps extends IRangeWaypoint {
  t_0: number;
  timezone: ITimezone;
  color: [number, number, number];
}

export default ({
  color,
  text,
  time,
  id,
  t_0,
  timezone,
}: IWaypointCursorProps) => {
  const fractionalPosition = getFractionalPositionFromTime({
    t_0,
    time,
  });
  const topOffset = fractionalPosition * document.body.clientHeight;
  const timeString = DateTime.fromMillis(time, {
    zone: timezone.timezone,
  }).toFormat("HH:mm");

  return (
    <ParentView style={{ top: topOffset }} bgColor={color}>
      {timeString}
    </ParentView>
  );
};
