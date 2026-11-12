import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import InputNumber, { InputNumberRef } from '../src';

it.each([React.Fragment, React.StrictMode])('supports a state setter as ref with %s', (Wrapper) => {
  const Demo = () => {
    const [input, setInput] = React.useState<HTMLInputElement | null>(null);
    return (
      <>
        <InputNumber ref={setInput} defaultValue={2} />
        <span>{input ? 'ready' : 'pending'}</span>
      </>
    );
  };

  const { container, getByText } = render(
    <Wrapper>
      <Demo />
    </Wrapper>,
  );
  expect(getByText('ready')).toBeTruthy();

  const input = container.querySelector('input')!;
  fireEvent.change(input, { target: { value: '3' } });
  expect(input.value).toBe('3');
});

it('keeps the ref and its methods working after updates', () => {
  const ref = React.createRef<InputNumberRef>();
  const { container, rerender, unmount } = render(<InputNumber ref={ref} value={12} />);
  const input = container.querySelector('input')!;
  const initialRef = ref.current;

  rerender(<InputNumber ref={ref} value={345} mode="spinner" prefix="$" suffix="kg" allowClear />);
  expect(ref.current === initialRef).toBe(true);
  expect(ref.current?.nativeElement).toBe(container.firstChild);
  expect(ref.current?.value).toBe('345');

  act(() => ref.current?.focus({ cursor: 'all' }));
  expect(document.activeElement).toBe(input);
  expect(input.selectionStart).toBe(0);
  expect(input.selectionEnd).toBe(3);

  act(() => ref.current?.blur());
  expect(document.activeElement).not.toBe(input);

  unmount();
  expect(ref.current).toBeNull();
});

it('updates a replacement ref and clears the previous one', () => {
  const firstRef = React.createRef<InputNumberRef>();
  const secondRef = React.createRef<InputNumberRef>();
  const { container, rerender, unmount } = render(<InputNumber ref={firstRef} defaultValue={2} />);

  rerender(<InputNumber ref={secondRef} defaultValue={2} />);
  expect(firstRef.current).toBeNull();
  expect(secondRef.current?.nativeElement).toBe(container.firstChild);
  expect(secondRef.current?.value).toBe('2');

  unmount();
  expect(secondRef.current).toBeNull();
});
