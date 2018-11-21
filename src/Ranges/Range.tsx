// tslint:disable:no-console
import * as React from "react";

import { IRangeEndpoint } from "../IRange";
import RangeTimeline from "./RangeTimeline";
import Waypoint from "./WayPoint";

interface IRangeComponent {
  appWidth: number;
  id: string;
  endpoints: IRangeEndpoint[];
  t_0: number;
}

export default class RangeComponent extends React.Component<IRangeComponent> {
  public render() {
    const { endpoints, t_0 } = this.props;
    const [firstEndpoint, secondEndpoint] = endpoints;
    const [from, to] =
      firstEndpoint.time < secondEndpoint.time
        ? [firstEndpoint, secondEndpoint]
        : [secondEndpoint, firstEndpoint];

    const {appWidth} = this.props;
        
    return (
      <React.Fragment>
        <Waypoint
          appWidth={appWidth}
          time={from.time}
          text={from.text}
          t_0={t_0}
        />
        <RangeTimeline appWidth={appWidth} from={from.time} to={to.time} t_0={t_0} />
        <Waypoint appWidth={appWidth} time={to.time} text={to.text} t_0={t_0} />
      </React.Fragment>
    );
  }
}
