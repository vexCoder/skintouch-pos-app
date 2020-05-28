import { blue, grey, magenta, red } from "@ant-design/colors";

export const light = {
  background: "white",
  primary: magenta[3], // primary color for all components
  link: blue[5], // link color
  success: "#52c41a", // success state color
  warning: "#faad14", // warning state color
  error: "#f5222d", // error state color
  fontSize: "14px", // major text font size
  heading: "rgba(0, 0, 0, 0.85)", // heading text color
  text: "rgba(86, 78, 78, 0.85)", // major text color
  textSecondary: magenta[5], // secondary text color
  disabled: "rgba(0, 0, 0, 0.25)", // disable state color
  borderRadius: "4px", // major border radius
  border: "#d9d9d9", // major border color
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15);", // major shadow for layers
};

export const dark = {
  darker: grey[7],
  background: grey[6],
  primary: grey[3], // primary color for all components
  link: blue[5], // link color
  success: "#52c41a", // success state color
  warning: "#faad14", // warning state color
  error: red[4], // error state color
  fontSize: "14px", // major text font size
  heading: "rgba(0, 0, 0, 0.85)", // heading text color
  text: "white", // major text color
  textSecondary: grey[1], // secondary text color
  disabled: "rgba(0, 0, 0, 0.25)", // disable state color
  borderRadius: "4px", // major border radius
  border: "#d9d9d9", // major border color
  boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15);`, // major shadow for layers
};
// "#f5222d"
const basic = {
  light: {
    background: light.background,
    color: light.text,
    fill: light.text,
    ":focus": {
      background: light.background,
      borderColor: light.primary,
      color: light.text,
    },
    ":hover": {
      background: light.background,
      borderColor: light.primary,
      color: light.text,
    },
    ":active": {
      background: light.background,
      borderColor: light.primary,
      color: light.text,
    },
    "--antd-wave-shadow-color": light.primary,
  },
  dark: {
    background: dark.background,
    color: dark.text,
    fill: dark.text,
    ":focus": {
      background: dark.background,
      borderColor: dark.primary,
      color: dark.textSecondary,
    },
    ":hover": {
      background: dark.background,
      borderColor: dark.primary,
      color: dark.textSecondary,
    },
    ":active": {
      background: dark.background,
      borderColor: dark.primary,
      color: dark.textSecondary,
    },
    "--antd-wave-shadow-color": dark.primary,
  },
};

export const SideBarTheme = {
  light: {
    width: "100%",
    ...basic.light,
  },
  dark: {
    width: "100%",
    ...basic.dark,
    border: "none",
  },
};

export const EmptyTheme = {
  light: {
    color: light.text,
    margin: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dark: {
    color: dark.text,
    margin: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
  },
};

export const MenuItemTheme = (selected) => {
  return {
    light: {
      width: "100%",
      ...basic.light,
      margin: 0,
      borderRight: `4px solid ${selected ? light.primary : light.background}`,
      background: selected ? "rgba(120,120,120,0.05)" : light.background,
    },
    dark: {
      width: "100%",
      ...basic.dark,
      margin: 0,
      borderRight: `4px solid ${selected ? grey[1] : dark.background}`,
      background: selected ? grey[4] : dark.background,
    },
  };
};

export const ButtonTheme = {
  light: {
    width: "100%",
    ...basic.light,
  },
  dark: {
    width: "100%",
    ...basic.dark,
    border: "none",
    borderRadius: 2.5,
  },
};

export const TextFieldTheme = {
  light: {
    width: "100%",
    ...basic.light,
    ".ant-input": {
      ...basic.light,
      ":focus": {
        borderColor: light.primary,
        boxShadow: `none`,
      },
    },
    ".ant-input-group-addon": {
      background: light.background,
      color: `${light.textSecondary} !important`,
    },
    ".ant-input-prefix": {
      ...basic.light,
      borderColor: light.primary,
      color: `${light.textSecondary} !important`,
    },
    "&.ant-input-affix-wrapper-focused": {
      ...basic.light,
      borderColor: light.primary,
      color: `${light.textSecondary} !important`,
    },
    boxShadow: `0 0px 0px 2px rgba(0, 0, 0, 0) !important`,
  },
  dark: {
    width: "100%",
    background: dark.background,
    color: dark.text,
    ".ant-input": {
      ...basic.dark,
      boxShadow: "none",
    },
    ".ant-input-group-addon": {
      background: dark.background,
      color: dark.textSecondary,
    },
    "*": {
      border: "none",
      borderRadius: 2.5,
    },
    border: "none",
    borderRadius: 2.5,
    boxShadow: `0 0px 0px 2px rgba(0, 0, 0, 0) !important`,
  },
};

export const SelectTheme = {
  light: {
    width: "100%",
    "&:hover": {
      ".ant-select-selector": {
        borderColor: `${light.primary} !important`,
        "--antd-wave-shadow-color": light.primary,
      },
    },
    ".ant-select-selector": {
      ...basic.light,
      backgroundColor: `${light.background} !important`,
      color: light.text,
      ".ant-select-selection-search-input": {
        background: light.background,
        borderColor: light.primary,
        color: light.text,
      },
      "--antd-wave-shadow-color": light.primary,
    },
    "&.ant-select-focused": {
      ".ant-select-selector": {
        borderColor: `${light.primary} !important`,
        boxShadow: `0 0px 0px 0px rgba(0, 0, 0, 0) !important`,
      },
    },
    ".ant-select-arrow": {
      color: light.text,
    },
    "--antd-wave-shadow-color": light.primary,
  },
  dark: {
    width: "100%",
    color: dark.text,
    "&:hover": {
      ".ant-select-selector": {
        borderColor: `${dark.primary} !important`,
        "--antd-wave-shadow-color": light.primary,
      },
    },
    ".ant-select-selector": {
      ...basic.dark,
      border: "none !important",
      borderRadius: 2.5,
      backgroundColor: `${dark.background} !important`,
      color: dark.text,
      ".ant-select-selection-search-input": {
        background: dark.background,
        borderColor: dark.primary,
        color: dark.text,
      },
      "--antd-wave-shadow-color": dark.primary,
    },
    "&.ant-select-focused": {
      ".ant-select-selector": {
        borderColor: `${dark.primary} !important`,
        boxShadow: `0 0px 0px 0px rgba(0, 0, 0, 0) !important`,
      },
    },
    ".ant-select-arrow": {
      color: dark.text,
    },
  },
};

export const SelectDropdownTheme = {
  light: {
    width: "100%",
    background: light.background,
    color: light.text,
  },
  dark: {
    width: "100%",
    background: dark.background,
    color: dark.text,
  },
};

export const SelectOptionStyles = {
  position: "absolute",
  display: "flex",
  top: 0,
  left: 0,
  width: "100%",
  minHeight: "100%",
  paddingLeft: "10px",
  alignItems: "center",
  transition: "background 0.35s ease-out",
};
