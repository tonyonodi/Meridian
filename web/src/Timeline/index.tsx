// tslint:disable:no-console
import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";
import Day from "./Day";
import Title from "./Title";
import WaypointCursor from "./WaypointCursor";
import ITimezone from "../ITimezone";
import { PARENT_VIEW_WIDTH } from "../config";
import { IRange } from "../Ranges/IRange";
import CurrentTimeCursor from "./CurrentTimeCursor";

const { DateTime } = luxon;

interface IParentView {
  bgColor: [number, number, number];
  index: number;
  pageXOffset: number;
  zIndex: number;
}

const ParentView = styled.div<IParentView>`
  color: white;
  width: ${PARENT_VIEW_WIDTH}px;
  position: relative;
  z-index: ${({ zIndex }) => zIndex};
  user-select: none;
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

enum TimeChange {
  Decrement,
  Increment,
}

interface IChangeTimeTargetProps {
  changeType: TimeChange;
}

const ChangeTimeTarget = styled.div<IChangeTimeTargetProps>`
  position: sticky;
  width: 100%;
  height: 50vh;
  ${({ changeType }) => {
    if (changeType === TimeChange.Increment) {
      return "top: 50vh;";
    } else {
      return "top: 0;";
    }
  }} left: 0;
  z-index: 0;
`;

const getStartOfDay = (time: number, offset: number, timezone: string) => {
  return DateTime.fromMillis(time)
    .setZone(timezone)
    .plus({ days: offset })
    .startOf("day");
};

interface ITimeLineProps {
  index: number;
  pageXOffset: number;
  t_0: number;
  timeCursor: number;
  timezone: ITimezone;
  updateTime: (
    { activateClockMode, time }: { activateClockMode?: boolean; time: number }
  ) => void;
  color: [number, number, number];
  ranges: IRange[];
  remove: () => void;
  zIndex: number;
}



export default class TimeLine extends React.Component<ITimeLineProps> {
  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeRegex = /^(\d\d):(\d\d)$/;
    const match = timeRegex.exec(event.target.value);
    if (!match) {
      return;
    }

    const hours = match[1];
    const minutes = match[2];

    const millis = DateTime.fromMillis(this.props.timeCursor, {
      zone: this.props.timezone.timezone,
    })
      .set({
        hour: parseInt(hours, 10),
        minute: parseInt(minutes, 10),
      })
      .toMillis();

    this.props.updateTime({ time: millis });
  };

  public handleClick = (changeType: TimeChange) => (event: any) => {
    const time = DateTime.fromMillis(this.props.timeCursor);

    const newTime =
      changeType === TimeChange.Decrement
        ? time.minus({ minutes: 1 })
        : time.plus({ minutes: 1 });

    this.props.updateTime({ time: newTime.toMillis() });
  };

  public render() {
    const {
      t_0,
      timeCursor,
      timezone,
      color,
      index,
      ranges,
      remove,
      updateTime,
      zIndex,
    } = this.props;
    const titleText = timezone.niceName.split(/,|\//)[0];

    const startOfYesterday = getStartOfDay(timeCursor, -1, timezone.timezone);
    const startOfToday = getStartOfDay(timeCursor, 0, timezone.timezone);
    const startOfTomorrow = getStartOfDay(timeCursor, 1, timezone.timezone);

    const waypoints = ranges.reduce((acc, range) => {
      return [...acc, ...range.waypoints];
    }, []);

    return (
      <React.Fragment>
        <CurrentTimeCursor timezone={timezone} timeCursor={timeCursor} index={index} updateTime={updateTime} />
        <ParentView
          bgColor={color}
          pageXOffset={pageXOffset}
          index={index}
          zIndex={zIndex}
        >
          <React.Fragment>
            {waypoints.map(waypoint => (
              <WaypointCursor
                color={color}
                key={waypoint.id}
                t_0={t_0}
                timezone={timezone}
                {...waypoint}
              />
            ))}
          </React.Fragment>
          <Title
            color={color}
            titleText={titleText}
            remove={remove}
           />
          <Day
            color={color}
            time={timeCursor}
            t_0={t_0}
            midnight={startOfYesterday.toMillis()}
            date={startOfYesterday.toFormat("dd")}
            day={startOfYesterday.toFormat("ccc")}
          />
          <Day
            color={color}
            time={timeCursor}
            t_0={t_0}
            midnight={startOfToday.toMillis()}
            date={startOfToday.toFormat("dd")}
            day={startOfToday.toFormat("ccc")}
          />
          <Day
            color={color}
            time={timeCursor}
            t_0={t_0}
            midnight={startOfTomorrow.toMillis()}
            date={startOfTomorrow.toFormat("dd")}
            day={startOfTomorrow.toFormat("ccc")}
          />
          <ChangeTimeTarget
            changeType={TimeChange.Decrement}
            onClick={this.handleClick(TimeChange.Decrement)}
          />
          <ChangeTimeTarget
            changeType={TimeChange.Increment}
            onClick={this.handleClick(TimeChange.Increment)}
          />
        </ParentView>
      </React.Fragment>
    );
  }
}
