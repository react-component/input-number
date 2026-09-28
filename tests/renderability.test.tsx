import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import InputNumber from '../src';

it('renders zero step handlers and keeps them interactive', () => {
  const onChange = jest.fn();
  const { getByRole } = render(
    <InputNumber defaultValue={2} upHandler={0} downHandler={0} onChange={onChange} />,
  );
  const up = getByRole('button', { name: 'Increase Value' });
  const down = getByRole('button', { name: 'Decrease Value' });
  expect(up.textContent).toBe('0');
  expect(down.textContent).toBe('0');
  fireEvent.mouseDown(up);
  fireEvent.mouseUp(up);
  expect(onChange).toHaveBeenLastCalledWith(3);
  fireEvent.mouseDown(down);
  fireEvent.mouseUp(down);
  expect(onChange).toHaveBeenLastCalledWith(2);
});
