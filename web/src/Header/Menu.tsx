import * as React from "react";
import styled, { keyframes } from "styled-components";
import Modal from "../Modal";
import Icon, { IconTypes } from "src/Icon";

const MENU_WIDTH = 240;
const ANIMATION_TIME = 0.25;
// const EASING = "ease-in-out";

const maskFadeIn = keyframes`
  0% {
    background: rgba(0, 0, 0, 0);
    transform: translateX(-100vw);
  }
  0.001% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(0);
    background: rgba(0, 0, 0, 0.75);
  }
`;
const maskFadeOut = keyframes`
  0% {
    transform: translateX(0);
    background: rgba(0, 0, 0, 0.75);
  }

  99.999% {
    transform: translateX(0);
    background: rgba(0, 0, 0, 0);
  }

  100% {
    transform: translateX(-100vw);
    
  }
`;

interface IModalMask {
  active: boolean;
}

const ModalMask = styled.div<IModalMask>`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  transform: translateX(-100vw);
  ${({ active }) =>
    active
      ? `animation: ${maskFadeIn} ${ANIMATION_TIME}s forwards`
      : `animation: ${maskFadeOut} ${ANIMATION_TIME}s forwards`}
`;

interface IMenuView {
  active: boolean;
}

const MenuView = styled.div<IMenuView>`
  transform: translateX(
    ${({ active }) => {
      return active ? 0 : -MENU_WIDTH;
    }}px
  );
  box-sizing: border-box;
  background: white;
  height: 100vh;
  display: inline-block;
  width: ${MENU_WIDTH}px;
  transition: transform ${ANIMATION_TIME}s;
  color: rgb(7, 26, 33);
`;

const MenuHeader = styled.div`
  margin-top: 0;
  text-align: center;
  font-size: 1rem;
  padding: 20px;
  background: rgba(25, 100, 126, 1);
  box-sizing: border-box;
  height: 100px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 40px;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
`;

const Logo = styled.img`
  width: 30px;
  margin-right: 10px;
`;

const MenuList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 20px 0;
`;

const MenuItem = styled.li``;

const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: none;
  border: none;
  padding: 20px;
  width: 100%;
  text-align: left;
  &:focus {
    outline: none;
    background: #e8e8e8;
  }
`;

const iconStyle = { width: 20, marginRight: 20 };

interface IMenuProps {
  active: boolean;
  closeModal: () => void;
  updateTime: (
    { activateClockMode, time }: { activateClockMode: boolean; time: number }
  ) => void;
  addWaypointDraft: (rangeId: string) => void;
  toggleAddTimezone: (state?: boolean) => void;
}

export default ({ active, closeModal, updateTime, addWaypointDraft, toggleAddTimezone }: IMenuProps) => {
  const activateClockMode = () => {
    const currentTime = new Date().getTime();
    updateTime({
      activateClockMode: true,
      time: currentTime,
    });
    closeModal();
  };

  const handleAddDuration = () => {
    addWaypointDraft(Math.random() + "");
    closeModal();
  }

  const handleAddTimezone = () => {
    toggleAddTimezone(true);
    closeModal();
  }

  return (
    <Modal>
      <ModalMask active={active} onClick={() => closeModal()}>
        <MenuView onClick={e => e.stopPropagation()} active={active}>
          <MenuHeader>
            <LogoContainer>
              <Logo src="/meridian_logo.svg" alt="Meridian logo" />
              Meridian
            </LogoContainer>
          </MenuHeader>
          <MenuList>
            <MenuItem>
              <Button onClick={handleAddTimezone}>
                <Icon type={IconTypes.Plus} style={iconStyle} /> Add Timezone
              </Button>
            </MenuItem>
            <MenuItem>
              <Button onClick={activateClockMode}>
                <Icon type={IconTypes.Clock} style={iconStyle} /> Clock Mode
              </Button>
            </MenuItem>
            <MenuItem>
              <Button onClick={handleAddDuration}>
                <Icon type={IconTypes.Aeroplane} style={iconStyle} />
                Measure Duration
              </Button>
            </MenuItem>
          </MenuList>
        </MenuView>
      </ModalMask>
    </Modal>
  );
};
