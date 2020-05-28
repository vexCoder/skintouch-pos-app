import React from "react";
import Fill from "./Fill";

export default function Center(props) {
  return (
    <Fill style={{ display: "flex", justifyContent: "center", ...props.style }}>
      {props.children}
    </Fill>
  );
}
