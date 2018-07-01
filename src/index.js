import EE from 'event-emitter';
import reducer from './reduce.js';

require('./index.sass');

const settings = {
  itemsInRow: 5,
};
const state = {
  x: 3,
  y: 3,
  items: [],
};
const ee = EE();
reducer(ee, state);

const makeEl = (data) => {
  const el = document.createElement('div');
  el.classList.add('image');
  el.innerText = data;

  return el;
};

const rootEl = document.querySelector('#root');
const render = ({ x, y, items }) => {
  const elements = items.map(makeEl);
  elements
    .map((el, index) => {
      // 0 -> 0, 0
      // 1 -> 1, 0
      // 2 -> 2, 0
      // 5 -> 5, 0
      if (x + (y * 5) === index) {
        console.log(index);
        el.classList.add('active');
      }
      return el;
    })
    .forEach((el) => rootEl.append(el));
};
ee.on('update', render);

// window.addEventListener('keyup', (event) => {
//   console.log(event);
// }, false);

// mock fetch data
const items = [];
for (let i = 0; i < 50; ++i) {
  items.push(i);
}
ee.emit('load', items);
