import EE from 'event-emitter';

require('./index.sass');

// can be passed in module, if transform it to module
const settings = {
  maxItems: 5, // items in row
  maxRows: 3, // render rows
};

const bus = EE();
const rootEl = document.querySelector('#root');
let state = {
  x: 0, // column
  y: 0, // row
  items: [], // all loaded items
  scroll: window.pageYOffset, // start scroll position
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
      if (state.x === settings.maxItems - 1) { return state; }
      return bus.emit('update', { ...state, x: state.x + 1 });

    // vertical move (on rows)
    case 38:
      if (state.y === 0) { return state; }
      return bus.emit('update', { ...state, y: state.y - 1 });
    case 40:
      // load items on prelast row
      if (state.y === ((state.items.length / settings.maxItems) - 3)) {
        setTimeout(() => {
          bus.emit('load', state.items.concat(state.items));
        }, 1000);
        return bus.emit('update', { ...state, y: state.y + 1 });
      }

      // if it's last row - stop
      if (state.y === (state.items.length / settings.maxItems) - 1) {
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
});

// disable scroll on keydown
window.addEventListener('keydown', (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
});

// control scroll
window.addEventListener('scroll', (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  // detect direction of scroll
  const keyCode = state.scroll < window.pageYOffset ? 38 : 40;
  bus.emit('keyup', keyCode);
  state.scroll = window.pageYOffset;
});

// detect scroll direction
window.addEventListener('wheel', (event) => {
  const delta = event.wheelDelta ? event.wheelDelta : event.deltaY * -1;

  delta < 0 ? console.log('down') : console.log('up');
});

// rootEl.addEventListener('transitionend', () => {
// });


// helper functions
function makeEl(data) {
  const el = document.createElement('div');
  el.classList.add('image');
  el.setAttribute('style', `flex-basis: ${100 / settings.maxItems}%`);
  el.innerText = data;

  return el;
}

function render({ x, y, items }) {
  rootEl.innerHTML = '';
  const { maxItems, maxRows } = settings;
  const elements = items.map(makeEl);

  // item height * row
  // rootEl.setAttribute('style', `transform: translateY(${-100 * y}px)`);

  elements
    .map((el, index) => {
      // 0 -> 0, 0
      // 1 -> 1, 0
      // 2 -> 2, 0
      // 5 -> 0, 1
      if (x + (y * maxItems) === index) {
        el.classList.add('active');
      }
      return el;
    })
    // render only needed rows (3 from settings)
    .slice(y * maxItems, (y * maxItems) + (maxRows * maxItems))
    .forEach((el) => rootEl.append(el));
}


// mock fetch data
setTimeout(() => {
  const items = [];
  for (let i = 0; i < 50; ++i) {
    items.push(i);
  }
  bus.emit('load', items);
}, 1000);
