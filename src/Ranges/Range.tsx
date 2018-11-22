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
}

export default class RangeComponent extends React.Component<IRangeComponent> {
  public render() {
    const { waypoints, t_0 } = this.props;
    const sortedWaypoints = _.sortBy(waypoints, ["time"]);

    const { appWidth } = this.props;

    return (
      <React.Fragment>
        {sortedWaypoints.reduce(
          (acc, currentWaypoint, index, waypointsArray) => {
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
          },
          []
        )}
      </React.Fragment>
    );
  }
}
