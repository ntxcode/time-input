"use strict";

module.exports = {
  start: function start(el) {
    return el.selectionStart || el.getSelectionStart();
  },
  end: function end(el) {
    return el.selectionEnd || el.getSelectionEnd();
  },
  set: function set(el, start, end) {
    el.setSelectionRange(start, end || start);
  }
};