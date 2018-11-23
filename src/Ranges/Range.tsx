// tslint:disable:no-console
import * as _ from "lodash";
import * as React from "react";

import { IDraftWaypoint, IRangeWaypoint } from "../IRange";
import RangeTimeline from "./RangeTimeline";
import Waypoint from "./WayPoint";

interface IRangeComponent {
  appWidth: number;
  draftWaypoint: IDraftWaypoint | null;
  id: string;
  waypoints: IRangeWaypoint[];
  t_0: number;
  timeCursor: number;
}

function isDraftWaypoint(
  waypoint: IDraftWaypoint | IRangeWaypoint
): waypoint is IDraftWaypoint {
  console.log(waypoint);
  return (waypoint as IDraftWaypoint).prevTime !== undefined;
}

export default ({
  draftWaypoint,
  waypoints,
  t_0,
  appWidth,
  timeCursor,
}: IRangeComponent) => {
  const allWaypoints =
    draftWaypoint === null ? waypoints : [...waypoints, draftWaypoint];
  const sortedWaypoints = _.sortBy(allWaypoints, ["time"]);

  return (
    <React.Fragment>
      {sortedWaypoints.reduce((acc, currentValue, index, waypointsArray) => {
        const currentWaypoint = isDraftWaypoint(currentValue)
          ? { text: currentValue.text || "", time: timeCursor }
          : currentValue;

        const prevValue = waypointsArray[index - 1];
        let prevWaypoint;
        if (prevValue) {
          prevWaypoint = isDraftWaypoint(prevValue)
            ? { text: prevValue.text || "", time: timeCursor }
            : prevValue;
        } else {
          prevWaypoint = undefined;
        }

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
