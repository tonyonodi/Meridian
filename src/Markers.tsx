// tslint:disable:no-console
// tslint:disable:max-classes-per-file
import * as _ from "lodash";
import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";
import { PARENT_VIEW_WIDTH } from "./config";
import IMarker from "./IMarker";
import ITimezone from "./ITimezone";
import getFractionalPositionFromTime from "./lib/getFractionalPositionFromTime";
import { msFromMinuteTimestamp } from "./lib/minuteUTCTimestamp";
import TimeCursor from "./TimeCursor";

const { DateTime } = luxon;

const MarkerView = styled.div`
  transform: translateY(-50%);
  position: absolute;
  width: 100%;
  color: white;
  z-index: 99;
`;

interface IMarkerName {
  onChange: (text: string) => void;
}

const markerInputUnderlineWidth = "2px";
const MarkerName = styled.input<IMarkerName>`
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  padding-left: 10px;
  padding-bottom: ${markerInputUnderlineWidth};
  &:focus {
    outline: none;
    border-bottom: solid ${markerInputUnderlineWidth} white;
    padding-bottom: 0;
  }
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
}

class Marker extends React.Component<IMarkerComponent> {
  public inputElement: any;

  public shouldComponentUpdate(nextProps: IMarkerComponent) {
    return (
      nextProps.text !== this.props.text ||
      nextProps.timezones !== this.props.timezones ||
      nextProps.topOffset !== this.props.topOffset ||
      nextProps.leftOffset !== this.props.leftOffset
    );
  }

  public componentDidMount() {
    this.inputElement.focus();
  }

  public getInputRef = (el: any) => {
    this.inputElement = el;
  };

  public handleSubmit = (event: any) => {
    event.preventDefault();
    this.inputElement.blur();
  };

  public render() {
    const {
      id,
      text,
      time,
      timezones,
      topOffset,
      leftOffset,
      handleNameChange,
    } = this.props;

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
        <form onSubmit={this.handleSubmit}>
          <MarkerName
            name={id}
            value={text}
            placeholder="Untitled Marker"
            onChange={handleNameChange}
            style={{ marginLeft: `${leftOffset}px` }}
            innerRef={this.getInputRef}
          />
        </form>
      </MarkerView>
    );
  }
}

interface IMarkerProps {
  appWidth: number;
  markers: { [timestamp: string]: IMarker };
  timezones: ITimezone[];
  updateMarkerText: (id: string, text: string) => void;
  t_0: number;
}

export default class Markers extends React.Component<IMarkerProps> {
  public handleNameChange = (event: any) => {
    const { name, value } = event.target;
    this.props.updateMarkerText(name, value);
  };

  public componentDidUpdate() {
      const { markers } = this.props;

      window.localStorage.setItem(
        "__timezonesapp.markers",
        JSON.stringify(markers)
      );
  }

  public render() {
    return (
      <React.Fragment>
        {_.map(this.props.markers, (marker, minuteTimestamp) => {
          const time = msFromMinuteTimestamp(minuteTimestamp);
          const fractionalPosition = getFractionalPositionFromTime({
            t_0: this.props.t_0,
            time,
          });
          const topOffset = fractionalPosition * document.body.clientHeight;
          return (
            <Marker
              key={minuteTimestamp}
              id={minuteTimestamp}
              text={marker.text}
              time={time}
              timezones={this.props.timezones}
              topOffset={topOffset}
              handleNameChange={this.handleNameChange}
              leftOffset={this.props.appWidth}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
