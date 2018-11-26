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
  public state = { draftName: "" };

  public waypointNameInput: HTMLInputElement;

  public waypointNameInputRef = (ref: HTMLInputElement) => {
    this.waypointNameInput = ref;
  };

  public componentDidMount() {
    this.waypointNameInput.focus();
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

  public handleBlur = () => {
    console.log("blurring");
  };

  public render() {
    const { appWidth } = this.props;
    return (
      <ParentView style={{ left: appWidth + 30 }}>
        <form onSubmit={this.handleSubmit}>
          <WaypointNameInput
            innerRef={this.waypointNameInputRef}
            type="text"
            placeholder="Untitled waypoint"
            value={this.state.draftName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          />
          <Button onClick={this.handleSubmit}>Add waypoint here</Button>
          <Button onClick={this.handleCancel}>Cancel</Button>
        </form>
      </ParentView>
    );
  }
}
