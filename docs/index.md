---
hero:
  title: rc-input-number
  description: React InputNumber Component
---

## Install

```sh
# npm
npm install --save rc-input-number

# yarn
yarn install rc-input-number

# pnpm
pnpm i rc-input-number
```

## Usage

```ts
import InputNumber from 'rc-input-number';

export default () => <InputNumber defaultValue={10} />;
```

## Development

```sh
npm install
npm start
```

### Keyboard Navigation

- When you hit the ⬆ or ⬇ key, the input value will be increased or decreased by step
- With the Shift key (Shift+⬆, Shift+⬇), the input value will be changed by 10 * step
- With the Ctrl or ⌘ key (Ctrl+⬆ or ⌘+⬆ or Ctrl+⬇ or ⌘+⬇ ), the input value will be changed by 0.1 * step

## Test Case

```sh
npm test
```

## Coverage

```sh
npm run coverage
```

## License

rc-input-number is released under the MIT license.
