function makeClassList() {
  const set = new Set();
  return {
    add: (c) => set.add(c),
    remove: (c) => set.delete(c),
    contains: (c) => set.has(c)
  };
}
function makeElement(id) {
  return {
    id: id,
    innerHTML: '',
    textContent: '',
    value: '',
    checked: false,
    classList: makeClassList(),
    appendChild: () => {},
    addEventListener: (evt, fn) => { global.__listeners = global.__listeners || {}; global.__listeners[id + ':' + evt] = fn; }
  };
}
const elements = {};
global.document = {
  getElementById: (id) => { if (!elements[id]) elements[id] = makeElement(id); return elements[id]; },
  querySelectorAll: () => [],
  createElement: () => makeElement('tmp')
};
