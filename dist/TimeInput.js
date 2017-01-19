'use strict';

var React = require('react');
var isTwelveHourTime = require('./lib/is-twelve-hour-time');
var replaceCharAt = require('./lib/replace-char-at');
var getGroupId = require('./lib/get-group-id');
var getGroups = require('./lib/get-groups');
var adder = require('./lib/time-string-adder');
var caret = require('./lib/caret');
var validate = require('./lib/validate');

var TimeInput = React.createClass({
  displayName: 'TimeInput',
  getInitialState: function getInitialState() {
    return {};
  },
  getDefaultProps: function getDefaultProps() {
    return {
      defaultValue: '00:00:00:000 AM',
      Component: 'input'
    };
  },

  propTypes: {
    className: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    defaultValue: React.PropTypes.string,
    Component: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string, React.PropTypes.object])
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        Component = _props.Component,
        className = _props.className,
        defaultValue = _props.defaultValue,
        value = _props.value;

    return React.createElement(Component, {
      className: className,
      ref: function ref(input) {
        _this.input = input;
      },
      type: 'text',
      value: this.format(value || defaultValue),
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onKeyDown: this.handleKeyDown
    });
  },
  format: function format(val) {
    if (isTwelveHourTime(val)) val = val.replace(/^00/, '12');
    return val.toUpperCase();
  },
  getValue: function getValue() {
    return this.props.value || this.props.defaultValue;
  },
  componentDidMount: function componentDidMount() {
    this.mounted = true;
  },
  componentWillUnmount: function componentWillUnmount() {
    this.mounted = false;
  },
  componentDidUpdate: function componentDidUpdate() {
    var index = this.state.caretIndex;
    if (index || index === 0) caret.set(this.input, index);
  },
  handleBlur: function handleBlur() {
    if (this.mounted) this.setState({ caretIndex: null });
  },
  handleEscape: function handleEscape() {
    if (this.mounted) this.input.blur();
  },
  handleTab: function handleTab(event) {
    var start = caret.start(this.input);
    var value = this.getValue();
    var groups = getGroups(value);
    var groupId = getGroupId(start);
    if (event.shiftKey) {
      if (!groupId) return;
      groupId--;
    } else {
      if (groupId >= groups.length - 1) return;
      groupId++;
    }
    event.preventDefault();
    var index = groupId * 3;
    if (this.getValue().charAt(index) === ' ') index++;
    if (this.mounted) this.setState({ caretIndex: index });
  },
  handleArrows: function handleArrows(event) {
    event.preventDefault();
    var start = caret.start(this.input);
    var value = this.getValue();
    var amount = event.which === 38 ? 1 : -1;
    if (event.shiftKey) {
      amount *= 2;
      if (event.metaKey) amount *= 2;
    }
    value = adder(value, getGroupId(start), amount);
    this.onChange(value, start);
  },
  handleBackspace: function handleBackspace(event) {
    event.preventDefault();
    var defaultValue = this.props.defaultValue;
    var start = caret.start(this.input);
    var value = this.getValue();
    var end = caret.end(this.input);
    var diff = end - start;
    if (!diff) {
      if (value[start - 1] === ':') start--;
      value = replaceCharAt(value, start - 1, defaultValue.charAt(start - 1));
      start--;
    } else {
      while (diff--) {
        if (value[end - 1] !== ':') {
          value = replaceCharAt(value, end - 1, defaultValue.charAt(end - 1));
        }
        end--;
      }
    }
    this.onChange(value, start);
  },
  handleForwardspace: function handleForwardspace(event) {
    event.preventDefault();
    var defaultValue = this.props.defaultValue;
    var start = caret.start(this.input);
    var value = this.getValue();
    var end = caret.end(this.input);
    var diff = end - start;
    if (!diff) {
      if (value[start] === ':') start++;
      value = replaceCharAt(value, start, defaultValue.charAt(start));
      start++;
    } else {
      while (diff--) {
        if (value[end - 1] !== ':') {
          value = replaceCharAt(value, start, defaultValue.charAt(start));
        }
        start++;
      }
    }
    this.onChange(value, start);
  },
  handleKeyDown: function handleKeyDown(event) {
    if (event.which === 9) return this.handleTab(event);
    if (event.which === 38 || event.which === 40) return this.handleArrows(event);
    if (event.which === 8) return this.handleBackspace(event);
    if (event.which === 46) return this.handleForwardspace(event);
    if (event.which === 27) return this.handleEscape(event);
  },
  isSeparator: function isSeparator(char) {
    return (/[:\s]/.test(char)
    );
  },
  handleChange: function handleChange(event) {
    var value = this.getValue();
    var newValue = event.target.value;
    newValue += value.substr(newValue.length, value.length);
    var diff = newValue.length - value.length;
    var end = caret.start(this.input);
    var insertion;
    event.preventDefault();
    if (diff > 0) {
      var start = end - diff;
      insertion = newValue.slice(end - diff, end);
      while (diff--) {
        var oldChar = value.charAt(start);
        var newChar = insertion.charAt(0);
        if (this.isSeparator(oldChar)) {
          if (this.isSeparator(newChar)) {
            insertion = insertion.slice(1);
            start++;
          } else {
            start++;
            diff++;
            end++;
          }
        } else {
          value = replaceCharAt(value, start, newChar);
          insertion = insertion.slice(1);
          start++;
        }
      }
      newValue = value;
    }
    if (validate(newValue)) {
      this.onChange(newValue, end);
    } else {
      var caretIndex = this.getValue().length - (newValue.length - end);
      if (this.mounted) this.setState({ caretIndex: caretIndex });
    }
  },

  onChange: function onChange(str, caretIndex) {
    if (this.props.onChange) this.props.onChange(this.format(str));
    if (this.mounted && typeof caretIndex === 'number') this.setState({ caretIndex: caretIndex });
  }
});

module.exports = TimeInput;