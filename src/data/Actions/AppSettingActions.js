module.exports = function (dispatch) {
  var module = {};

  module.switchTab = function (value) {
    dispatch({ type: "SWITCH_TAB", payload: value });
  };

  module.pushNotif = function (value) {
    dispatch({ type: "PUSH_NOTIF", payload: value });
  };

  module.popNotif = function (value) {
    dispatch({ type: "POP_NOTIF", payload: value });
  };

  module.hideNotif = function (value) {
    dispatch({ type: "HIDE_NOTIF", payload: value });
  };

  return module;
};
