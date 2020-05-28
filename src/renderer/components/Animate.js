import React from "react";
import Anime, { anime } from "react-anime";
import PropTypes from "prop-types";
import { Transition, TransitionGroup } from "react-transition-group";
import Fill from "../elements/Fill";

export default function Animate(props) {
  const { children, transition, condition, duration, easing, style } = props;

  const defaultStyle = {};

  return (
    <Transition
      in={condition}
      timeout={duration}
      mountOnEnter
      unmountOnExit
      {...props}
    >
      {(state) => {
        return (
          <Fill
            style={{
              transition: `all ${duration}ms ${easing}`,
              ...transition[state],
              ...style,
            }}
          >
            {children}
          </Fill>
        );
      }}
    </Transition>
  );
}

Animate.propTypes = {
  condition: PropTypes.bool,
  duration: PropTypes.number,
  easing: PropTypes.string,
};

Animate.defaultProps = {
  condition: true,
  duration: 1000,
  easing: "ease-in-out",
};
