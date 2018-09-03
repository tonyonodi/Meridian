// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import IMarker from "./IMarker";
import getFractionalPositionFromTime from "./lib/getFractionalPositionFromTime";

interface IMarkerView {
  topOffset: number;
}

const MarkerView = styled.div<IMarkerView>`
  position: absolute;
  right: 0;
  top: ${({ topOffset }) => topOffset * 100}%;
`;

interface IMarkerComponent {
  text: string;
  time: number;
  fractionalPosition: number;
}

const Marker = ({ text, time, fractionalPosition }: IMarkerComponent) => {
  return <MarkerView topOffset={fractionalPosition}>{text}</MarkerView>;
};

interface IMarkerProps {
  markers: IMarker[];
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
          return (
            <Marker
              key={marker.id}
              {...marker}
              fractionalPosition={fractionalPosition}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
