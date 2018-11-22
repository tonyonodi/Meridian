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
    // const { startPoint, endPoint } = waypoints.reduce(
    //   (
    //     acc: { startPoint: IRangeWaypoint; endPoint: IRangeWaypoint },
    //     waypoint: IRangeWaypoint,
    //   ) => {
    //     return {
    //       endPoint: waypoint.time > acc.endPoint.time ? waypoint : acc.endPoint,
    //       startPoint:
    //         waypoint.time < acc.startPoint.time ? waypoint : acc.startPoint,
    //     };
    //   }, {
    //     endPoint: waypoints[0],
    //     startPoint: waypoints[0],
    //   }
    // );
    const sortedWaypoints = _.sortBy(waypoints, ["time"]);
    // const [firstEndpoint, secondEndpoint] = waypoints;
    // const [from, to] =
    //   firstEndpoint.time < secondEndpoint.time
    //     ? [firstEndpoint, secondEndpoint]
    //     : [secondEndpoint, firstEndpoint];

    const { appWidth } = this.props;

    // <Waypoint
    //       appWidth={appWidth}
    //       time={from.time}
    //       text={from.text}
    //       t_0={t_0}
    //     />
    //     <RangeTimeline
    //       appWidth={appWidth}
    //       from={from.time}
    //       to={to.time}
    //       t_0={t_0}
    //     />
    //     <Waypoint appWidth={appWidth} time={to.time} text={to.text} t_0={t_0} />

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
