import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool,
};

export default InputHandler;
