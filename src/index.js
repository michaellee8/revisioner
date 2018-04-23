import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import "./base";

window.serverUrl = "https://revisioner-interview.appspot.com/graphql";
injectTapEventPlugin();
ReactDOM.render(<App />, document.getElementById("root"));
// registerServiceWorker();
