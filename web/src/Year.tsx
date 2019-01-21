import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";

const { DateTime } = luxon;

const ParentView = styled.div`
  color: white;
  position: fixed;
  bottom: 5px;
  right: 5px;
  font-size: 2.1rem;
  line-height: 1.8rem;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);
  z-index: 10;
`;

const Month = styled.span``;

const Year = styled.span`
  font-weight: bold;
`;

interface IComponentProps {
  timeCursor: number;
}

export default ({ timeCursor }: IComponentProps) => {
  const dateTime = DateTime.fromMillis(timeCursor);
  // const year = new Date(timeCursor).getFullYear().toString();
  const year = dateTime.toFormat("yyyy");
  const month = dateTime.toFormat("LLLL");

  return (
    <ParentView>
      <Month>{month}</Month>{` `}
      <Year>{year}</Year>
    </ParentView>
  );
};
