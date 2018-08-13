// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import { PALETTE, WINDOW_HEIGHT_IN_DAYS, WINDOW_HEIGHT_IN_MS } from "./config";
import TimeLine from "./TimeLine";

const ContainerView = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: calc(200vh * ${WINDOW_HEIGHT_IN_DAYS});
`;

interface IAppState {
  t_0: number;
  timeCursor: number;
  timezones: string[];
}

class App extends React.Component<{}, IAppState> {
  public state: IAppState = {
    t_0: new Date().getTime(),
    timeCursor: new Date().getTime(),
    timezones: ["Europe/London", "America/New_York", "Europe/Paris"],
  };

  private containerElement: HTMLDivElement;

  public componentDidMount() {
    window.scrollTo(0, document.body.clientHeight / 2 - window.innerHeight / 2);

    window.addEventListener("scroll", (event: any) => {
      const { innerHeight } = window;
      const {
        top,
        height: containerHeight,
      } = this.containerElement.getBoundingClientRect();
      const cursorPxDistanceFromTop = Math.abs(top) + innerHeight / 2;
      const cursorPxDistanceFromCenter =
        cursorPxDistanceFromTop - containerHeight / 2;
      const scrollFraction = cursorPxDistanceFromCenter / containerHeight;

      this.setState(state => {
        return {
          timeCursor: state.t_0 + scrollFraction * WINDOW_HEIGHT_IN_MS,
        };
      });
    });
  }

  public containerViewRef = (el: any) => (this.containerElement = el);

  public render() {
    const { timeCursor, t_0 } = this.state;

    return (
      <div className="App">
        <ContainerView innerRef={this.containerViewRef}>
          {this.state.timezones.map((timezone, i) => {
            return (
              <TimeLine
                key={timezone}
                timeCursor={timeCursor}
                t_0={t_0}
                timezone={timezone}
                color={PALETTE[i]}
              />
            );
          })}
        </ContainerView>
      </div>
    );
  }
}

export default App;
