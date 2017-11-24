import {createStore, dispatch} from 'fluxury';

let getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  scrollX: window.scrollX,
  scrollY: window.scrollY
});

let windowStore = createStore('window', {
  getInitialState: getSize,
  windowOnResize: (state, data) => data
});

function resize() {
  dispatch('windowOnResize', getSize());
}

window.onresize = resize;

export default windowStore;
