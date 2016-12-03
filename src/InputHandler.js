import React, { Component } from 'react';
import Touchable from 'rc-touchable';

export default class InputHandler extends Component {
  render() {
    const { prefixCls, disabled, ...otherProps } = this.props;
    return (
      <Touchable disabled={disabled} activeClassName={`${prefixCls}-handler-active`}>
        <span {...otherProps} />
      </Touchable>
    );
  }
}
