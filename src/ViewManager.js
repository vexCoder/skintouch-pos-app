import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import Printing from "./renderer/pages/Printing/Printing";
import Login from "./renderer/pages/Login/Login";

class ViewManager extends Component {
  static Views() {
    return {
      main: <App />,
      login: <Login />,
      print: <Printing />,
    };
  }
  static View(props) {
    let name = props.location.search.substr(1);
    let view = ViewManager.Views()[name];
    if (view == null) throw new Error("View " + name + " is undefined");
    return view;
  }

  render() {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Router>
          <Route path="/" component={ViewManager.View} />
        </Router>
      </div>
    );
  }
}

export default ViewManager;
