// tslint:disable:jsx-no-lambda
import * as React from "react";
import styled from "styled-components";

import Icon, { IconTypes } from "src/Icon";
import getFractionalPositionFromTime from "../lib/getFractionalPositionFromTime";
import Menu from "./WaypointMenu";
import {
  DARK_TEXT,
  DURATION_LINE_COLOR,
  BACKGROUND_WHITE,
  WAYPOINT_RADIUS,
} from "src/config";

const { useState, useRef } = React;

const MenuButton = styled.button`
  background: none;
  border: none;
  margin-top: 2.5px;
  border-radius: 3px;
  padding-top: 5px;
  margin-left: 4px;
  margin-top: -2px;
  padding-left: 4px;
  padding-right: 5px;
  &:focus {
    outline: none;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const Marker = styled.div`
  width: ${WAYPOINT_RADIUS}px;
  height: ${WAYPOINT_RADIUS}px;
  border-radius: 100%;
  background: rgb(${BACKGROUND_WHITE.join(",")});
  display: inline-block;
  border: solid 3px rgb(${DURATION_LINE_COLOR.join(",")});
  box-sizing: border-box;
  margin-right: 4px;
`;

const MarkerText = styled.div`
  white-space: nowrap;
`;

const ParentView = styled.div`
  position: absolute;
  transform: translateY(-50%);
  z-index: 10;
`;

const WaypointView = styled.div`
  display: flex;
  align-items: center;
  color: rgb(${DARK_TEXT.join(",")});
  font-weight: bold;
`;

interface IWaypointComponent {
  appWidth: number;
  id: string;
  rangeId: string;
  t_0: number;
  text: string;
  time: number;
  deleteWaypoint: ({
    rangeId,
    waypointId,
  }: {
    rangeId: string;
    waypointId: string;
  }) => void;
  deleteRange: (rangeId: string) => void;
  addWaypointDraft: (rangeId: string) => void;
}

export default ({
  appWidth,
  id,
  rangeId,
  time,
  text,
  t_0,
  deleteWaypoint,
  deleteRange,
  addWaypointDraft,
}: IWaypointComponent) => {
  const [menuOpen, toggleMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

  const fractionalPosition = getFractionalPositionFromTime({
    t_0,
    time,
  });

  const topOffset = fractionalPosition * document.body.clientHeight;
  const left = appWidth + 10;
  return (
    <ParentView style={{ top: topOffset, left }}>
      <WaypointView>
        <Marker />
        <MarkerText>{text}</MarkerText>
        <MenuButton
          innerRef={menuToggleRef}
          onClick={() => toggleMenuOpen(currentVal => !currentVal)}
        >
          <Icon
            type={IconTypes.HorizontalEllipsis}
            style={{ color: `rgb(${DARK_TEXT})`, width: 15 }}
          />
        </MenuButton>
      </WaypointView>
      {menuOpen && (
        <Menu
          waypointId={id}
          rangeId={rangeId}
          deleteWaypoint={deleteWaypoint}
          deleteRange={deleteRange}
          addWaypointDraft={addWaypointDraft}
          closeMenu={() => toggleMenuOpen(() => false)}
          menuToggleRef={menuToggleRef}
        />
      )}
    </ParentView>
  );
};
