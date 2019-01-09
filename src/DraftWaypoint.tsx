// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import {
  DEFAULT_UI_BUTTON_COLOR,
  DRAFT_WAYPOINT_ELEMENT_MARGIN_LEFT,
  DRAFT_WAYPOINT_ELEMENT_TOTAL_WIDTH,
  DRAFT_WAYPOINT_ELEMENT_WIDTH,
} from "./config";

const ContainerDiv = styled.div`
  background: "red";
  position: "relative";
  width: ${DRAFT_WAYPOINT_ELEMENT_TOTAL_WIDTH};
`;

const ParentView = styled.div`
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  width: ${DRAFT_WAYPOINT_ELEMENT_WIDTH}px;
  background: white;
  padding: 7px;
  border-radius: 5px;
  z-index: 30;
  margin-left: ${DRAFT_WAYPOINT_ELEMENT_MARGIN_LEFT}px;
  margin-right: 20px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.15);
  &:after {
    right: 100%;
    top: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(255, 255, 255, 0);
    border-right-color: #ffffff;
    border-width: 7px;
    margin-top: -7px;
  }
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
        this.props.updateTime({ time: timeCursorOnBlur });
      }
    };

    const resizeListener = () => {
      window.addEventListener("scroll", scrollListener);
    };
    window.addEventListener("resize", resizeListener);

    window.setTimeout(() => {
      window.removeEventListener("resize", resizeListener);
      window.removeEventListener("scroll", scrollListener);
    }, 2000);
  };

  public render() {
    const { appWidth } = this.props;
    const addWaypointText =
      ["From here", "To here"][this.props.waypointNumber] || "...and here";

    return (
      <ContainerDiv>
        <ParentView
          style={{ left: appWidth - 100 }}
          innerRef={this.parentElementRef}
        >
          <Header>Measure duration</Header>
          <ButtonContainer>
            <Button onClick={this.handleSubmit}>{addWaypointText}</Button>
            <Button onClick={this.handleCancel}>Cancel</Button>
          </ButtonContainer>
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
        </ParentView>
      </ContainerDiv>
    );
  }
}
