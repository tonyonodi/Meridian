import * as React from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Icon, { IconTypes } from "./Icon";
import { HEADER_HEIGHT, MERIDIAN_API_URL } from "./config";
import { isiOS } from "./lib/browserInfo";

const { useState } = React;

const ParentView = styled.div`
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

const Link = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  text-decoration: none;
`;

const CloseButton = styled.button`
  font-size: 1rem;
  color: white;
  background: none;
  border: none;
  &:focus {
    outline: none;
    font-weight: bold;
  }
`;

export default () => {
  const [open, setOpen] = useState(true);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(false);
  };

  const icontype = isiOS ? IconTypes.AppStore : IconTypes.GooglePlay;
  const appType = isiOS ? "iOS" : "Android";
  const appRoute = isiOS ? "ios-app" : "android-app";

  return (
    <Modal>
      {open && (
        <ParentView>
          <Link href={`${MERIDIAN_API_URL}/${appRoute}`}>
            <Icon type={icontype} />
            Get the {appType} app
          </Link>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </ParentView>
      )}
    </Modal>
  );
};
