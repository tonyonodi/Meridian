// tslint:disable:no-console
import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { VIEWPORT_HEIGHT_IN_HOURS, WINDOW_HEIGHT_IN_MS } from "./config";

const DAY_HEIGHT = (100 * 24) / VIEWPORT_HEIGHT_IN_HOURS;

const ParentView = styled.div`
  height: ${DAY_HEIGHT}vh;
  position: absolute;
  width: 100%;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: white;
  text-align: center;
  font-weight: bold;
  width: 100%;
  font-weight: 200;
  &:after {
    content: "";
    background: linear-gradient(white, rgba(255, 255, 255, 0));
    height: 30px;
    width: 100%;
    display: block;
    position: absolute;
  }
`;

const Date = styled.div`
  font-size: 2em;
`;

const Month = styled.div``;

const Markers = styled.ul`
  height: 100%;
  width: 100%;
  text-align: center;
  list-style: none;
  margin-top: 0;
  position: absolute;
  padding-left: 0;
`;

const Marker = styled.li`
  height: calc(100% / 24);
  &:first-child {
    visibility: hidden;
  }
`;

interface IDayProps {
  t_0: number;
  time: number;
  midnight: number;
  date: string;
  month: string;
}

export default ({ t_0, midnight, date, month }: IDayProps) => {

  const windowBottomMS = t_0 - WINDOW_HEIGHT_IN_MS / 2;

  const midnightBottomOffset = midnight - windowBottomMS;
  const fractionOffset = midnightBottomOffset / WINDOW_HEIGHT_IN_MS;

  return (
    <ParentView style={{ top: `${100 * fractionOffset}%` }}>
      <Markers>
        {_.range(0, 24).map(i => {
          const markerTime = i;
          return (
            <Marker key={markerTime}>
              {markerTime}
              :00
            </Marker>
          );
        })}
      </Markers>
      <Header>
        <Date>{date}</Date>
        <Month>{month}</Month>
      </Header>
    </ParentView>
  );
};
