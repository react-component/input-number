global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
require('regenerator-runtime');

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {
  findInput() {
    return this.find('input');
  },
  changeValue(value, which) {
    this.findInput().simulate('keyDown', { which });
    this.findInput().simulate('change', { target: { value } });
    this.findInput().simulate('keyUp', { which });
    return this;
  },
  focusInput() {
    return this.findInput().simulate('focus');
  },
  blurInput() {
    return this.findInput().simulate('blur');
  },
  getInputValue() {
    return this.findInput().props().value;
  },
});
