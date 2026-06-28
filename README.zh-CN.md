<div align="center">
  <h1>@rc-component/input-number</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🔢 React 数字输入组件，支持格式化、精度、步进和键盘交互。</p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>


<div align="center">

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url] [![dumi][dumi-image]][dumi-url]

</div>


## 特性

- 受控和非受控数字输入模式。
- 小数精度、自定义解析器、格式化程序和小数分隔符支持。
- 支持键盘步进、鼠标滚轮步进和自定义步进处理。
- 支持前缀、后缀、步进控制器和语义化 `classNames` / `styles` 插槽。
- TypeScript 通用值类型用于基于数字和字符串的值流。

## 安装

```bash
npm install @rc-component/input-number
```

## 使用

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

## 示例

运行本地 dumi 站点：

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

### InputNumber

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| autoFocus | `boolean` | `false` | 安装后聚焦输入。 |
| changeOnBlur | `boolean` | `true` | 提交模糊值的变化。 |
| changeOnWheel | `boolean` | `false` | 允许通过鼠标滚轮更改值。 |
| className | `string` | - | 根元素的 className。 |
| classNames | `Partial<Record<SemanticName, string>>` | - | 输入数字槽的语义 className。 |
| controls | `boolean` | `true` | 显示增量和减量控件。 |
| decimalSeparator | `string` | - | 显示格式化程序使用的小数分隔符。 |
| defaultValue | `T` | - | 初始值。 |
| disabled | `boolean` | `false` | 禁用输入。 |
| downHandler | `ReactNode` | - | 自定义减量控制。 |
| formatter | `(value: T \| undefined, info: { userTyping: boolean; input: string }) => string` | - | 设置显示值的格式。 |
| inputMode | `string` | - | 本机输入 `inputMode` 属性。 |
| keyboard | `boolean` | `true` | 启用键盘步进。 |
| max | `T` | - | 最大值。 |
| min | `T` | - | 最小值。 |
| mode | `'input' \| 'spinner'` | `input` | 渲染模式。 |
| parser | `(displayValue: string \| undefined) => T` | - | 将显示的值解析回一个值。 |
| precision | `number` | - | 显示精度。 |
| prefix | `ReactNode` | - | 前缀内容。 |
| prefixCls | `string` | `rc-input-number` | className 前缀。 |
| readOnly | `boolean` | `false` | 将输入标记为只读。 |
| step | `number \| string` | `1` | 步长。 |
| stringMode | `boolean` | `false` | 将值保留为字符串以获得高精度小数。 |
| style | `React.CSSProperties` | - | 根元素的内联样式。 |
| styles | `Partial<Record<SemanticName, React.CSSProperties>>` | - | 输入数字槽的语义样式。 |
| suffix | `ReactNode` | - | 后缀内容。 |
| upHandler | `ReactNode` | - | 自定义增量控制。 |
| value | `T \| null` | - | 受控值。 |
| onChange | `(value: T \| null) => void` | - | 当提交的值改变时触发。 |
| onInput | `(text: string) => void` | - | 当原始输入文本更改时触发。 |
| onPressEnter | `React.KeyboardEventHandler<HTMLInputElement>` | - | 当按下 Enter 时触发。 |
| onStep | `(value: T, info: { offset: number \| string; type: 'up' \| 'down'; emitter: 'handler' \| 'keyboard' \| 'wheel' }) => void` | - | 当值逐步变化时触发。 |

除非上方明确覆盖，也支持 `id`, `name`, `placeholder`, `required`, `readOnly`, and `tabIndex` 等原生 input 属性。

### Ref

```tsx | pure
import InputNumber, { type InputNumberRef } from '@rc-component/input-number';

const ref = React.useRef<InputNumberRef>(null);

ref.current?.focus();
ref.current?.blur();
```

| 参数      | 类型                                    | 说明          |
| ------------- | --------------------------------------- | -------------------- |
| focus | `(options?: InputFocusOptions) => void` | 集中输入。 |
| blur | `() => void` | 模糊输入。 |
| nativeElement | `HTMLElement`                           | 根原生元素。 |

## 键盘与滚轮

- 上箭头和下箭头会按 `step` 改变数值。
- `Shift + Arrow` 将值更改为 `10 * step`。
- `Ctrl` / `Command + Arrow` 将值更改为`0.1 * step`。
- 鼠标滚轮改值需要通过 `changeOnWheel` 显式开启。

## 本地开发

```bash
npm install
npm start
npm test
npm run tsc
npm run compile
npm run build
```

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/input-number 基于 [MIT](./LICENSE) 许可证发布。

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
