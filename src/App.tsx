// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import { SCROLL_FACTOR } from "./config";
import TimeZone from "./TimeZone";

const Inner = styled.div`
  position: relative;
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
  }

  public render() {
    const { timeCursor } = this.state;

    return (
      <div className="App">
        <Inner>
          <TimeZone timeCursor={timeCursor} />
        </Inner>
      </div>
    );
  }
}

export default App;
