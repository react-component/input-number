---
title: API
nav:
  order: 10
  title: API
  path: /api
---

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
          <td>prefixCls</td>
          <td>string</td>
          <td>rc-input-number</td>
          <td>Specifies the class prefix</td>
        </tr>
        <tr>
          <td>min</td>
          <td>Number</td>
          <td></td>
          <td>Specifies the minimum value</td>
        </tr>
        <tr>
          <td>onClick</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>placeholder</td>
          <td>string</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>max</td>
          <td>Number</td>
          <td></td>
          <td>Specifies the maximum value</td>
        </tr>
        <tr>
          <td>step</td>
          <td>Number or String</td>
          <td>1</td>
          <td>Specifies the legal number intervals</td>
        </tr>
        <tr>
          <td>precision</td>
          <td>Number</td>
          <td></td>
          <td>Specifies the precision length of value</td>
        </tr>
        <tr>
          <td>disabled</td>
          <td>Boolean</td>
          <td>false</td>
          <td>Specifies that an InputNumber should be disabled</td>
        </tr>
        <tr>
          <td>focusOnUpDown</td>
          <td>Boolean</td>
          <td>true</td>
          <td>whether focus input when click up or down button</td>
        </tr>
        <tr>
          <td>required</td>
          <td>Boolean</td>
          <td>false</td>
          <td>Specifies that an InputNumber is required</td>
        </tr>
        <tr>
          <td>autoFocus</td>
          <td>Boolean</td>
          <td>false</td>
          <td>Specifies that an InputNumber should automatically get focus when the page loads</td>
        </tr>
        <tr>
          <td>readOnly</td>
          <td>Boolean</td>
          <td>false</td>
          <td>Specifies that an InputNumber is read only </td>
        </tr>
        <tr>
          <td>controls</td>
          <td>Boolean</td>
          <td>true</td>
          <td>Whether to enable the control buttons</td>
        </tr>
        <tr>
          <td>name</td>
          <td>String</td>
          <td></td>
          <td>Specifies the name of an InputNumber</td>
        </tr>
        <tr>
          <td>id</td>
          <td>String</td>
          <td></td>
          <td>Specifies the id of an InputNumber</td>
        </tr>
        <tr>
          <td>value</td>
          <td>Number</td>
          <td></td>
          <td>Specifies the value of an InputNumber</td>
        </tr>
        <tr>
          <td>defaultValue</td>
          <td>Number</td>
          <td></td>
          <td>Specifies the defaultValue of an InputNumber</td>
        </tr>
        <tr>
          <td>onChange</td>
          <td>Function</td>
          <td></td>
          <td>Called when value of an InputNumber changed</td>
        </tr>
        <tr>
            <td>onBlur</td>
            <td>Function</td>
            <td></td>
            <td>Called when user leaves an input field</td>
        </tr>
        <tr>
          <td>onPressEnter</td>
          <td>Function</td>
          <td></td>
          <td>The callback function that is triggered when Enter key is pressed.</td>
        </tr>
        <tr>
          <td>onFocus</td>
          <td>Function</td>
          <td></td>
          <td>Called when an element gets focus</td>
        </tr>
        <tr>
          <td>style</td>
          <td>Object</td>
          <td></td>
          <td>root style. such as {width:100}</td>
        </tr>
        <tr>
          <td>upHandler</td>
          <td>React.Node</td>
          <td></td>
          <td>custom the up step element</td>
        </tr>
        <tr>
          <td>downHandler</td>
          <td>React.Node</td>
          <td></td>
          <td>custom the down step element</td>
        </tr>
        <tr>
          <td>formatter</td>
          <td>(value: number|string): displayValue: string</td>
          <td></td>
          <td>Specifies the format of the value presented</td>
        </tr>
        <tr>
          <td>parser</td>
          <td>(displayValue: string) => value: number</td>
          <td>`input => input.replace(/[^\w\.-]*/g, '')`</td>
          <td>Specifies the value extracted from formatter</td>
        </tr>
        <tr>
          <td>pattern</td>
          <td>string</td>
          <td></td>
          <td>Specifies a regex pattern to be added to the input number element - useful for forcing iOS to open the number pad instead of the normal keyboard (supply a regex of "\d*" to do this) or form validation</td>
        </tr>
        <tr>
          <td>decimalSeparator</td>
          <td>string</td>
          <td></td>
          <td>Specifies the decimal separator</td>
        </tr>
        <tr>
          <td>inputMode</td>
          <td>string</td>
          <td></td>
          <td>Specifies the inputmode of input</td>
        </tr>
    </tbody>
</table>
