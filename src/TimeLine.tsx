// tslint:disable:no-console
import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";
import Day from "./Day";

const { DateTime } = luxon;

const timeLineWidth = 100;

const ParentView = styled.div`
  width: ${timeLineWidth}px;
  margin-right: 30px;
  position: relative;
`;

const Cursor = styled.h1`
  position: fixed;
  color: darkorange;
  top: 50%;
  transform: translateY(-50%);
  width: ${timeLineWidth}px;
  text-align: center;
  margin: 0;
  background: white;
  font-weight: 200;
  &:before {
    content: "";
    top: -50px;
    background: linear-gradient(rgba(255, 255, 255, 0), white);
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
  }
  &:after {
    content: "";
    background: linear-gradient(white, rgba(255, 255, 255, 0));
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
  }
`;

const Title = styled.h1`
  position: fixed;
  top: -50px;
  transform: rotate(90deg);
  transform-origin: left bottom 0;
  width: 100vh;
  margin-left: 102px;
  font-size: 1.8em;
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
}

export default class TimeLine extends React.Component<ITimeLineProps> {
  public render() {
    const { t_0, timeCursor, timezone } = this.props;
    const titleText = timezone.split("/")[1].replace(/_/g, " ");

    const startOfYesterday = getStartOfDay(timeCursor, -1, timezone);
    const startOfToday = getStartOfDay(timeCursor, 0, timezone);
    const startOfTomorrow = getStartOfDay(timeCursor, 1, timezone);

    return (
      <ParentView>
        <Title>{titleText}</Title>
        <Day
          time={timeCursor}
          t_0={t_0}
          midnight={startOfYesterday.toMillis()}
          date={startOfYesterday.toFormat("dd")}
          month={startOfYesterday.toFormat("MMM")}
        />
        <Day
          time={timeCursor}
          t_0={t_0}
          midnight={startOfToday.toMillis()}
          date={startOfToday.toFormat("dd")}
          month={startOfToday.toFormat("MMM")}
        />
        <Day
          time={timeCursor}
          t_0={t_0}
          midnight={startOfTomorrow.toMillis()}
          date={startOfTomorrow.toFormat("dd")}
          month={startOfTomorrow.toFormat("MMM")}
        />
        <Cursor>
          {DateTime.fromMillis(timeCursor, { zone: timezone }).toFormat(
            "HH:mm"
          )}
        </Cursor>
      </ParentView>
    );
  }
}
