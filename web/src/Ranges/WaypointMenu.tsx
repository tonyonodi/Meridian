// tslint:disable:no-console
// tslint:disable:jsx-no-lambda
import * as React from "react";
import styled from "styled-components";
import Modal from "src/Modal";

const { useEffect, useRef } = React;

const MenuView = styled.div`
  position: absolute;
  width: 150px;
  background: white;
  margin-top: 11px;
  border-radius: 5px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.15);
  font-size: 0.9rem;
  z-index: 900;
  transform: translateX(-100%);
`;

const MenuItem = styled.div`
  cursor: default;
  margin-top: 2px;
  padding: 5px 10px;
  &:hover {
    background: lightgrey;
  }
`;

interface IMenu {
  waypointId: string;
  rangeId: string;
  deleteWaypoint: ({
    rangeId,
    waypointId,
  }: {
    rangeId: string;
    waypointId: string;
  }) => void;
  deleteRange: (rangeId: string) => void;
  addWaypointDraft: (rangeId: string) => void;
  closeMenu: () => void;
  menuToggleRef: React.MutableRefObject<HTMLButtonElement | null>;
}

export default ({
  waypointId,
  rangeId,
  deleteWaypoint,
  deleteRange,
  addWaypointDraft,
  closeMenu,
  menuToggleRef,
}: IMenu) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const clickedElement = event.target as Node;
      const containsElement =
        parentElement &&
        (parentElement as React.MutableRefObject<
          HTMLDivElement
        >).current.contains(clickedElement);

      const menuToggleElement = menuToggleRef && menuToggleRef.current;
      if (menuToggleElement === (clickedElement as Element).closest("button")) {
        // If we don't exit now toggle will be fired twice.
        return;
      }

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
  const menuElementBoundingRect = (menuToggleRef as React.MutableRefObject<
    HTMLButtonElement
  >).current.getBoundingClientRect();
  console.log(menuElementBoundingRect)

  const documentRoot = (document.documentElement as HTMLElement);
  const menuViewStyle = {
    top: documentRoot.scrollTop + menuElementBoundingRect.top + 15,
    left: documentRoot.scrollLeft + menuElementBoundingRect.right,
  };

  return (
    <Modal>
      <MenuView innerRef={parentElement} style={menuViewStyle}>
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
        <MenuItem
          onClick={() => {
            addWaypointDraft(rangeId);
            closeMenu();
          }}
        >
          Add Waypoint
        </MenuItem>
        <MenuItem onClick={() => deleteRange(rangeId)}>
          Delete Duration
        </MenuItem>
      </MenuView>
    </Modal>
  );
};
