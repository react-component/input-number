<div align="center">
  <h1>@rc-component/input-number</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Part of the Ant Design ecosystem.</sub></p>
  <p>🔢 Accessible React number input with precision, formatting, keyboard, and wheel support.</p>
</div>

<p align="center">English | <a href="./README.zh-CN.md">简体中文</a></p>


<div align="center">

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url] [![dumi][dumi-image]][dumi-url]

</div>


## Highlights

- Controlled and uncontrolled numeric input modes.
- Decimal precision, custom parser, formatter, and decimal separator support.
- Keyboard stepping, mouse wheel stepping, and custom step handlers.
- Prefix, suffix, spinner controls, and semantic `classNames` / `styles` slots.
- TypeScript generic value typing for number and string based value flows.

## Install

```bash
npm install @rc-component/input-number
```

## Usage

```tsx | pure
import InputNumber from '@rc-component/input-number';

export default () => <InputNumber min={0} max={100} defaultValue={10} />;
```

```tsx | pure
import InputNumber from '@rc-component/input-number';

export default () => (
  <InputNumber
    stringMode
    formatter={(value) => `$ ${value}`}
    parser={(displayValue) => displayValue?.replace(/\$\s?/g, '') || ''}
  />
);
```

## Examples

Run the examples locally:

```bash
npm install
npm start
```

Online preview: https://input-number.vercel.app/

## API

### InputNumber

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| autoFocus | `boolean` | `false` | Focus the input when mounted. |
| changeOnBlur | `boolean` | `true` | Commit value changes on blur. |
| changeOnWheel | `boolean` | `false` | Allow value changes from the mouse wheel. |
| className | `string` | - | Class name for the root element. |
| classNames | `Partial<Record<SemanticName, string>>` | - | Semantic class names for input-number slots. |
| controls | `boolean` | `true` | Show increment and decrement controls. |
| decimalSeparator | `string` | - | Decimal separator used by the display formatter. |
| defaultValue | `T` | - | Initial value. |
| disabled | `boolean` | `false` | Disable the input. |
| downHandler | `ReactNode` | - | Custom decrement control. |
| formatter | `(value: T \| undefined, info: { userTyping: boolean; input: string }) => string` | - | Format the displayed value. |
| inputMode | `string` | - | Native input `inputMode` attribute. |
| keyboard | `boolean` | `true` | Enable keyboard stepping. |
| max | `T` | - | Maximum value. |
| min | `T` | - | Minimum value. |
| mode | `'input' \| 'spinner'` | `input` | Render mode. |
| parser | `(displayValue: string \| undefined) => T` | - | Parse the displayed value back to a value. |
| precision | `number` | - | Display precision. |
| prefix | `ReactNode` | - | Prefix content. |
| prefixCls | `string` | `rc-input-number` | Class name prefix. |
| readOnly | `boolean` | `false` | Mark the input as read only. |
| step | `number \| string` | `1` | Step size. |
| stringMode | `boolean` | `false` | Keep values as strings for high precision decimals. |
| style | `React.CSSProperties` | - | Inline styles for the root element. |
| styles | `Partial<Record<SemanticName, React.CSSProperties>>` | - | Semantic styles for input-number slots. |
| suffix | `ReactNode` | - | Suffix content. |
| upHandler | `ReactNode` | - | Custom increment control. |
| value | `T \| null` | - | Controlled value. |
| onChange | `(value: T \| null) => void` | - | Triggered when the committed value changes. |
| onInput | `(text: string) => void` | - | Triggered when the raw input text changes. |
| onPressEnter | `React.KeyboardEventHandler<HTMLInputElement>` | - | Triggered when Enter is pressed. |
| onStep | `(value: T, info: { offset: number \| string; type: 'up' \| 'down'; emitter: 'handler' \| 'keyboard' \| 'wheel' }) => void` | - | Triggered when the value changes by step. |

Native input attributes such as `id`, `name`, `placeholder`, `required`, `readOnly`, and `tabIndex` are also supported unless explicitly overridden above.

### Ref

```tsx | pure
import InputNumber, { type InputNumberRef } from '@rc-component/input-number';

const ref = React.useRef<InputNumberRef>(null);

ref.current?.focus();
ref.current?.blur();
```

| Property      | Type                                    | Description          |
| ------------- | --------------------------------------- | -------------------- |
| focus         | `(options?: InputFocusOptions) => void` | Focus the input.     |
| blur          | `() => void`                            | Blur the input.      |
| nativeElement | `HTMLElement`                           | Root native element. |

## Keyboard And Wheel

- Arrow up and Arrow down change the value by `step`.
- `Shift + Arrow` changes the value by `10 * step`.
- `Ctrl` / `Command + Arrow` changes the value by `0.1 * step`.
- Mouse wheel changes are opt-in through `changeOnWheel`.

## Development

```bash
npm install
npm start
npm test
npm run tsc
npm run compile
npm run build
```

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## License

@rc-component/input-number is released under the [MIT](./LICENSE.md) license.

[npm-image]: https://img.shields.io/npm/v/@rc-component/input-number.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@rc-component/input-number
[github-actions-image]: https://github.com/react-component/input-number/actions/workflows/react-component-ci.yml/badge.svg
[github-actions-url]: https://github.com/react-component/input-number/actions/workflows/react-component-ci.yml
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/input-number/master.svg?style=flat-square
[codecov-url]: https://app.codecov.io/gh/react-component/input-number
[download-image]: https://img.shields.io/npm/dm/@rc-component/input-number.svg?style=flat-square
[download-url]: https://npmjs.org/package/@rc-component/input-number
[bundlephobia-url]: https://bundlephobia.com/package/@rc-component/input-number
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/@rc-component/input-number?style=flat-square
[dumi-url]: https://github.com/umijs/dumi
[dumi-image]: https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square
