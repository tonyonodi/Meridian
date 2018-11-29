// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";

const ParentView = styled.div`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 7px;
  border-radius: 5px;
  z-index: 30;
`;

const WaypointNameInput = styled.input``;

const Button = styled.button``;

interface IDraftWaypointComponent {
  addWaypoint: (
    { rangeId, rangeText }: { rangeId: string; rangeText: string }
  ) => void;
  cancelWaypointDraft: () => void;
  appWidth: number;
  draftWaypoint: { rangeId: string };
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
    window.addEventListener("mousedown", this.handleMousedown);
    window.addEventListener("keydown", this.handleKeypress);
  }

  public componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleMousedown);
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

  public handleMousedown = (event: Event) => {
    const clickedElement = event.target;

    if (
      clickedElement instanceof Element &&
      clickedElement !== this.parentElement &&
      !this.parentElement.contains(clickedElement)
    ) {
      this.props.cancelWaypointDraft();
    }
  };

  public parentElementRef = (element: HTMLElement) => {
    this.parentElement = element;
  };

  public render() {
    const { appWidth } = this.props;
    return (
      <ParentView
        style={{ left: appWidth + 30 }}
        innerRef={this.parentElementRef}
      >
        <form onSubmit={this.handleSubmit}>
          <WaypointNameInput
            innerRef={this.waypointNameInputRef}
            type="text"
            placeholder="Untitled waypoint"
            value={this.state.draftName}
            onChange={this.handleChange}
          />
          <Button onClick={this.handleSubmit}>Add waypoint here</Button>
          <Button onClick={this.handleCancel}>Cancel</Button>
        </form>
      </ParentView>
    );
  }
}
