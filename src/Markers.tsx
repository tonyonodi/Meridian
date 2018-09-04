// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import IMarker from "./IMarker";
import getFractionalPositionFromTime from "./lib/getFractionalPositionFromTime";

const MarkerView = styled.div`
  position: absolute;
  width: 100%;
  color: white;
  border-bottom: solid 1px white;
  z-index: 99;
`;

const MarkerName = styled.input`
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
`;

interface IMarkerComponent {
  leftOffset: number;
  text: string;
  time: number;
  topOffset: number;
}

const Marker = ({ text, time, topOffset, leftOffset }: IMarkerComponent) => {
  return (
    <MarkerView style={{ top: `${topOffset}px` }}>
      <MarkerName value={text} style={{ marginLeft: `${leftOffset}px` }} />
    </MarkerView>
  );
};

interface IMarkerProps {
  appWidth: number;
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
          const topOffset = fractionalPosition * document.body.clientHeight;
          return (
            <Marker
              key={marker.id}
              {...marker}
              topOffset={topOffset}
              leftOffset={this.props.appWidth}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
