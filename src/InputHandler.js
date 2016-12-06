import React, { Component, propTypes } from 'react';
import Touchable from 'rc-touchable';

class InputHandler extends Component {
  render() {
    const { prefixCls, disabled, ...otherProps } = this.props;
    return (
      <Touchable disabled={disabled} activeClassName={`${prefixCls}-handler-active`}>
        <span {...otherProps} />
      </Touchable>
    );
  }
}

InputHandler.propTypes = {
  prefixCls: propTypes.string,
  disabled: propTypes.bool,
};

export default InputHandler;
