import * as React from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Icon, { IconTypes } from "./Icon";
import { HEADER_HEIGHT, MERIDIAN_API_URL } from "./config";

const { useState } = React;

const ParentView = styled.a`
  position: fixed;
  right: 10px;
  top: ${HEADER_HEIGHT + 10}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 890;
  padding: 9px 14px;
  border-radius: 30px;
  background: #3a3a3a;
  color: white;
  text-decoration: none;
  svg {
    width: 20px;
    margin-right: 10px;
  }
`;

const CloseButton = styled.button`
  font-size: 1rem;
  color: white;
  background: none;
  border: none;
`;

export default () => {
  const [open, setOpen] = useState(true);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(false);
  };

  const isAndroid = true;
  const icontype = isAndroid ? IconTypes.GooglePlay : IconTypes.AppStore;
  const appType = isAndroid ? "Android" : "iOS";
  const appRoute = isAndroid ? "android-app" : "ios-app";

  return (
    <Modal>
      <ParentView href={`${MERIDIAN_API_URL}/${appRoute}`}>
        <Icon type={icontype} />
        {open && (
          <React.Fragment>
            Get {appType} app
            <CloseButton onClick={handleClose}>✕</CloseButton>
          </React.Fragment>
        )}
      </ParentView>
    </Modal>
  );
};
