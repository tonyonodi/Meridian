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
import ITimezone from "./ITimezone";
import Modal from "./Modal";
import ModalData from "./ModalData";
import TimeLine from "./TimeLine";
import timezoneData from "./timezonedata";

const ContainerView = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: calc(200vh * ${WINDOW_HEIGHT_IN_DAYS});
`;

interface IAppState {
  t_0: number;
  timeCursor: number;
  timezones: ITimezone[];
  modal: ModalData;
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
      </div>
    );
  }
}

export default App;
