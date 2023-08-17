import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import InputNumber from '../src';

describe('InputNumber.CutOnly', () => {
  it('precision and cutOnly', async () => {
    const Demo = () => {
      const [value, setValue] = React.useState<string | number>(null);

      return <InputNumber precision={1} cutOnly={true} value={value} onChange={setValue} />;
    };

    const { container } = render(<Demo />);
    const input = container.querySelector('input');

    // React use SyntheticEvent to handle `onBeforeInput`, let's mock this
    fireEvent.keyPress(input, {
      which: KeyCode.TWO,
      keyCode: KeyCode.TWO,
      char: '2',
    });
    fireEvent.keyPress(input, {
      which: KeyCode.PERIOD,
      keyCode: KeyCode.PERIOD,
      char: '.',
    });
    fireEvent.keyPress(input, {
      which: KeyCode.TWO,
      keyCode: KeyCode.TWO,
      char: '2',
    });
    fireEvent.keyPress(input, {
      which: KeyCode.FIVE,
      keyCode: KeyCode.FIVE,
      char: '5',
    });

    fireEvent.change(input, {
      target: {
        value: '2.2',
      },
    });

    expect(input.value).toEqual('2.2');
  });
});
