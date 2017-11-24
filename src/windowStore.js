import {createStore, dispatch} from 'fluxury';

let getSize = () => ({ width: window.innerWidth, height: window.innerHeight })
let windowStore = createStore('window', {
  getInitialState: () => ({ width: window.innerWidth, height: window.innerHeight }),
  windowResized: (state, data) => data
});

function resize() {
  dispatch('windowResized', getSize())
}

window.onresize = resize;

export default windowStore;
