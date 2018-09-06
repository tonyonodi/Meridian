// tslint:disable:no-console
import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import {
  TIMELINE_WIDTH,
  VIEWPORT_HEIGHT_IN_HOURS,
  WINDOW_HEIGHT_IN_MS,
} from "./config";

const DAY_HEIGHT = (100 * 24) / VIEWPORT_HEIGHT_IN_HOURS;

const ParentView = styled.div`
  height: ${DAY_HEIGHT}vh;
  position: absolute;
  width: 100%;
`;

interface IHeader {
  color: string;
}
const Header = styled.div<IHeader>`
  position: sticky;
  top: -1px;
  background: rgb(${({ color }) => color});
  text-align: center;
  font-weight: bold;
  width: ${TIMELINE_WIDTH}px;
  font-weight: 200;
  &:after {
    content: "";
    background: linear-gradient(
      rgba(${({ color }) => color}, 1),
      rgba(${({ color }) => color}, 0)
    );
    height: 30px;
    width: 100%;
    display: block;
    position: absolute;
  }
`;

const Date = styled.div`
  font-size: 2em;
`;

const Month = styled.div`
  text-transform: uppercase;
  font-weight: bold;
`;

const Markers = styled.ul`
  height: 100%;
  width: ${TIMELINE_WIDTH}px;
  text-align: center;
  list-style: none;
  margin-top: 0;
  position: absolute;
  padding-left: 0;
`;

const Marker = styled.li`
  height: calc(100% / 24);
  position: relative;
  &:nth-child(even) > div,
  &:first-child > div,
  &:first-child > div:after {
    visibility: hidden;
  }
`;

const MarkerTime = styled.div`
  position: absolute;
  top: -8px;
  left: 16px;
  &:after {
    content: "";
    visibility: visible;
    border-top: solid 2px white;
    width: 10px;
    display: block;
    margin-left: -15px;
    margin-top: -11px;
  }
`;

interface IDayProps {
  t_0: number;
  time: number;
  midnight: number;
  date: string;
  month: string;
  color: [number, number, number];
}

export default ({ t_0, midnight, date, month, color }: IDayProps) => {
  const windowBottomMS = t_0 - WINDOW_HEIGHT_IN_MS / 2;

  const midnightBottomOffset = midnight - windowBottomMS;
  const fractionOffset = midnightBottomOffset / WINDOW_HEIGHT_IN_MS;
  const colorString = color.join(", ");

  return (
    <ParentView style={{ top: `${100 * fractionOffset}%` }}>
      <Markers>
        {_.range(0, 24).map(i => {
          const markerTime = i;
          return (
            <Marker key={markerTime}>
              <MarkerTime>
                {markerTime}
                :00
              </MarkerTime>
            </Marker>
          );
        })}
      </Markers>
      <Header color={colorString}>
        <Date>{date}</Date>
        <Month>{month}</Month>
      </Header>
    </ParentView>
  );
};
