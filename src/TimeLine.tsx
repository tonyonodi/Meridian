// tslint:disable:no-console
import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";
import { PARENT_VIEW_WIDTH, TIMELINE_WIDTH } from "./config";
import Day from "./Day";

const { DateTime } = luxon;

const ParentView = styled.div`
  color: white;
  width: ${PARENT_VIEW_WIDTH}px;
  position: relative;
  background: ${({ color }) => color};
`;

const Cursor = styled.h1`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: ${PARENT_VIEW_WIDTH}px;
  text-align: center;
  margin: 0;
  background: ${({ color }) => color};
  font-weight: 200;
  &:before {
    content: "";
    top: -50px;
    background: linear-gradient(
      rgba(255, 255, 255, 0),
      ${({ color }) => color}
    );
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
  }
  &:after {
    content: "";
    background: linear-gradient(
      ${({ color }) => color},
      rgba(255, 255, 255, 0)
    );
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
  }
`;

const Title = styled.h1`
  position: fixed;
  transform: rotate(90deg);
  transform-origin: left bottom 0;
  width: 100vh;
  margin-left: ${TIMELINE_WIDTH - 7}px;
  font-size: 1.8em;
  text-transform: uppercase;
`;

const getStartOfDay = (time: number, offset: number, timezone: string) => {
  return DateTime.fromMillis(time)
    .setZone(timezone)
    .plus({ days: offset })
    .startOf("day");
};

interface ITimeLineProps {
  t_0: number;
  timeCursor: number;
  timezone: string;
  color: string;
}

export default class TimeLine extends React.Component<ITimeLineProps> {
  public render() {
    const { t_0, timeCursor, timezone, color } = this.props;
    const titleText = timezone.split("/")[1].replace(/_/g, " ");

    const startOfYesterday = getStartOfDay(timeCursor, -1, timezone);
    const startOfToday = getStartOfDay(timeCursor, 0, timezone);
    const startOfTomorrow = getStartOfDay(timeCursor, 1, timezone);

    return (
      <ParentView color={color}>
        <Title>{titleText}</Title>
        <Day
          color={color}
          time={timeCursor}
          t_0={t_0}
          midnight={startOfYesterday.toMillis()}
          date={startOfYesterday.toFormat("dd")}
          month={startOfYesterday.toFormat("MMM")}
        />
        <Day
          color={color}
          time={timeCursor}
          t_0={t_0}
          midnight={startOfToday.toMillis()}
          date={startOfToday.toFormat("dd")}
          month={startOfToday.toFormat("MMM")}
        />
        <Day
          color={color}
          time={timeCursor}
          t_0={t_0}
          midnight={startOfTomorrow.toMillis()}
          date={startOfTomorrow.toFormat("dd")}
          month={startOfTomorrow.toFormat("MMM")}
        />
        <Cursor color={color}>
          {DateTime.fromMillis(timeCursor, { zone: timezone }).toFormat(
            "HH:mm"
          )}
        </Cursor>
      </ParentView>
    );
  }
}
