import * as React from "react";
import styled from "styled-components";
import Modal from "src/Modal";
import { Marker } from "src/Ranges/WayPoint";
import { AppWidthContext } from "../App";
import { DARK_TEXT } from "src/config";

const { useContext } = React;

const ParentView = styled.div`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface INameProps {
  hasContent: boolean;
}

const Name = styled.div<INameProps>`
  color: rgb(
    ${({ hasContent }) => (hasContent ? DARK_TEXT.join(",") : "150, 150, 150")}
  );
`;

interface IPlaceHolderEventProps {
  draftName: string;
  updateDraftName: (draftName: string) => void;
}

export default ({ draftName }: IPlaceHolderEventProps) => {
  const appWidth = useContext(AppWidthContext);

  return (
    <Modal>
      <ParentView style={{ paddingLeft: appWidth + 10 }}>
        <Marker />
        <Name hasContent={Boolean(draftName)}>
          {draftName || "New event"}
        </Name>
      </ParentView>
    </Modal>
  );
};
