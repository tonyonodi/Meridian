// tslint:disable:no-console
import { DateTime } from "luxon";
import * as React from "react";
import styled from "styled-components";
import Day from "./Day";

const timeLineWidth = 100;

const ParentView = styled.div`
  width: ${timeLineWidth}px;
  margin-right: 30px;
  position: relative;
`;

const Cursor = styled.h1`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: ${timeLineWidth}px;
  text-align: center;
  margin: 0;
  background: white;
  font-weight: 200;
  &:before {
    content: "";
    top: -30px;
    background: linear-gradient(rgba(255, 255, 255, 0), white);
    height: 30px;
    width: 100%;
    display: block;
    position: absolute;
  }
  &:after {
    content: "";
    background: linear-gradient(white, rgba(255, 255, 255, 0));
    height: 30px;
    width: 100%;
    display: block;
    position: absolute;
  }
`;

const Title = styled.h1`
  position: absolute;
  transform: rotate(90deg);
  transform-origin: left top 0;
  left: 131px;
  width: 100vh;
`;

interface ITimeLineProps {
  timeCursor: number;
  timezone: string;
}

const getMidnight = (time: number, offset: number, timezone: string) => {
  return DateTime.fromMillis(time)
    .setZone(timezone)
    .plus({ days: offset })
    .startOf("day")
    .toMillis();
};

export default class TimeLine extends React.Component<ITimeLineProps> {
  public render() {
    const { timeCursor, timezone } = this.props;
    const yesterday = getMidnight(timeCursor, -1, timezone);
    const today = getMidnight(timeCursor, 0, timezone);
    const tomorrow = getMidnight(timeCursor, 1, timezone);

    return <ParentView>
        <Title>{timezone.split("/")[1].replace(/_/g, " ")}</Title>
        <Day time={timeCursor} t_0={yesterday} timezone={timezone} />
        <Day time={timeCursor} t_0={today} timezone={timezone} />
        <Day time={timeCursor} t_0={tomorrow} timezone={timezone} />
        <Cursor>
          {DateTime.fromMillis(timeCursor, { zone: timezone }).toFormat(
            "HH:mm"
          )}
        </Cursor>
      </ParentView>;
  }
}
