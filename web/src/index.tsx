import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

// import mobileConsoleLog from "./lib/mobileConsoleLog";

// disable pinch to zoom
// document.addEventListener(
//   "touchmove",
//   (event: any) => {
//     mobileConsoleLog("touchmove");
//     if (event.scale !== 1) {
//       mobileConsoleLog("preventing");
//       event.preventDefault();
//     } else {
//       mobileConsoleLog("not preventing");
//     }
//   },
//   { passive: false }
// );

// disable double tap zoom
// let lastTouchEnd = 0;
// document.addEventListener(
//   "touchend",
//   (event: any) => {
//     const now = new Date().getTime();
//     if (now - lastTouchEnd <= 300) {
//       event.preventDefault();
//     }
//     lastTouchEnd = now;
//   },
//   false
// );

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
