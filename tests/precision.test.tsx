import { fireEvent } from '@testing-library/dom';
import { KeyCode } from '@rc-component/util';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import InputNumber from '../src';

describe('InputNumber.Precision', () => {
  // https://github.com/react-component/input-number/issues/506
  it('Safari bug of input', async () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(null);

      return <InputNumber precision={2} value={value} onChange={setValue} />;
    };

    const { container } = render(<Demo />);
    const input = container.querySelector('input');

    // React use SyntheticEvent to handle `onBeforeInput`, let's mock this
    fireEvent.keyPress(input, {
      which: KeyCode.TWO,
      keyCode: KeyCode.TWO,
      char: '2',
    });

    fireEvent.change(input, {
      target: {
        value: '2',
      },
    });

    expect(input.value).toEqual('2');
  });
});
