import PropTypes from "prop-types";
import React from "react";
import Fill from "./Fill";
import Button from "./Button";
import Card from "./Card";
import Animate from "../components/Animate";
import { AnimationEnum } from "../../tools/Enum";
import Text from "./Text";

export default function Dropdown(props) {
  const { title, icon, data } = props;
  const [showDrop, setshowDrop] = React.useState(false);
  return (
    <Fill>
      <Button
        icon={icon}
        onClick={() => {
          setshowDrop(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setshowDrop(false);
          }, 350);
        }}
      >
        {title}
      </Button>
      <Animate
        transition={AnimationEnum.DropdownSlideDown}
        condition={showDrop}
        duration={150}
        style={{
          position: "absolute",
          top: "110%",
          zIndex: 999,
        }}
      >
        <Card style={{ width: "100%", padding: "5%" }}>
          {data.map((val) => (
            <Button ghost style={{ textAlign: "left" }} onClick={val.onClick}>
              {val.title}
            </Button>
          ))}
        </Card>
      </Animate>
    </Fill>
  );
}

Dropdown.propTypes = {
  data: PropTypes.array,
  icon: PropTypes.any,
  title: PropTypes.string,
};

Dropdown.defaultProps = {
  data: [],
  icon: <div />,
  title: "",
};
