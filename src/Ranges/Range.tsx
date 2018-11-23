// tslint:disable:no-console
import * as _ from "lodash";
import * as React from "react";

import { IDraftWaypoint, IRangeWaypoint } from "../IRange";
import DraftWaypoint from "./DraftWaypoint";
import RangeTimeline from "./RangeTimeline";
import Waypoint from "./WayPoint";

interface IRangeComponent {
  appWidth: number;
  draftWaypoint: IDraftWaypoint | null;
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
}

export default ({
  addWaypoint,
  draftWaypoint,
  id,
  waypoints,
  t_0,
  appWidth,
}: IRangeComponent) => {
  const sortedWaypoints = _.sortBy(waypoints, ["time"]);

  return (
    <React.Fragment>
      {draftWaypoint && (
        <DraftWaypoint
          addWaypoint={addWaypoint}
          appWidth={appWidth}
          rangeId={id}
        />
      )}
      {sortedWaypoints.reduce((acc, currentWaypoint, index, waypointsArray) => {
        const prevWaypoint = waypointsArray[index - 1];

        return [
          ...acc,
          <Waypoint
            key={`waypoint_${currentWaypoint.time}`}
            appWidth={appWidth}
            time={currentWaypoint.time}
            text={currentWaypoint.text}
            t_0={t_0}
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
