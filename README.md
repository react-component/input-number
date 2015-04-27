# rc-inputNumber
---

inputNumber ui component for react

[![NPM version][npm-image]][npm-url]
[![SPM version](http://spmjs.io/badge/rc-inputNumber)](http://spmjs.io/package/rc-inputNumber)
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![Sauce Test Status](https://saucelabs.com/buildstatus/rc-input-number)](https://saucelabs.com/u/rc-input-number)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/rc-input-number.svg)](https://saucelabs.com/u/rc-input-number)

[npm-image]: http://img.shields.io/npm/v/rc-inputNumber.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-inputNumber
[travis-image]: https://img.shields.io/travis/react-component/input-number.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/input-number
[coveralls-image]: https://img.shields.io/coveralls/react-component/input-number.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/input-number?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/input-number.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/input-number
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-inputNumber.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-inputNumber

## Screenshots

<img src="https://t.alipayobjects.com/images/T177xfXlplXXXXXXXX.png" width="288"/>


## Feature

* support ie8,ie8+,chrome,firefox,safari

### Keyboard



## install

[![rc-inputNumber](https://nodei.co/npm/rc-inputNumber.png)](https://npmjs.org/package/rc-inputNumber)

## Usage

```js
var RcinputNumber = require('rc-inputNumber');
var React = require('react');
React.render(<InputNum />, container);
```

## API

### props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>min</td>
          <td>Number</td>
          <td></td>
          <td>限制最小值</td>
        </tr>
        <tr>
          <td>max</td>
          <td>Number</td>
          <td></td>
          <td>限制最大值</td>
        </tr>
        <tr>
          <td>step</td>
          <td>Number</td>
          <td>1</td>
          <td>设置增加减少时的间隔，例如：step=0.5，则合法值1，1.5，2，2.5</td>
        </tr>
        <tr>
          <td>disabled</td>
          <td>Boolen</td>
          <td>false</td>
          <td>设置是否可用</td>
        </tr>
        <tr>
          <td>autofocus</td>
          <td>Boolen</td>
          <td>false</td>
          <td>设置页面加载时是否获得焦点</td>
        </tr>
        <tr>
          <td>required</td>
          <td>Boolen</td>
          <td>false</td>
          <td>设置是否必填</td>
        </tr>
        <tr>
          <td>readonly</td>
          <td>Boolen</td>
          <td>false</td>
          <td>设置是否只读</td>
        </tr>
        <tr>
          <td>name</td>
          <td>String</td>
          <td></td>
          <td>设置字段名</td>
        </tr>
        <tr>
          <td>value</td>
          <td>String</td>
          <td></td>
          <td>设置值</td>
        </tr>
    </tbody>
</table>

## Development

```
npm install
npm start
```

## Example

http://127.0.0.1:8000/examples/

online example: http://react-component.github.io/inputNumber/build/examples/

## Test Case

http://127.0.0.1:8000/tests/runner.html?coverage

## Coverage

http://127.0.0.1:8000/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://127.0.0.1:8000/tests/runner.html?coverage

## License

rc-inputNumber is released under the MIT license.
