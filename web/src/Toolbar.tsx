// tslint:disable:no-console
import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import styled from "styled-components";
import Icon, { IconTypes } from "./Icon";

const ParentView = styled.div`
  box-sizing: border-box;
  right: 0;
  bottom: 40px;
  color: white;
  width: 60px;
  padding: 10px;
  z-index: 100;
`;

const Button = styled.button`
  border: none;
  background: none;
  padding: 0;
  width: 100%;
  color: white;
  margin-top: 20px;
  &:first-child {
    margin-top: 0;
  }
  &:focus {
    outline: 0;
  }
  svg {
    /* Removed because it causes artefacting in iOS */
    /* filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.3)); */
  }
`;

const DatePickerContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 140px;
`;

interface IToolbarProps {
  clockPosition: number | null;
  timeCursor: number;
  updateTime: (
    { activateClockMode, time }: { activateClockMode: boolean; time: number }
  ) => void;
  addWaypointDraft: (rangeId: string) => void;
}

interface IToolbarState {
  date: any;
  showDatePicker: boolean;
}

export default class Toolbar extends React.Component<
  IToolbarProps,
  IToolbarState
> {
  public state = {
    date: moment(),
    showDatePicker: false,
  };

  public activateClockMode = () => {
    const currentTime = new Date().getTime();

    this.props.updateTime({
      activateClockMode: true,
      time: currentTime,
    });
  };

  public setDate = (date: any) => {
    this.props.updateTime({
      activateClockMode: false,
      time: date.valueOf(),
    });
    this.setState({ showDatePicker: false });
  };

  public toggleDatePicker = () => {
    this.setState(({ showDatePicker }) => {
      return { showDatePicker: !showDatePicker };
    });
  };

  public handleAddRange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.props.addWaypointDraft(Math.random() + "");
  };

  public render() {
    return (
      <ParentView className="toolbar">
        <Button onClick={this.activateClockMode}>
          <Icon
            type={IconTypes.Clock}
            style={{
              opacity: this.props.clockPosition !== null ? 0.25 : 1,
            }}
          />
        </Button>
        <Button onClick={this.toggleDatePicker}>
          <Icon type={IconTypes.Calendar} />
        </Button>
        {this.state.showDatePicker && (
          <DatePickerContainer>
            <DatePicker
              inline={true}
              selected={moment(this.props.timeCursor)}
              onChange={this.setDate}
            />
          </DatePickerContainer>
        )}
        <Button onClick={this.handleAddRange}>
          <Icon type={IconTypes.Aeroplane} />
        </Button>
      </ParentView>
    );
  }
}
