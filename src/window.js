/**
 * Copyright (c) 2015-2018, JC Fisher
 */

import { createStore, dispatch } from "fluxury";

let getWindow = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  scrollX: window.scrollX,
  scrollY: window.scrollY
});

let windowStore = createStore("window", {
  getInitialState: getWindow,
  windowOnResize: (state, data) => data,
  windowOnScroll: (state, data) => data
});

function resize() {
  dispatch("windowOnResize", getWindow());
}

function scroll() {
  dispatch("windowOnScroll", getWindow());
}

window.onresize = resize;
window.onscroll = scroll;

export default windowStore;
