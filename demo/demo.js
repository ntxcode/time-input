var React = require('react')
var ReactDom = require('react-dom')
var TimeInput = require('../src/TimeInput')

var MyCustomInput = React.createClass({
  getSelectionStart() {
    return this.refs.input.selectionStart;
  },
  getSelectionEnd() {
    return this.refs.input.selectionStart;
  },
  setSelectionRange(selectionStart, selectionEnd, selectionDirection) {
    return this.refs.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  },
  render() {
    return <input ref="input" {...this.props} />
  }
})

;(function render (value) {
  ReactDom.render((
      <div className="TimeInput">
        <TimeInput className="TimeInput-input" value={value} onChange={render} defaultValue='12:00:00:000 AM'/>
      </div>
  ), document.getElementById('demo-1'))
})('12:00:00:000 AM')

;(function render (value) {
  ReactDom.render((
      <div className="TimeInput">
        <TimeInput className="TimeInput-input" value={value} onChange={render} defaultValue='13:00' />
      </div>
  ), document.getElementById('demo-2'))
})()

;(function render (value) {
  ReactDom.render((
      <div className="TimeInput">
        <TimeInput className="TimeInput-input" Component={MyCustomInput} value={value} onChange={render} />
      </div>
  ), document.getElementById('demo-3'))
})('12:00:00:000 AM')
