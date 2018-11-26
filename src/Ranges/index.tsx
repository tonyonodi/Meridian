import * as React from "react";
import { IRange } from "./IRange";
import Range from "./Range";

interface IRangesComponent {
  appWidth: number;
  ranges: IRange[];
  t_0: number;
  addWaypoint: (
    {
      rangeId,
      rangeText,
    }: {
      rangeId: string;
      rangeText: string;
    }
  ) => void;
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
  addWaypoint,
  deleteWaypoint,
  deleteRange,
  cancelWaypointDraft,
}: IRangesComponent) => {
  return (
    <React.Fragment>
      {ranges.map(range => {
        return (
          <Range
            addWaypoint={addWaypoint}
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
