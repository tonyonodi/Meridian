// tslint:disable:jsx-no-lambda
import * as React from "react";
import styled from "styled-components";

import Icon, { IconTypes } from "src/Icon";
import getFractionalPositionFromTime from "../lib/getFractionalPositionFromTime";
import Menu from "./WaypointMenu";

const { useState } = React;

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
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background: white;
  display: inline-block;
  border: solid 5px black;
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
  color: white;
  font-weight: bold;
`;

interface IWaypointComponent {
  appWidth: number;
  id: string;
  rangeId: string;
  t_0: number;
  text: string;
  time: number;
  deleteWaypoint: (
    {
      rangeId,
      waypointId,
    }: {
      rangeId: string;
      waypointId: string;
    }
  ) => void;
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

  const fractionalPosition = getFractionalPositionFromTime({
    t_0,
    time,
  });

  const topOffset = fractionalPosition * document.body.clientHeight;
  const left = `${appWidth + 10}px`;
  return (
    <ParentView style={{ top: topOffset, left }}>
      <WaypointView>
        <Marker />
        <MarkerText>{text}</MarkerText>
        <MenuButton onClick={() => toggleMenuOpen(currentVal => !currentVal)}>
          <Icon
            type={IconTypes.HorizontalEllipsis}
            style={{ color: "white", width: 15 }}
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
        />
      )}
    </ParentView>
  );
};