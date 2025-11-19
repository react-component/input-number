import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InputNumber from '../src';

describe('InputNumber.AllowClear', () => {
  it('should render clear icon when allowClear is true and value is not empty', () => {
    const { container } = render(
      <InputNumber allowClear value={123} />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    expect(clearIcon).toBeTruthy();
    expect(clearIcon).not.toHaveClass('rc-input-number-clear-icon-hidden');
  });

  it('should not render clear icon when value is empty', () => {
    const { container } = render(
      <InputNumber allowClear value={null} />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    expect(clearIcon).toHaveClass('rc-input-number-clear-icon-hidden');
  });

  it('should render clear icon when value is 0', () => {
    const { container } = render(
      <InputNumber allowClear value={0} />
    );
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    expect(clearIcon).not.toHaveClass('rc-input-number-clear-icon-hidden');
  });

  it('should not render clear icon when disabled', () => {
    const { container } = render(
      <InputNumber allowClear value={123} disabled />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    expect(clearIcon).toHaveClass('rc-input-number-clear-icon-hidden');
  });

  it('should not render clear icon when readOnly', () => {
    const { container } = render(
      <InputNumber allowClear value={123} readOnly />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    expect(clearIcon).toHaveClass('rc-input-number-clear-icon-hidden');
  });

  it('should clear value to null when allowClear is true (boolean type)', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber allowClear value={123} onChange={onChange} />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    fireEvent.click(clearIcon);
    
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('should clear value to custom value when allowClear is object with clearValue', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber 
        allowClear={{ clearValue: 0 }} 
        value={123} 
        onChange={onChange} 
      />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    fireEvent.click(clearIcon);
    
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('should handle string clearValue correctly', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber 
        allowClear={{ clearValue: 'reset' }} 
        value={123} 
        onChange={onChange} 
        stringMode
      />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    fireEvent.click(clearIcon);
    
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('should support all clearValue types', () => {
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    const onChange3 = jest.fn();
    
    // Test number clearValue
    const { container: container1, unmount: unmount1 } = render(
      <InputNumber allowClear={{ clearValue: 42 }} value={123} onChange={onChange1} />
    );
    fireEvent.click(container1.querySelector('.rc-input-number-clear-icon'));
    expect(onChange1).toHaveBeenCalledWith(42);
    unmount1();
    
    // Test zero clearValue
    const { container: container2, unmount: unmount2 } = render(
      <InputNumber allowClear={{ clearValue: 0 }} value={123} onChange={onChange2} />
    );
    fireEvent.click(container2.querySelector('.rc-input-number-clear-icon'));
    expect(onChange2).toHaveBeenCalledWith(0);
    unmount2();
    
    // Test undefined clearValue
    const { container: container3, unmount: unmount3 } = render(
      <InputNumber allowClear={{ clearValue: undefined }} value={123} onChange={onChange3} />
    );
    fireEvent.click(container3.querySelector('.rc-input-number-clear-icon'));
    expect(onChange3).toHaveBeenCalledWith(null);
    unmount3();
  });

  it('should trigger onClear callback when clear icon is clicked', () => {
    const onClear = jest.fn();
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber 
        allowClear 
        value={123} 
        onClear={onClear}
        onChange={onChange}
      />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    fireEvent.click(clearIcon);
    
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should have correct className when suffix is provided', () => {
    const { container } = render(
      <InputNumber allowClear value={123} suffix="$" />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    expect(clearIcon).toHaveClass('rc-input-number-clear-icon-has-suffix');
  });

  it('should work with defaultValue', () => {
    const onChange = jest.fn();
    const { container } = render(
      <InputNumber 
        allowClear 
        defaultValue={100} 
        onChange={onChange} 
      />
    );
    
    const clearIcon = container.querySelector('.rc-input-number-clear-icon');
    expect(clearIcon).not.toHaveClass('rc-input-number-clear-icon-hidden');
    fireEvent.click(clearIcon);
    
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });
});