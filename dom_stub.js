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

// Minimaler Leaflet-Stub, nur um die Skriptlogik ohne echten Browser durchlaufen zu lassen
function makeLeafletObj() {
  const obj = {};
  obj.addTo = function() { return obj; };
  obj.setView = function() { return obj; };
  obj.bindPopup = function() { return obj; };
  obj.invalidateSize = function() { return obj; };
  return obj;
}
global.L = {
  map: function() { return makeLeafletObj(); },
  tileLayer: function() { return makeLeafletObj(); },
  marker: function() { return makeLeafletObj(); }
};

// Minimale Stubs für Dinge, die es in Node nicht gibt, aber im Browser schon
global.window = global;
global.alert = function(msg) { console.log('[alert]', msg); };
if (typeof global.Notification === 'undefined') {
  global.Notification = function(title, opts) {
    console.log('[Notification]', title, opts && opts.body);
  };
  global.Notification.permission = 'granted';
  global.Notification.requestPermission = function() { return Promise.resolve('granted'); };
}

// Minimaler localStorage-Stub für Node (echter Browser hat das eingebaut)
const __speicher = {};
global.localStorage = {
  getItem: function(key) { return Object.prototype.hasOwnProperty.call(__speicher, key) ? __speicher[key] : null; },
  setItem: function(key, value) { __speicher[key] = String(value); }
};
