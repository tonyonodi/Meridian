import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";
import ITimezone from "./ITimezone";
import { isFirefox, isAndroidChrome } from "./lib/browserInfo";
import { PARENT_VIEW_WIDTH, PALETTE } from "./config";

const { DateTime } = luxon;

const ParentView = styled.div`
  height: 40px;
  z-index: 900;
  position: sticky;
  top: 50%;
  display: flex;
  transform: translateY(-50%);
`;

interface ICursorContainer {
  index: number;
  color: string;
}

const CursorContainer = styled.div<ICursorContainer>`
  color: white;
  position: sticky;
  top: 50%;
  width: ${PARENT_VIEW_WIDTH}px;
  background: rgb(${({ color }) => color});
  z-index: 1100;
  height: 40px;
  &:before {
    content: "";
    left: 0;
    top: -50px;
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
    background: linear-gradient(
      rgba(${({ color }) => color}, 0),
      rgba(${({ color }) => color}, 1)
    );
  }
  &:after {
    content: "";
    left: 0;
    bottom: -50px;
    height: 50px;
    width: 100%;
    display: block;
    position: absolute;
    background: linear-gradient(
      rgba(${({ color }) => color}, 1),
      rgba(${({ color }) => color}, 0)
    );
  }
`;

const Cursor = styled.input`
  font-family: sans-serif;
  color: inherit;
  background: none;
  border: none;
  font-size: 1.8rem;
  overflow: visible;
  width: ${PARENT_VIEW_WIDTH}px;
  text-align: center;
  margin: 0;
  width: ${isAndroidChrome ? "105%" : "100%"};
  margin-left: ${isAndroidChrome ? "8%" : "0"};
  ${isFirefox ? "clip-path: inset(0 17px 0 0);" : ""}
  ${isFirefox ? "padding-left: 5px;" : ""}
  &:focus {
    outline: none;
  }
  &::-webkit-clear-button {
    display: none;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
  &::-webkit-search-results-button {
    -webkit-appearance: none;
  }
  -webkit-appearance: none;
`;

interface IProps {
  timezones: ITimezone[];
  timeCursor: number;
  updateTime: (
    { activateClockMode, time }: { activateClockMode?: boolean; time: number }
  ) => void;
}

export default ({ timezones, timeCursor, updateTime }: IProps) => {
  const handleChange = (timezone: ITimezone) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const timeRegex = /^(\d\d):(\d\d)$/;
    const match = timeRegex.exec(event.target.value);
    if (!match) {
      return;
    }

    const hours = match[1];
    const minutes = match[2];

    const millis = DateTime.fromMillis(timeCursor, {
      zone: timezone.timezone,
    })
      .set({
        hour: parseInt(hours, 10),
        minute: parseInt(minutes, 10),
      })
      .toMillis();

    updateTime({ time: millis });
  };

  return (
    <ParentView style={{ width: timezones.length * PARENT_VIEW_WIDTH }}>
      {timezones.map((timezone, index) => {
        const value = DateTime.fromMillis(timeCursor, {
          zone: timezone.timezone,
        }).toFormat("HH:mm");

        const color = PALETTE[index % PALETTE.length].join(",");

        return (
          <CursorContainer key={index} color={color} index={index}>
            <Cursor
              type="time"
              value={value}
              required={true}
              onChange={handleChange(timezone)}
            />
          </CursorContainer>
        );
      })}
    </ParentView>
  );
};