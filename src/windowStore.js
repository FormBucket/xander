import {createStore, dispatch} from 'fluxury';

let windowStore = createStore('window', {
  getInitialState: () => ({ width: window.innerWidth, height: window.innerHeight }),
  windowResized: (state, action) => ({ width: window.innerWidth, height: window.innerHeight })
});

function resize() {
  dispatch('windowResized')
}

window.onresize = resize;

export default windowStore;
