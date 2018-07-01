export default function (bus, state) {
  // bus.on('keydown', console.log);

  bus.on('load', (items) => {
    bus.emit('update', { ...state, items });
  });
}
