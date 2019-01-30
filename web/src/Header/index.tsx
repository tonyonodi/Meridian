import * as React from "react";
import styled from "styled-components";
import * as luxon from "luxon";
import Icon, { IconTypes } from "../Icon";
import Menu from "./Menu";
import { MAIN_BACKGROUND_COLOR, HEADER_HEIGHT } from "../config";

const { useState } = React;

const { DateTime } = luxon;

const ParentView = styled.div`
  position: fixed;
  height: ${HEADER_HEIGHT}px;
  background: rgb(${MAIN_BACKGROUND_COLOR.join(",")});
  width: 100%;
  z-index: 500;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  &:focus {
    outline: none;
  }
  &:focus svg {
    filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.3));
  }
`;

const MonthAndYear = styled.h1`
  margin: 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 200;
`;

interface IHeaderProps {
  timeCursor: number;
  updateTime: (
    { activateClockMode, time }: { activateClockMode: boolean; time: number }
  ) => void;
  addWaypointDraft: (rangeId: string) => void;
  toggleAddTimezone: (state?: boolean) => void;
}

export default ({
  timeCursor,
  updateTime,
  addWaypointDraft,
  toggleAddTimezone,
}: IHeaderProps) => {
  const [menuActive, setMenuActive] = useState(false);

  const dateTime = DateTime.fromMillis(timeCursor);
  const year = dateTime.toFormat("yyyy");
  const month = dateTime.toFormat("LLLL");

  return (
    <React.Fragment>
      <ParentView>
        <MenuButton onClick={() => setMenuActive(true)}>
          <Icon
            type={IconTypes.Hamburger}
            style={{
              width: 21,
              color: "white",
            }}
          />
        </MenuButton>
        <MonthAndYear>
          {month} {year}
        </MonthAndYear>
      </ParentView>
      <Menu
        active={menuActive}
        timeCursor={timeCursor}
        closeModal={() => setMenuActive(false)}
        updateTime={updateTime}
        addWaypointDraft={addWaypointDraft}
        toggleAddTimezone={toggleAddTimezone}
      />
    </React.Fragment>
  );
};
