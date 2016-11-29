import React, { Component } from 'react';
import Touchable from 'rc-touchable';

class InputHandler extends Component {
  render() {
    const props = { ...this.props };
    const { prefixCls, disabled } = props;
    delete props.prefixCls;
    return (
      <Touchable
        disabled={disabled}
        activeClassName={`${prefixCls}-handler-active`}
      >
      <span {...props}>
        {props.children}
      </span>
      </Touchable>);
  }
}

export default InputHandler;
