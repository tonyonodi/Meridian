// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import { SCROLL_FACTOR } from "./config";
import TimeLine from "./TimeLine";

const Inner = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
`;

interface IAppState {
  timeCursor: number;
}

class App extends React.Component {
  public state: IAppState = {
    timeCursor: new Date().getTime(),
  };

  public componentDidMount() {
    window.addEventListener("wheel", (event: any) => {
      const deltaY = event.deltaY;
      this.setState((state: IAppState) => {
        const { timeCursor } = state;
        return { timeCursor: timeCursor + deltaY * SCROLL_FACTOR };
      });
    });

    window.addEventListener("touchmove", (event: any) => {
      console.log(event);
    });
  }

  public render() {
    const { timeCursor } = this.state;

    return (
      <div className="App">
        <Inner>
          <TimeLine timeCursor={timeCursor} timezone="Europe/London" />
          <TimeLine timeCursor={timeCursor} timezone="America/New_York" />
        </Inner>
      </div>
    );
  }
}

export default App;
