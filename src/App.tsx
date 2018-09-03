// tslint:disable:no-console
import * as React from "react";
import styled from "styled-components";
import AddTimeZoneButton from "./AddTimeZoneButton";
import {
  ADD_TIMEZONE_FORM_WIDTH,
  PALETTE,
  PARENT_VIEW_WIDTH,
  WINDOW_HEIGHT_IN_DAYS,
  WINDOW_HEIGHT_IN_MS,
} from "./config";
import IMarker from "./IMarker";
import ITimezone from "./ITimezone";
import Markers from "./Markers";
import Modal from "./Modal";
import ModalData from "./ModalData";
import TimeLine from "./TimeLine";
import timezoneData from "./timezonedata";
import Toolbar from "./Toolbar";

const ContainerView = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: calc(200vh * ${WINDOW_HEIGHT_IN_DAYS});
`;

interface IAppState {
  clockPosition: number | null;
  ignoreNextScrollEvent: boolean;
  t_0: number;
  timeCursor: number;
  timezones: ITimezone[];
  modal: ModalData;
  markers: IMarker[];
}

class App extends React.Component<{}, IAppState> {
  private containerElement: HTMLDivElement;

  public constructor(props: {}) {
    super(props);
    const timezonesString = window.localStorage.getItem(
      "__timezonesapp.timezones"
    );
    const timezones =
      typeof timezonesString === "string" ? JSON.parse(timezonesString) : null;

    this.state = {
      clockPosition: new Date().getTime(),
      ignoreNextScrollEvent: false,
      markers: [
        {
          id: Math.random()
            .toString()
            .substr(2),
          text: "Flight from LHR",
          time: 1535991002676,
        },
      ],
      modal: {
        kind: "none",
      },
      t_0: new Date().getTime(),
      timeCursor: new Date().getTime(),
      timezones: timezones || [
        {
          city: "London",
          country: "United Kingdom",
          timezone: "Europe/London",
        },
        {
          city: "Bangkok",
          country: "Thailand",
          timezone: "Asia/Bangkok",
        },
      ],
    };
  }

  public addTimezone = (timezone: ITimezone) => {
    this.setState(({ timezones }) => {
      return {
        timezones: [...timezones, timezone],
      };
    });
  };

  public closeModal = () => {
    this.setState({
      modal: {
        kind: "none",
      },
    });
  };

  public updateModal = (modal: ModalData) => () => {
    this.setState({ modal });
  };

  public componentDidMount() {
    window.scrollTo(0, document.body.clientHeight / 2 - window.innerHeight / 2);

    window.addEventListener("keypress", (event: any) => {
      if (document.activeElement !== window.document.body) {
        return;
      }

      switch (event.key) {
        case "j":
          event.preventDefault();
          this.setState(({ timeCursor }) => {
            return { timeCursor: timeCursor + 60 * 1000 };
          });
          break;

        case "k":
          event.preventDefault();
          this.setState(({ timeCursor }) => {
            return { timeCursor: timeCursor - 60 * 1000 };
          });
          break;

        default:
          break;
      }
    });

    let scrollEventFiredCount = 0;
    let lastScrollYOffset = window.pageYOffset;
    window.addEventListener("scroll", (event: any) => {
      // ignore if only scrolling horizontally
      if (window.pageYOffset === lastScrollYOffset) {
        return;
      }
      lastScrollYOffset = window.pageYOffset;
      if (this.state.ignoreNextScrollEvent) {
        this.setState({ ignoreNextScrollEvent: false });
        return;
      }

      const { innerHeight } = window;
      const {
        top,
        height: containerHeight,
      } = this.containerElement.getBoundingClientRect();
      const cursorPxDistanceFromTop = Math.abs(top) + innerHeight / 2;
      const cursorPxDistanceFromCenter =
        cursorPxDistanceFromTop - containerHeight / 2;
      const scrollFraction = cursorPxDistanceFromCenter / containerHeight;

      // Don't set clockPosition to null the first two times a scroll event is fired.
      scrollEventFiredCount += 1;
      const clockPosition =
        scrollEventFiredCount > 2 ? null : this.state.clockPosition;

      this.setState(state => {
        return {
          clockPosition,
          timeCursor: state.t_0 + scrollFraction * WINDOW_HEIGHT_IN_MS,
        };
      });
    });

    window.setInterval(() => {
      if (this.state.clockPosition !== null) {
        const currentTime = new Date().getTime();
        this.updateTime({ time: currentTime, activateClockMode: true });
      }
    }, 1000);
  }

  public componentDidUpdate(prevprops: {}, prevState: IAppState) {
    const { timezones: prevTimezones } = prevState;
    const { timezones } = this.state;
    if (prevTimezones === timezones) {
      return;
    }

    window.localStorage.setItem(
      "__timezonesapp.timezones",
      JSON.stringify(timezones)
    );
  }

  public containerViewRef = (el: any) => (this.containerElement = el);

  public removeTimeline = (timezoneToRemove: string) => () => {
    this.setState(({ timezones }) => {
      return {
        timezones: timezones.filter(
          ({ timezone }) => timezone !== timezoneToRemove
        ),
      };
    });
  };

  public updateTime = ({
    activateClockMode,
    time,
  }: {
    activateClockMode: boolean;
    time: number;
  }): void => {
    window.scrollTo(
      window.scrollX,
      document.body.clientHeight / 2 - window.innerHeight / 2
    );

    this.setState({
      clockPosition: activateClockMode ? time : null,
      ignoreNextScrollEvent: true,
      t_0: time,
      timeCursor: time,
    });
  };

  public render() {
    const { timeCursor, t_0, timezones } = this.state;
    return (
      <div
        className="App"
        style={{
          minWidth: `${timezones.length * PARENT_VIEW_WIDTH +
            ADD_TIMEZONE_FORM_WIDTH}px`,
        }}
      >
        <Modal modalData={this.state.modal} closeModal={this.closeModal} />
        <ContainerView innerRef={this.containerViewRef}>
          {this.state.timezones.map((timezone, i) => {
            return (
              <TimeLine
                key={timezone.timezone}
                timeCursor={timeCursor}
                t_0={t_0}
                timezone={timezone}
                color={PALETTE[i]}
                index={timezones.length - i}
                remove={this.removeTimeline(timezone.timezone)}
              />
            );
          })}
          <AddTimeZoneButton
            addTimezone={this.addTimezone}
            color={PALETTE[timezones.length]}
            timezones={timezoneData}
          />
        </ContainerView>
        <Markers markers={this.state.markers} t_0={this.state.t_0} />
        <Toolbar
          clockPosition={this.state.clockPosition}
          timeCursor={this.state.timeCursor}
          updateTime={this.updateTime}
        />
      </div>
    );
  }
}

export default App;
