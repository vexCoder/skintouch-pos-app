import React from "react";
import ReactDOM from "react-dom";
import ViewManager from "./ViewManager";

import "./base/index.css";
import { StateProvider } from "./data/Provider";

ReactDOM.render(
  <StateProvider>
    <ViewManager />
  </StateProvider>,
  document.getElementById("root")
);
