import EE from 'event-emitter';

require('./index.sass');

const bus = EE();
const rootEl = document.querySelector('#root');
const settings = {
  itemsInRow: 5,
};
let state = {
  x: 0, // column
  y: 1, // row
  items: [],
};

const makeEl = (data) => {
  const el = document.createElement('div');
  el.classList.add('image');
  el.innerText = data;

  return el;
};

// mock items
const items = [];

const render = ({ x, y, items }) => {
  rootEl.innerHTML = '';
  const elements = items.map(makeEl);
  elements
    .map((el, index) => {
      // 0 -> 0, 0
      // 1 -> 1, 0
      // 2 -> 2, 0
      // 5 -> 0, 1
      if (x + (y * settings.itemsInRow) === index) {
        el.classList.add('active');
      }
      return el;
    })
    .forEach((el) => rootEl.append(el));
};

bus.on('update', (newState) => {
  state = newState;
  render(state);
});

bus.on('keyup', (keyCode) => {
  switch (keyCode) {
    // horizontal move (on columns)
    case 37:
      if (state.x === 0) { return state; }
      return bus.emit('update', { ...state, x: state.x - 1 });
    case 39:
      // items in row - 1
      if (state.x === settings.itemsInRow - 1) { return state; }
      return bus.emit('update', { ...state, x: state.x + 1 });

    // vertical move (on rows)
    case 38:
      if (state.y === 0) { return state; }
      return bus.emit('update', { ...state, y: state.y - 1 });
    case 40:
      // load items on prelast row
      if (state.y === ((state.items.length / settings.itemsInRow) - 3)) {
        bus.emit('update', { ...state, y: state.y + 1 });
        return bus.emit('load', state.items.concat(items));
      }

      // if it's last row - stop
      if (state.y === (state.items.length / settings.itemsInRow) - 1) {
        return state;
      }
      return bus.emit('update', { ...state, y: state.y + 1 });
    default:
      return state;
  }
});

bus.on('load', (items) => {
  bus.emit('update', { ...state, items });
});

window.addEventListener('keyup', ({ keyCode }) => {
  bus.emit('keyup', keyCode);
}, false);

// mock fetch data
// const items = [];
for (let i = 0; i < 50; ++i) {
  items.push(i);
}
bus.emit('load', items);
