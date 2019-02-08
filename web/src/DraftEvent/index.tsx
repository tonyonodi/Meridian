import * as React from "react";
import styled from "styled-components";
import { DEFAULT_UI_BUTTON_COLOR } from "../config";
import Icon, { IconTypes } from "src/Icon";
import PlaceholderEvent from "./PlaceholderEvent";
import EditEventName from "./EditEventName";

const ContainerDiv = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  padding: 10px;
`;

const ParentView = styled.div`
  position: sticky;
  background: white;
  padding: 17px;
  border-radius: 5px;
  z-index: 30;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 860px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 10px;
  right: 10px;
  &:focus {
    outline: none;
  }
  &:focus svg {
    filter: drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.3));
    transform: translateY(-4px);
    transition: transform 1s;
  }
`;

const Header = styled.h3`
  margin: 0 0 10px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  width: 100%;
  background: ${DEFAULT_UI_BUTTON_COLOR};
  color: white;
  font-weight: bold;
  font-size: 1rem;
  &:focus {
    outline: none;
    filter: brightness(85%);
  }
`;

interface IDraftWaypointComponent {
  addWaypoint: ({
    rangeId,
    rangeText,
    time,
  }: {
    rangeId: string;
    rangeText: string;
    time: number;
  }) => void;
  cancelWaypointDraft: () => void;
  draftWaypoint: { rangeId: string };
  timeCursor: number;
  updateTime: ({
    activateClockMode,
    time,
  }: {
    activateClockMode?: boolean;
    time: number;
  }) => void;
  waypointNumber: number;
}

export default class DraftWaypointComponent extends React.Component<
  IDraftWaypointComponent
> {
  public state = { draftName: "", editingName: false };

  public componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
  }

  public componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeypress);
  }

  public handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.setState({ editingName: true });
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

  public render() {
    return (
      <React.Fragment>
        <PlaceholderEvent
          draftName={this.state.draftName}
          updateDraftName={draftName => this.setState({ draftName })}
        />
        <ContainerDiv>
          <ParentView>
            <CloseButton onClick={this.handleCancel}>
              <Icon type={IconTypes.Times} style={{ width: 20 }} />
            </CloseButton>
            <Header>Add Event</Header>
            <p>
              Change selected time by scrolling, or tapping the current time in
              a time zone and entering a new time.
            </p>
            <ButtonContainer>
              <Button onClick={this.handleSubmit}>
                Add event at selected time
              </Button>
            </ButtonContainer>
          </ParentView>
        </ContainerDiv>
        {this.state.editingName && (
          <EditEventName
            initialName=""
            time={this.props.timeCursor}
            close={() => this.setState({ editingName: false })}
            updateDraftName={(draftName, time) => {
              this.setState({
                editingName: false,
              });

              setTimeout(() => {
                this.props.updateTime({ time: time + 3600 * 1000 });
              }, 250);

              this.props.addWaypoint({
                rangeId: this.props.draftWaypoint.rangeId,
                rangeText: draftName,
                time,
              });
            }}
          />
        )}
      </React.Fragment>
    );
  }
}
