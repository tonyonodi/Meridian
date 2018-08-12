import * as format from "date-fns/format";
import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { DAY_IN_MS, VIEWPORT_HEIGHT_IN_HOURS } from "./config";

const DAY_HEIGHT = (100 * 24) / VIEWPORT_HEIGHT_IN_HOURS;

const timeLineWidth = 100;

const ParentView = styled.div`
  height: ${DAY_HEIGHT}vh;
  position: absolute;
  border-left: solid 1px;
  border-right: solid 1px;
  width: ${timeLineWidth}px;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: white;
  text-align: center;
  font-weight: bold;
  width: 100%;
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

const Cursor = styled.h1`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: ${timeLineWidth}px;
  text-align: center;
  margin: 0;
  background: white;
  font-weight: 200;
  &:before {
    content: "";
    top: -30px;
    background: linear-gradient(rgba(255, 255, 255, 0), white);
    height: 30px;
    width: 100%;
    display: block;
    position: absolute;
  }
  &:after {
    content: "";
    background: linear-gradient(white, rgba(255, 255, 255, 0));
    height: 30px;
    width: 100%;
    display: block;
    position: absolute;
  }
`;

interface IDayProps {
  time: number;
  t_0: number;
  date: string;
  month: string;
}

export default ({ time, t_0, date, month }: IDayProps) => {
  const dayFraction = (time - t_0) / DAY_IN_MS;
  const offsetTop = 50 - 200 * dayFraction;

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
      <Cursor>{format(time, "HH:mm")}</Cursor>
    </ParentView>
  );
};
