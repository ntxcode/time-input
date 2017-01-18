module.exports = {
  start (el) {
    return el.selectionStart || el.getSelectionStart()
  },
  end (el) {
    return el.selectionEnd || el.getSelectionEnd()
  },
  set (el, start, end) {
    el.setSelectionRange(start, end || start)
  }
}
