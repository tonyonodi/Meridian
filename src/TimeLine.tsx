// tslint:disable:no-console
import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";
import { PARENT_VIEW_WIDTH, TIMELINE_WIDTH } from "./config";
import Day from "./Day";
import Icon, { IconTypes } from "./Icon";
import ITimezone from "./ITimezone";
import { isAndroidChrome, isFirefox } from "./lib/browserInfo";

const { DateTime } = luxon;

interface IParentView {
  bgColor: [number, number, number];
  index: number;
}

const ParentView = styled.div<IParentView>`
  color: white;
  width: ${PARENT_VIEW_WIDTH}px;
  position: relative;
  // background: rgb($ {({ bgColor }) => bgColor.join(", ")});
  z-index: ${({ index }) => index};
  box-shadow: 2px 0 2px 2px rgba(0, 0, 0, 0.1);
  user-select: none;
`;

interface ICursorContainer {
  color: string;
}

const CursorContainer = styled.div<ICursorContainer>`
  position: sticky;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  background: rgb(${({ color }) => color});
  &:before {
    content: "";
    left: 0;
    top: -50px;
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
    background: linear-gradient(
      rgba(${({ color }) => color}, 0),
      rgba(${({ color }) => color}, 1)
    );
  }
  &:after {
    content: "";
    left: 0;
    bottom: -50px;
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
    background: linear-gradient(
      rgba(${({ color }) => color}, 1),
      rgba(${({ color }) => color}, 0)
    );
  }
`;

const Cursor = styled.input`
  font-family: inherit;
  color: inherit;
  background: none;
  border: none;
  font-size: 1.8rem;
  overflow: visible;
  width: ${PARENT_VIEW_WIDTH}px;
  text-align: center;
  margin: 0;
  width: ${isAndroidChrome ? "105%" : "100%"};
  margin-left: ${isAndroidChrome ? "8%" : "0"};
  ${isFirefox ? "clip-path: inset(0 17px 0 0);" : ""}
  ${isFirefox ? "padding-left: 5px;" : ""}
  &:focus {
    outline: none;
  }
  &::-webkit-clear-button {
    display: none;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
  &::-webkit-search-results-button {
    -webkit-appearance: none;
  }
  -webkit-appearance: none;
`;

const TitleBar = styled.div`
  position: sticky;
  right: 0;
  top: 0;
  z-index: 20;
`;

const Title = styled.h1`
  transform: rotate(90deg);
  transform-origin: left bottom 0;
  width: 100vh;
  margin-left: ${TIMELINE_WIDTH - 7}px;
  font-size: 1.8em;
  text-transform: uppercase;
  z-index: 100;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 0;
  &:focus {
    outline: none;
  }
  &:focus svg {
    filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.3));
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
  t_0: number;
  timeCursor: number;
  timezone: ITimezone;
  updateTime: (
    { activateClockMode, time }: { activateClockMode?: boolean; time: number }
  ) => void;
  color: [number, number, number];
  remove: () => void;
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
    const { t_0, timeCursor, timezone, color, index, remove } = this.props;
    const titleText = timezone.city;
    const colorString = color.join(", ");

    const startOfYesterday = getStartOfDay(timeCursor, -1, timezone.timezone);
    const startOfToday = getStartOfDay(timeCursor, 0, timezone.timezone);
    const startOfTomorrow = getStartOfDay(timeCursor, 1, timezone.timezone);

    return (
      <ParentView bgColor={color} index={index}>
        <TitleBar>
          <Title>
            {titleText}
            <CloseButton onClick={remove}>
              <Icon
                style={{
                  height: "27px",
                  marginBottom: "-2px",
                  marginLeft: "10px",
                }}
                type={IconTypes.Times}
              />
            </CloseButton>
          </Title>
        </TitleBar>
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
        <ChangeTimeTarget
          changeType={TimeChange.Decrement}
          onClick={this.handleClick(TimeChange.Decrement)}
        />
        <ChangeTimeTarget
          changeType={TimeChange.Increment}
          onClick={this.handleClick(TimeChange.Increment)}
        />
        <CursorContainer color={colorString}>
          <Cursor
            type="time"
            value={DateTime.fromMillis(timeCursor, {
              zone: timezone.timezone,
            }).toFormat("HH:mm")}
            onChange={this.handleChange}
            required={true}
          />
        </CursorContainer>
      </ParentView>
    );
  }
}
