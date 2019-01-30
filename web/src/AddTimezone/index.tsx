// tslint:disable:no-console
import * as React from "react";
import ITimezone from "../ITimezone";
import Modal from "../Modal";
import AddTimeZone from "./AddTimeZone";

interface IAddTimeZoneButtonProps {
  addTimezone: (timezone: ITimezone) => void;
  color: [number, number, number];
  show: boolean;
  timeCursor: number;
  timezones: ITimezone[];
  toggle: (state?: boolean) => void;
  updateTime: (
    {
      activateClockMode,
      time,
    }: {
      activateClockMode?: boolean;
      time: number;
    }
  ) => void;
}

export default class AddTimeZoneButton extends React.Component<
  IAddTimeZoneButtonProps
> {
  public componentDidMount() {
    window.addEventListener("keypress", this.handleKeypress);
  }

  public componentWillUnmount() {
    window.removeEventListener("keypress", this.handleKeypress);
  }

  public handleKeypress = (event: any) => {
    if (document.activeElement !== window.document.body) {
      return;
    }

    switch (event.key) {
      case "n":
        event.preventDefault();
        this.props.toggle(true);
        break;
    }
  };

  public render() {
    const { addTimezone, color, show, toggle } = this.props;

    return (
      show && (
        <Modal>
          <AddTimeZone
            addTimezone={addTimezone}
            bgColor={color}
            close={toggle}
            timeCursor={this.props.timeCursor}
            timezones={this.props.timezones}
            updateTime={this.props.updateTime}
          />
        </Modal>
      )
    );
  }
}
