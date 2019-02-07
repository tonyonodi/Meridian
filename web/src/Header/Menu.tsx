import * as React from "react";
import styled, { keyframes } from "styled-components";
import * as luxon from "luxon";
import Modal from "../Modal";
import Icon, { IconTypes } from "src/Icon";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { MAIN_BACKGROUND_COLOR, DARK_TEXT, MERIDIAN_API_URL } from "src/config";
import { isCordova, isSafari } from "src/lib/browserInfo";

const { useState } = React;
const { DateTime } = luxon;

const MENU_WIDTH = 285;
const ANIMATION_TIME = 0.25;

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
  height: 100%;
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
  height: 100%;
  width: ${MENU_WIDTH}px;
  transition: transform ${ANIMATION_TIME}s;
  color: rgb(${DARK_TEXT.join(",")});
  overflow-y: auto;
`;

const MenuViewInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 750px;
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
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  font-weight: 600;
  letter-spacing: 3px;
`;

const Logo = styled.img`
  width: 30px;
  margin-right: 20px;
`;

const MenuList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 10px 0;
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
  font-weight: 500;
  &:focus {
    outline: none;
    background: #e8e8e8;
  }
`;

const ButtonLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: none;
  border: none;
  padding: 20px;
  width: 100%;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 500;
  color: inherit;
  text-decoration: none;
  &:focus {
    outline: none;
    background: #e8e8e8;
  }
`;

const SubText = styled.div`
  position: absolute;
  margin-top: ${isSafari ? 3: 17}px;
  margin-left: ${isSafari ? 0: 35}px;
  font-size: 0.65rem;
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
  padding-bottom: 25px;
  font-size: 0.9rem;
  a {
    color: inherit;
  }
`;

interface IMenuProps {
  active: boolean;
  timeCursor: number;
  closeModal: () => void;
  updateTime: ({
    activateClockMode,
    time,
  }: {
    activateClockMode: boolean;
    time: number;
  }) => void;
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
      <DayPicker
        onDayClick={handleDayClick}
        selectedDays={selectedDate}
        showOutsideDays={true}
      />
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
  if (active) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "visible";
  }

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
          <MenuViewInner>
            <MenuHeader>
              <LogoContainer>
                <Logo src="./meridian_logo.svg" alt="Meridian logo" />
                Meridian
              </LogoContainer>
            </MenuHeader>
            <MenuList>
              <MenuItem>
                <Button onClick={activateClockMode}>
                  <Icon type={IconTypes.Clock} style={iconStyle} /> Reset time
                  (clock mode)
                </Button>
              </MenuItem>
              <MenuItem>
                <Button onClick={handleAddTimezone}>
                  <Icon type={IconTypes.Plus} style={iconStyle} /> Add time zone
                </Button>
              </MenuItem>
              <MenuItem>
                <Button onClick={handleAddDuration}>
                  <Icon type={IconTypes.Aeroplane} style={iconStyle} />
                  Measure a duration
                  <SubText>(time between two or more events)</SubText>
                </Button>
              </MenuItem>
              {!isCordova && (
                <MenuItem>
                  <ButtonLink
                    href={`${MERIDIAN_API_URL}/android-app`}
                    target="_blank"
                  >
                    <Icon type={IconTypes.GooglePlay} style={iconStyle} />
                    Get the Android app
                  </ButtonLink>
                </MenuItem>
              )}
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
          </MenuViewInner>
        </MenuView>
      </ModalMask>
    </Modal>
  );
};
