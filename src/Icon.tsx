import * as React from "react";

export default ({ type, style }: { type: string; style?: any }) => {
  switch (type) {
    case "times":
      return times(style);
    case "clock":
      return clock(style);
    case "calendar":
      return calendar(style);
    case "mapMarker":
      return mapMarker(style);
    default:
      return null;
  }
};

const times = (style: any) => (
  <svg
    aria-hidden="true"
    data-prefix="fas"
    data-icon="times"
    className="svg-inline--fa fa-times fa-w-11"
    role="img"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 352 512"
  >
    <path
      fill="currentColor"
      d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
    />
  </svg>
);

const clock = (style: any) => (
  <svg
    aria-hidden="true"
    data-prefix="far"
    data-icon="clock"
    className="svg-inline--fa fa-clock fa-w-16"
    role="img"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"
    />
  </svg>
);

const calendar = (style: any) => (
  <svg
    aria-hidden="true"
    data-prefix="far"
    data-icon="calendar"
    className="svg-inline--fa fa-calendar fa-w-14"
    role="img"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"
    />
  </svg>
);

const mapMarker = (style: any) => (
  <svg
    aria-hidden="true"
    data-prefix="fas"
    data-icon="map-marker-alt"
    className="svg-inline--fa fa-map-marker-alt fa-w-12"
    role="img"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path
      fill="currentColor"
      d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
    />
  </svg>
);
