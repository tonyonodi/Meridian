import * as format from "date-fns/format";
import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { DAY_IN_MS, VIEWPORT_HEIGHT_IN_HOURS } from "./config";

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
  time: number;
  t_0: number;
  timezone: string;
}

export default ({ time, t_0 }: IDayProps) => {
  const dayFraction = (time - t_0) / DAY_IN_MS;
  const offsetTop = 50 - 200 * dayFraction;
  const date = format(t_0, "DD");
  const month = format(t_0, "MMM");

  return (
    <ParentView style={{ top: `${offsetTop}vh` }}>
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
