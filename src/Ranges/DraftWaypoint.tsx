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
    {
      rangeId,
      rangeText,
    }: {
      rangeId: string;
      rangeText: string;
    }
  ) => void;
  cancelWaypointDraft: (rangeId: string) => void;
  appWidth: number;
  rangeId: string;
}

export default class DraftWaypointComponent extends React.Component<
  IDraftWaypointComponent
> {
  public state = { draftName: "" };

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
      rangeId: this.props.rangeId,
      rangeText: draftName,
    });
  };

  public handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    this.props.cancelWaypointDraft(this.props.rangeId)
  }

  public render() {
    const { appWidth } = this.props;
    return (
      <ParentView style={{ left: appWidth + 30 }}>
        <form onSubmit={this.handleSubmit}>
          <WaypointNameInput
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
