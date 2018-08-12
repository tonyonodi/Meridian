// tslint:disable:no-console
import * as addDays from "date-fns/add_days";
import * as format from "date-fns/format";
import * as startOfDay from "date-fns/start_of_day";
import * as subDays from "date-fns/sub_days";
import * as React from "react";
import styled from "styled-components";
import { SCROLL_FACTOR } from "./config";
import Cursor from "./Cursor";
import Day from "./Day";
import IState from "./State";

const Inner = styled.div`
  position: relative;
`;

class App extends React.Component {
  public state: IState = {
    scrollPosition: new Date().getTime(),
  };

  public componentDidMount() {
    window.addEventListener("wheel", (event: any) => {
      const deltaY = event.deltaY;
      this.setState((state: IState) => {
        const { scrollPosition } = state;
        return {
          scrollPosition: scrollPosition + deltaY * SCROLL_FACTOR,
        };
      });
    });
  }

  public render() {
    const { scrollPosition } = this.state;
    const yesterday = subDays(scrollPosition, 1);
    const today = new Date(scrollPosition);
    const tomorrow = addDays(scrollPosition, 1);

    return (
      <div className="App">
        <Inner>
          <Day
            time={scrollPosition}
            t_0={startOfDay(yesterday).getTime()}
            date={format(yesterday, "DD")}
            month={format(yesterday, "MMM")}
          />
          <Day
            time={scrollPosition}
            t_0={startOfDay(today).getTime()}
            date={format(today, "DD")}
            month={format(today, "MMM")}
          />
          <Day
            time={scrollPosition}
            t_0={startOfDay(tomorrow).getTime()}
            date={format(tomorrow, "DD")}
            month={format(tomorrow, "MMM")}
          />
          <Cursor/>
        </Inner>
      </div>
    );
  }
}

export default App;
