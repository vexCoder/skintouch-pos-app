module.exports = function (dispatch) {
  var module = {};

  module.switchTheme = function () {
    dispatch({ type: "SWITCH_THEME" });
  };

  module.setTheme = function (value) {
    dispatch({ type: "SET_THEME", payload: value });
  };

  return module;
};
