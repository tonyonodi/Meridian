// tslint:disable:no-console
// tslint:disable:jsx-no-lambda
import * as React from "react";
import styled from "styled-components";

const { useEffect, useRef } = React;

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
  addWaypointDraft: (rangeId: string) => void;
  closeMenu: () => void;
}

export default ({
  waypointId,
  rangeId,
  deleteWaypoint,
  deleteRange,
  addWaypointDraft,
  closeMenu
}: IMenu) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const clickedElement = event.target as Node;
      const containsElement =
        parentElement &&
        (parentElement as React.MutableRefObject<
          HTMLDivElement
        >).current.contains(clickedElement);

      if (
        clickedElement instanceof Element &&
        clickedElement !== parentElement.current &&
        parentElement.current !== null &&
        !containsElement
      ) {
        closeMenu();
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  });

  const parentElement: React.MutableRefObject<HTMLDivElement | null> = useRef(
    null
  );

  return (
    <MenuView innerRef={parentElement}>
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
      <MenuItem onClick={() => addWaypointDraft(rangeId)}>
        Add Waypoint
      </MenuItem>
      <MenuItem onClick={() => deleteRange(rangeId)}>Delete Range</MenuItem>
    </MenuView>
  );
};
