import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

if (window.cordova && window.cordova.platformId === "android") {
  const onDeviceReady = () => {
    const win = window as any;
    if (win.StatusBar) win.StatusBar.backgroundColorByHexString("#0b313e");
  };
  document.addEventListener("deviceready", onDeviceReady, false);
}

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
