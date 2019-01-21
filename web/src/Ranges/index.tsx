import * as React from "react";
import { IRange } from "./IRange";
import Range from "./Range";

interface IRangesComponent {
  appWidth: number;
  ranges: IRange[];
  t_0: number;
  addWaypointDraft: (rangeId: string) => void;
  deleteWaypoint: (
    {
      rangeId,
      waypointId,
    }: {
      rangeId: string;
      waypointId: string;
    }
  ) => void;
  deleteRange: (id: string) => void;
  cancelWaypointDraft: (rangeId: string) => void;
}

export default ({
  appWidth,
  ranges,
  t_0,
  addWaypointDraft,
  deleteWaypoint,
  deleteRange,
  cancelWaypointDraft,
}: IRangesComponent) => {
  return (
    <React.Fragment>
      {ranges.map(range => {
        return (
          <Range
            addWaypointDraft={addWaypointDraft}
            deleteWaypoint={deleteWaypoint}
            deleteRange={deleteRange}
            cancelWaypointDraft={cancelWaypointDraft}
            key={range.id}
            appWidth={appWidth}
            t_0={t_0}
            {...range}
          />
        );
      })}
    </React.Fragment>
  );
};
