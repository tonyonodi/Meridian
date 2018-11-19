// tslint:disable:no-console
import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";
import { PARENT_VIEW_WIDTH } from "./config";
import IMarker from "./IMarker";
import ITimezone from "./ITimezone";
import getFractionalPositionFromTime from "./lib/getFractionalPositionFromTime";
import TimeCursor from "./TimeCursor";

const { DateTime } = luxon;

const MarkerView = styled.div`
  position: absolute;
  width: 100%;
  color: white;
  /* background: rgba(0, 0, 0, 0.15); */
  z-index: 99;
`;

interface IMarkerName {
  onChange: (text: string) => void;
}

const MarkerName = styled.input<IMarkerName>`
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  padding-left: 10px;
  transform: translateY(-50%);
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
      <TimeCursor>{timeString}</TimeCursor>
    </TimezoneTimeView>
  );
};

interface IMarkerComponent {
  handleNameChange: (event: any) => void;
  id: string;
  leftOffset: number;
  text: string;
  time: number;
  timezones: ITimezone[];
  topOffset: number;
  getInputRef: (el: any) => void;
}

const Marker = ({
  id,
  text,
  time,
  timezones,
  topOffset,
  leftOffset,
  handleNameChange,
  getInputRef,
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
      <MarkerName
        name={id}
        value={text}
        placeholder="Untitled Marker"
        onChange={handleNameChange}
        style={{ marginLeft: `${leftOffset}px` }}
        innerRef={getInputRef}
      />
    </MarkerView>
  );
};

interface IMarkerProps {
  appWidth: number;
  markers: IMarker[];
  timezones: ITimezone[];
  updateMarkerText: (id: string, text: string) => void;
  t_0: number;
}

export default class Markers extends React.Component<IMarkerProps> {
  public inputElement: any;

  public handleNameChange = (event: any) => {
    const { name, value } = event.target;
    this.props.updateMarkerText(name, value);
  };

  public getInputRef = (el: any) => {
    this.inputElement = el;
  };

  public componentDidMount() {
    console.log("mounted!", this.inputElement);
    // this.inputElement.focus();
  }

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
              handleNameChange={this.handleNameChange}
              leftOffset={this.props.appWidth}
              getInputRef={this.getInputRef}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
