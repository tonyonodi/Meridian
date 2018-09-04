// tslint:disable:no-console
import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";
import { PARENT_VIEW_WIDTH } from "./config";
import IMarker from "./IMarker";
import ITimezone from "./ITimezone";
import getFractionalPositionFromTime from "./lib/getFractionalPositionFromTime";

const { DateTime } = luxon;

const MarkerView = styled.div`
  position: absolute;
  width: 100%;
  color: white;
  background: rgba(0, 0, 0, 0.15);
  z-index: 99;
`;

const MarkerName = styled.input`
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  padding-left: 10px;
`;

const TimezoneTimeView = styled.div`
  position: absolute;
  text-align: right;
  width: ${PARENT_VIEW_WIDTH}px;
`;

const TimezoneTime = ({
  index,
  timezone,
  time,
}: {
  index: number;
  timezone: string;
  time: number;
}) => {
  const timeString = DateTime.fromMillis(time, {
    zone: timezone,
  }).toFormat("HH:mm");
  const leftOffset = `${index * PARENT_VIEW_WIDTH}px`;

  return (
    <TimezoneTimeView style={{ left: leftOffset }}>
      {timeString}
    </TimezoneTimeView>
  );
};

interface IMarkerComponent {
  id: string;
  leftOffset: number;
  text: string;
  time: number;
  timezones: ITimezone[];
  topOffset: number;
}

const Marker = ({
  id,
  text,
  time,
  timezones,
  topOffset,
  leftOffset,
}: IMarkerComponent) => {
  return (
    <MarkerView style={{ top: `${topOffset}px` }}>
      {timezones.map(({ timezone }, index) => {
        const key = `${id}_${timezone}`;
        return (
          <TimezoneTime
            key={key}
            index={index}
            time={time}
            timezone={timezone}
          />
        );
      })}
      <MarkerName value={text} style={{ marginLeft: `${leftOffset}px` }} />
    </MarkerView>
  );
};

interface IMarkerProps {
  appWidth: number;
  markers: IMarker[];
  timezones: ITimezone[];
  t_0: number;
}

export default class Markers extends React.Component<IMarkerProps> {
  public render() {
    return (
      <React.Fragment>
        {this.props.markers.map(marker => {
          const fractionalPosition = getFractionalPositionFromTime({
            t_0: this.props.t_0,
            time: marker.time,
          });
          const topOffset = fractionalPosition * document.body.clientHeight;
          return (
            <Marker
              key={marker.id}
              {...marker}
              timezones={this.props.timezones}
              topOffset={topOffset}
              leftOffset={this.props.appWidth}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
