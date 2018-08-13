import * as addDays from "date-fns/add_days";
import * as format from "date-fns/format";
import * as startOfDay from "date-fns/start_of_day";
import * as subDays from "date-fns/sub_days";
import * as React from "react";
import Day from "./Day";

interface ITimeZoneProps {
  timeCursor: number;
}

export default class TimeZone extends React.Component<ITimeZoneProps> {
  public render() {
    const { timeCursor } = this.props;
    const yesterday = subDays(timeCursor, 1);
    const today = new Date(timeCursor);
    const tomorrow = addDays(timeCursor, 1);

    return (
      <div>
        <Day
          time={timeCursor}
          t_0={startOfDay(yesterday).getTime()}
          date={format(yesterday, "DD")}
          month={format(yesterday, "MMM")}
        />
        <Day
          time={timeCursor}
          t_0={startOfDay(today).getTime()}
          date={format(today, "DD")}
          month={format(today, "MMM")}
        />
        <Day
          time={timeCursor}
          t_0={startOfDay(tomorrow).getTime()}
          date={format(tomorrow, "DD")}
          month={format(tomorrow, "MMM")}
        />
      </div>
    );
  }
}
