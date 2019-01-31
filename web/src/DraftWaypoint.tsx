// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import { DEFAULT_UI_BUTTON_COLOR } from "./config";

const ContainerDiv = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10000;
  width: 100vw;
  padding: 10px;
`;

const ParentView = styled.div`
  position: sticky;
  background: white;
  padding: 7px;
  border-radius: 5px;
  z-index: 30;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 860px;
`;

const Header = styled.h3`
  margin: 0 0 10px 0;
`;

const WaypointNameInput = styled.input`
  padding: 5px;
  width: 100%;
  font-size: 1rem;
  box-sizing: border-box;
  border: none;
  border-bottom: solid 2px lightgrey;
  &:focus {
    outline: none;
    border-bottom: solid 2px ${DEFAULT_UI_BUTTON_COLOR};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 6px 10px;
  background: none;
  border: none;
  border-radius: 5px;
  width: calc(50% - 3px);
  background: ${DEFAULT_UI_BUTTON_COLOR};
  color: white;
  font-weight: bold;
  font-size: 0.75rem;
  &:focus {
    outline: none;
    filter: brightness(85%);
  }
`;

interface IDraftWaypointComponent {
  addWaypoint: (
    { rangeId, rangeText }: { rangeId: string; rangeText: string }
  ) => void;
  cancelWaypointDraft: () => void;
  appWidth: number;
  draftWaypoint: { rangeId: string };
  timeCursor: number;
  updateTime: (
    {
      activateClockMode,
      time,
    }: {
      activateClockMode?: boolean;
      time: number;
    }
  ) => void;
  waypointNumber: number;
}

export default class DraftWaypointComponent extends React.Component<
  IDraftWaypointComponent
> {
  public parentElement: HTMLElement;

  public state = { draftName: "" };

  public waypointNameInput: HTMLInputElement;

  public waypointNameInputRef = (ref: HTMLInputElement) => {
    this.waypointNameInput = ref;
  };

  public componentDidMount() {
    this.waypointNameInput.focus();
    window.addEventListener("keydown", this.handleKeypress);
  }

  public componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeypress);
  }

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    this.setState({ draftName: event.target.value });
  };

  public handleSubmit = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const { draftName } = this.state;
    this.props.addWaypoint({
      rangeId: this.props.draftWaypoint.rangeId,
      rangeText: draftName,
    });

    this.setState({ draftName: "" });
  };

  public handleCancel = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FocusEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    this.props.cancelWaypointDraft();
  };

  public handleKeypress = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        this.props.cancelWaypointDraft();
        break;
    }
  };

  public parentElementRef = (element: HTMLElement) => {
    this.parentElement = element;
  };

  public handleFocus = () => {
    const timeCursorOnFocus = this.props.timeCursor;
    let scrollCount = 0;
    let prevPageYOffset = window.pageYOffset;

    const scrollListener = () => {
      // ignore horizontal scrolling
      if (window.pageYOffset === prevPageYOffset) {
        return;
      }
      prevPageYOffset = window.pageYOffset;

      scrollCount++;
      if (scrollCount < 10) {
        this.props.updateTime({ time: timeCursorOnFocus });
      } else {
        window.removeEventListener("scroll", scrollListener);
      }
    };

    const resizeListener = () => {
      // if a resize happens within 2000ms we assume mobile keyboard has appeared
      window.addEventListener("scroll", scrollListener);
    };
    window.addEventListener("resize", resizeListener);

    window.setTimeout(() => {
      window.removeEventListener("scroll", scrollListener);
      window.removeEventListener("resize", resizeListener);
    }, 2000);
  };

  public handleBlur = () => {
    const timeCursorOnBlur = this.props.timeCursor;

    const resizeListener = () => {
      this.props.updateTime({ time: timeCursorOnBlur });
      window.removeEventListener("resize", resizeListener);
    };
    window.addEventListener("resize", resizeListener);

    window.setTimeout(() => {
      window.removeEventListener("resize", resizeListener);
    }, 2000);
  };

  public render() {
    const isFirstWaypoint = this.props.waypointNumber === 0;

    return (
      <ContainerDiv>
        <ParentView innerRef={this.parentElementRef}>
          <Header>
            Measure duration {isFirstWaypoint ? "from" : "to"} current time
          </Header>
          <p>
            Change current time by scrolling or tapping the time indicators in
            the middle of the screen and entering a time.
          </p>
          <form onSubmit={this.handleSubmit}>
            <WaypointNameInput
              innerRef={this.waypointNameInputRef}
              type="text"
              placeholder="Waypoint name (optional)"
              value={this.state.draftName}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </form>
          <ButtonContainer>
            <Button onClick={this.handleSubmit}>Place waypoint</Button>
            <Button onClick={this.handleCancel}>Done</Button>
          </ButtonContainer>
        </ParentView>
      </ContainerDiv>
    );
  }
}
