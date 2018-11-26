// tslint:disable:no-console
import * as _ from "lodash";
import * as React from "react";

import { IRangeWaypoint } from "../IRange";
import RangeTimeline from "./RangeTimeline";
import Waypoint from "./WayPoint";

interface IRangeComponent {
  appWidth: number;
  id: string;
  waypoints: IRangeWaypoint[];
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
  deleteRange: (rangeId: string) => void;
  cancelWaypointDraft: (rangeId: string) => void;
}

export default ({
  addWaypoint,
  cancelWaypointDraft,
  id,
  waypoints,
  t_0,
  appWidth,
  deleteWaypoint,
  deleteRange
}: IRangeComponent) => {
  const sortedWaypoints = _.sortBy(waypoints, ["time"]);

  return (
    <React.Fragment>
      {sortedWaypoints.reduce((acc, currentWaypoint, index, waypointsArray) => {
        const prevWaypoint = waypointsArray[index - 1];

        return [
          ...acc,
          <Waypoint
            key={`waypoint_${currentWaypoint.id}`}
            id={currentWaypoint.id}
            appWidth={appWidth}
            rangeId={id}
            time={currentWaypoint.time}
            text={currentWaypoint.text}
            t_0={t_0}
            deleteWaypoint={deleteWaypoint}
            deleteRange={deleteRange}
          />,
          prevWaypoint && (
            <RangeTimeline
              key={`range_${prevWaypoint.time}_${currentWaypoint.time}`}
              appWidth={appWidth}
              from={prevWaypoint.time}
              to={currentWaypoint.time}
              t_0={t_0}
            />
          ),
        ];
      }, [])}
    </React.Fragment>
  );
};
