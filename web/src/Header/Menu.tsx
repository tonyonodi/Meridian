import * as React from "react";
import styled, { keyframes } from "styled-components";
import * as luxon from "luxon";
import Modal from "../Modal";
import Icon, { IconTypes } from "src/Icon";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { MAIN_BACKGROUND_COLOR, DARK_TEXT } from "src/config";

const { useState } = React;
const { DateTime } = luxon;

const MENU_WIDTH = 285;
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
  display: flex;
  flex-direction: column;
  transform: translateX(
    ${({ active }) => {
      return active ? 0 : -MENU_WIDTH;
    }}px
  );
  box-sizing: border-box;
  background: white;
  height: 100vh;
  width: ${MENU_WIDTH}px;
  transition: transform ${ANIMATION_TIME}s;
  color: rgb(${DARK_TEXT.join(",")});
`;

const MenuHeader = styled.div`
  margin-top: 0;
  text-align: center;
  font-size: 1rem;
  padding: 20px;
  background: rgba(25, 100, 126, 1);
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
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
  font-size: 0.8rem;
  font-family: "Montserrat", sans-serif;
  &:focus {
    outline: none;
    background: #e8e8e8;
  }
`;

const iconStyle = { width: 15, marginRight: 20 };

const JumpToDate = styled.button`
  background: rgb(${MAIN_BACKGROUND_COLOR.join(",")});
  color: white;
  border: none;
  padding: 10px;
  width: 240px;
  border-radius: 5px;
  margin-left: 20px;
  font-weight: bold;
  font-size: 0.8rem;
  &:focus {
    outline: none;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
  }
`;

const Footer = styled.div`
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 10px;
  font-size: 0.9rem;
  a {
    color: inherit;
  }
`;

interface IMenuProps {
  active: boolean;
  timeCursor: number;
  closeModal: () => void;
  updateTime: (
    { activateClockMode, time }: { activateClockMode: boolean; time: number }
  ) => void;
  addWaypointDraft: (rangeId: string) => void;
  toggleAddTimezone: (state?: boolean) => void;
}

interface ICalendar {
  timeCursor: number;
  handleJumpToDate: (selectedDate: Date) => void;
}
const Calendar = ({ timeCursor, handleJumpToDate }: ICalendar) => {
  const [selectedDate, setSelectedDate] = useState(new Date(timeCursor));

  const handleDayClick = (day: any) => {
    setSelectedDate(day);
  };

  return (
    <React.Fragment>
      <DayPicker onDayClick={handleDayClick} selectedDays={selectedDate} />
      <JumpToDate onClick={() => handleJumpToDate(selectedDate)}>
        Jump to Date
      </JumpToDate>
    </React.Fragment>
  );
};

export default ({
  active,
  closeModal,
  updateTime,
  addWaypointDraft,
  toggleAddTimezone,
  timeCursor,
}: IMenuProps) => {
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
  };

  const handleAddTimezone = () => {
    toggleAddTimezone(true);
    closeModal();
  };

  const handleJumpToDate = (selectedDate: Date) => {
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    const newDate = DateTime.fromMillis(timeCursor)
      .set({ day, month: month + 1, year })
      .toMillis();

    updateTime({
      activateClockMode: false,
      time: newDate,
    });
    closeModal();
  };

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
              <Button onClick={activateClockMode}>
                <Icon type={IconTypes.Clock} style={iconStyle} /> Reset time
                (Clock Mode)
              </Button>
            </MenuItem>
            <MenuItem>
              <Button onClick={handleAddTimezone}>
                <Icon type={IconTypes.Plus} style={iconStyle} /> Add Timezone
              </Button>
            </MenuItem>
            <MenuItem>
              <Button onClick={handleAddDuration}>
                <Icon type={IconTypes.Aeroplane} style={iconStyle} />
                Measure Duration
              </Button>
            </MenuItem>
          </MenuList>
          {/* Remount calendar whenever menu activated to update the date. */}
          {active && (
            <Calendar
              timeCursor={timeCursor}
              handleJumpToDate={handleJumpToDate}
            />
          )}
          <Footer>
            <span>
              Made by{" "}
              <a href="https://twitter.com/tonyonodi" target="_blank">
                Tony Onodi
              </a>
            </span>
          </Footer>
        </MenuView>
      </ModalMask>
    </Modal>
  );
};
