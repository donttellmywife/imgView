const EE = require('event-emitter');

const bus = EE();
const state = {
  selectedImage: '',
  selectedRow: '',
  items: [],
};

const rootEl = document.querySelector('#root');
const update = (value) => {
  console.log(state);
  rootEl.innerHTML = value;
};
bus.on('update', update);
bus.emit('update', 'epic');
