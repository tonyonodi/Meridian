// tslint:disable:jsx-no-lambda
import * as React from "react";
import styled from "styled-components";

import Icon from "src/Icon";
import getFractionalPositionFromTime from "../lib/getFractionalPositionFromTime";

const { useState } = React;

const MenuView = styled.div`
  position: absolute;
  right: 0;
  background: white;
  margin-top: 4px;
  border-radius: 5px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.15);
`;

const MenuItem = styled.div`
  cursor: default;
  width: 140px;
  margin-top: 2px;
  padding: 5px 10px;
  &:hover {
    background: lightgrey;
  }
`;

interface IMenu {
  waypointId: string;
  rangeId: string;
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
}

const Menu = ({ waypointId, rangeId, deleteWaypoint, deleteRange }: IMenu) => {
  return (
    <MenuView>
      <MenuItem
        onClick={() =>
          deleteWaypoint({
            rangeId,
            waypointId,
          })
        }
      >
        Delete Waypoint
      </MenuItem>
      <MenuItem>Add Waypoint</MenuItem>
      <MenuItem onClick={() => deleteRange(rangeId)}>Delete Range</MenuItem>
    </MenuView>
  );
};

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
        <div>{text}</div>
        <MenuButton onClick={() => toggleMenuOpen(currentVal => !currentVal)}>
          <Icon
            type="horizontalEllipsis"
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
        />
      )}
    </ParentView>
  );
};
