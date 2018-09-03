// tslint:disable:no-console
import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import styled from "styled-components";
import Icon from "./Icon";

const ParentView = styled.div`
  position: fixed;
  box-sizing: border-box;
  right: 0;
  top: 0;
  color: white;
  width: 60px;
  padding: 10px;
  height: 98vh;
`;

const Button = styled.button`
  border: none;
  background: none;
  padding: 0;
  width: 100%;
  color: white;
  margin-bottom: 20px;
  &:focus {
    outline: 0;
  }
`;

const DatePickerContainer = styled.div`
  position: absolute;
  right: 10px;
`;

interface IToolbarProps {
  clockPosition: number | null;
  timeCursor: number;
  updateTime: (
    { activateClockMode, time }: { activateClockMode: boolean; time: number }
  ) => void;
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

  public selectDay = () => {
    console.log("select day");
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

  public render() {
    return (
      <ParentView className="toolbar">
        <Button onClick={this.activateClockMode}>
          <Icon
            type="clock"
            style={{
              opacity: this.props.clockPosition !== null ? 1 : 0.25,
            }}
          />
        </Button>
        <Button onClick={this.toggleDatePicker}>
          <Icon type="calendar" />
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
      </ParentView>
    );
  }
}
