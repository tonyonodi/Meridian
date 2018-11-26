// tslint:disable:no-console
import * as _ from "lodash";
import * as luxon from "luxon";
import * as React from "react";
import styled from "styled-components";

import {
  ADD_TIMEZONE_FORM_WIDTH,
  PALETTE,
  PARENT_VIEW_WIDTH,
  WINDOW_HEIGHT_IN_DAYS,
  WINDOW_HEIGHT_IN_MS,
} from "./config";

import AddTimeZoneButton from "./AddTimeZoneButton";
import DraftWaypoint from "./DraftWaypoint";
import ITimezone from "./ITimezone";
import Modal from "./Modal";
import ModalData from "./ModalData";
import Ranges from "./Ranges";
import { IRange, IRangeWaypoint } from "./Ranges/IRange";
import TimeLine from "./TimeLine";
import timezoneData from "./timezonedata";
import Toolbar from "./Toolbar";

const { DateTime } = luxon;

const ContainerView = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: calc(200vh * ${WINDOW_HEIGHT_IN_DAYS});
`;

const defaultTimezones = [
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
];

interface IAppState {
  clockPosition: number | null;
  draftWaypoint: {
    rangeId: string;
  } | null;
  ignoreNextScrollEvent: boolean;
  showAddTimezone: boolean;
  t_0: number;
  timeCursor: number;
  timezones: ITimezone[];
  modal: ModalData;
  ranges: IRange[];
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



    const rangesString = window.localStorage.getItem("__timezonesapp.ranges");
    const ranges =
      typeof rangesString === "string" ? JSON.parse(rangesString) : [];

    this.state = {
      clockPosition: new Date().getTime(),
      draftWaypoint: null,
      ignoreNextScrollEvent: false,
      modal: {
        kind: "none",
      },
      ranges,
      showAddTimezone: false,
      t_0: new Date().getTime(),
      timeCursor: new Date().getTime(),
      timezones: timezones || defaultTimezones,
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

  public addWaypointDraft = (rangeId: string) => {
    this.setState({ draftWaypoint: { rangeId } });
  };

  public addWaypoint = ({
    rangeId,
    rangeText,
  }: {
    rangeId: string;
    rangeText: string;
  }) => {
    this.setState(
      ({ ranges, timeCursor }) => {
        const rangeIndex = ranges.findIndex(range => range.id === rangeId);

        if (rangeIndex < 0) {
          const newRange = {
            id: rangeId,
            waypoints: [
              { text: rangeText, time: timeCursor, id: Math.random() + "" },
            ],
          };
          return {
            ranges: [...ranges, newRange],
          };
        }

        const newRanges = ranges.map(range => {
          if (range.id !== rangeId) {
            return range;
          }

          return {
            ...range,
            waypoints: [
              ...range.waypoints,
              { text: rangeText, time: timeCursor, id: Math.random() + "" },
            ],
          };
        });

        return { ranges: newRanges };
      },
      () => {
        this.updateTime({ time: this.state.timeCursor + 60 * 60 * 1000 });
      }
    );
  };

  public deleteWaypoint = ({
    rangeId,
    waypointId,
  }: {
    rangeId: string;
    waypointId: string;
  }) => {
    this.setState(({ ranges }) => {
      const mapWaypoints = (waypoint: IRangeWaypoint) => {
        return waypoint.id !== waypointId;
      };

      const mapRanges = (range: IRange) => {
        if (range.id !== rangeId) {
          return range;
        }

        const waypoints = range.waypoints.filter(mapWaypoints);

        return {
          ...range,
          waypoints,
        };
      };

      const newRanges = ranges.map(mapRanges);

      return { ranges: newRanges };
    });
  };

  public deleteRange = (rangeId: string) => {
    this.setState(({ ranges }) => {
      const newRanges = ranges.filter(range => range.id !== rangeId);

      return { ranges: newRanges };
    });
  };

  public cancelWaypointDraft = () => {
    this.setState({ draftWaypoint: null });
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
            const newTime = DateTime.fromMillis(timeCursor)
              .plus({
                minutes: 1,
              })
              .toMillis();

            this.updateTime({
              activateClockMode: false,
              time: newTime,
            });
          });
          break;

        case "k":
          event.preventDefault();
          this.setState(({ timeCursor }) => {
            const newTime = DateTime.fromMillis(timeCursor)
              .minus({
                minutes: 1,
              })
              .toMillis();

            this.updateTime({
              activateClockMode: false,
              time: newTime,
            });
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
        const currentDate = new Date();
        const newMinutes = currentDate.getMinutes();
        const oldMinutes = new Date(this.state.clockPosition).getMinutes();
        if (newMinutes !== oldMinutes) {
          const currentTime = currentDate.getTime();
          this.updateTime({ time: currentTime, activateClockMode: true });
        }
      }
    }, 100);
  }

  public componentDidUpdate(prevprops: {}, prevState: IAppState) {
    const { timezones: prevTimezones, ranges: prevRanges } = prevState;
    const { timezones, ranges } = this.state;

    if (!_.isEqual(prevTimezones, timezones)) {
      window.localStorage.setItem(
        "__timezonesapp.timezones",
        JSON.stringify(timezones)
      );
    }

    if (!_.isEqual(prevRanges, ranges)) {
      window.localStorage.setItem(
        "__timezonesapp.ranges",
        JSON.stringify(ranges)
      );
    }
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

  public toggleAddTimezone = (state?: boolean) => {
    this.setState(({ showAddTimezone }) => ({
      showAddTimezone: state === undefined ? !showAddTimezone : state,
    }));
  };

  public updateTime = ({
    activateClockMode = false,
    time,
  }: {
    activateClockMode?: boolean;
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

  public addRange = () => {
    this.setState(({ ranges }) => {
      return {
        ranges: [
          ...ranges,
          {
            draftWaypoint: {
              prevTime: null,
              text: null,
            },
            id: Math.random() + "",
            waypoints: [],
          },
        ],
      };
    });
  };

  public render() {
    const { timeCursor, t_0, timezones, showAddTimezone } = this.state;
    const appWidth =
      timezones.length * PARENT_VIEW_WIDTH +
      (showAddTimezone ? ADD_TIMEZONE_FORM_WIDTH : PARENT_VIEW_WIDTH);
    return (
      <div
        className="App"
        style={{
          minWidth: `${appWidth}px`,
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
                updateTime={this.updateTime}
                color={PALETTE[i]}
                index={timezones.length - i}
                remove={this.removeTimeline(timezone.timezone)}
              />
            );
          })}
          <AddTimeZoneButton
            addTimezone={this.addTimezone}
            color={PALETTE[timezones.length]}
            show={this.state.showAddTimezone}
            toggle={this.toggleAddTimezone}
            timezones={timezoneData}
          />
        </ContainerView>
        {this.state.draftWaypoint && (
          <DraftWaypoint
            addWaypoint={this.addWaypoint}
            cancelWaypointDraft={this.cancelWaypointDraft}
            appWidth={appWidth}
            draftWaypoint={this.state.draftWaypoint}
          />
        )}
        <Ranges
          appWidth={appWidth}
          ranges={this.state.ranges}
          t_0={this.state.t_0}
          addWaypointDraft={this.addWaypointDraft}
          deleteWaypoint={this.deleteWaypoint}
          deleteRange={this.deleteRange}
          cancelWaypointDraft={this.cancelWaypointDraft}
        />
        <Toolbar
          clockPosition={this.state.clockPosition}
          timeCursor={this.state.timeCursor}
          updateTime={this.updateTime}
          addWaypointDraft={this.addWaypointDraft}
        />
      </div>
    );
  }
}

export default App;
