// mock browser globals

var historyQueue = []

let windowCallbacks = {}
global.window = {
  location: {
    pathname: '/',
    search: '',
    hash: ''
  },
  addEventListener: (name, cb) => {
    windowCallbacks[name] = cb
  }
}

function* goBack() {
  var item = historyQueue[historyQueue.length-2]
  window.location.pathname = item.path
  window.location.search = item.search
  windowCallbacks.popstate(item)
  historyQueue = historyQueue.slice(0, -1)

  // yield 3 times; once for each promise in redirectPath
  yield Promise.resolve()
  yield Promise.resolve()
  yield Promise.resolve()
}

global.document = {
  title: 'test'
}


global.history = {
  pushState: (state, title, path) => {
    var tmp = path.split('?')

    window.location.pathname = tmp[0]
    window.location.search = tmp[1] ? '?' + tmp[1] : ''
    historyQueue.push( { state, title, path: tmp[0], search: window.location.search } )
  },
  replaceState: (state, title, path) => {
    var tmp = path.split('?')

    window.location.pathname = tmp[0]
    window.location.search = tmp[1] ? '?' + tmp[1] : ''
    historyQueue[historyQueue.length-1] =  { state, title, path: tmp[0], search: window.location.search  }
  },
}

// run tests
var test = require('tape-async');
var React = require('react')
var ReactDom = require('react-dom/server')

var testComponent = (props) => {
  var loc = location.getState()
  return <div>path: {loc.path}. params: {JSON.stringify(props.router.params)}. search: {loc.search}</div>
}

var pageNotFound = () => <div>not found</div>

var {createStore, dispatch, promiseAction} = require('pure-flux')
var router = require('./src/index')
var {location, loadContent, promiseContent, loadRoutes, Link, Container} = require('./src/index')


loadRoutes([{
    path: '/',
    load: promiseContent(testComponent)
  }, {
    path: '/buckets',
    load: promiseContent(testComponent)
  }, {
    path: '/buckets/:account_id',
    load: promiseContent(testComponent)
  }, {
    path: '/buckets/:account_id/settings',
    load: promiseContent(testComponent)
  }, {
    path: '*',
    load: promiseContent(pageNotFound)
  }])


test( 'Exports are correct type', function(t) {
  t.plan(4)
  t.equal(typeof location, 'object')
  t.equal(typeof router, 'object')
  t.equal(typeof Link, 'function')
  t.equal(typeof Container, 'function')
})

test( 'Location includes valid exports', function(t) {
  t.plan(3)
  t.equal(location.name, 'location')
  t.equal(typeof location.open, 'function')
  t.equal(typeof location.redirect, 'function')
})

test( 'Router includes valid exports', function(t) {
  t.plan(1)
  t.equal(router.name, 'router')
})


  test( 'Link renders correctly', function(t) {
  t.plan(1)
  var str = ReactDom.renderToStaticMarkup(<Link to="/bar" />)
  t.equal(str, '<a href="/bar"></a>')
})


test( 'Empty container renders...well empty', function(t) {
  t.plan(1)
  var str = ReactDom.renderToStaticMarkup(<Container router={router.getState()} location={location.getState()} />)
  t.equal(str, '')
})


test( 'location.open(path) works correctly', function* (t) {
  t.plan(8)

  var result = yield location.open('/buckets/456/settings')


  var str = ReactDom.renderToStaticMarkup(<Container router={router.getState()} location={location.getState()}  />)
  t.equal(str, '<div>path: /buckets/456/settings. params: {&quot;account_id&quot;:&quot;456&quot;}. search: </div>')

  var result = yield location.open('/buckets/123')

  t.equal( window.location.pathname, '/buckets/123')

  var str = ReactDom.renderToStaticMarkup(<Container router={router.getState()} location={location.getState()}  />)
  t.equal(str, '<div>path: /buckets/123. params: {&quot;account_id&quot;:&quot;123&quot;}. search: </div>')

  var result = yield location.open('/buckets')

  var str = ReactDom.renderToStaticMarkup(<Container router={router.getState()} location={location.getState()}  />)
  t.equal(str, '<div>path: /buckets. params: {}. search: </div>')

  // default (not found) page is loaded.
  var result = yield location.open('/foo')
  var str = ReactDom.renderToStaticMarkup(<Container router={router.getState()} location={location.getState()}  />)
  t.equal(str, '<div>not found</div>')

  var oneStore = createStore("One", { getInitialState: () => 1 })

  // query strings work correctly
  var result = yield location.open('/?q=test')
  var str = ReactDom.renderToStaticMarkup(<Container router={router.getState()} location={location.getState()}  />)
  t.equal(str, '<div>path: /. params: {}. search: ?q=test</div>')

  var newStore = createStore('CountStore', (state=1) => 1)

  yield goBack();

  t.equal( window.location.pathname, '/foo')
  var str = ReactDom.renderToStaticMarkup(<Container router={router.getState()} location={location.getState()} />)
  t.equal(str, '<div>not found</div>')

})

test( 'check replace routes', function* (t) {
  t.plan(2)

  loadRoutes([{
    path: '/',
    load: promiseContent(testComponent)
  }, {
    path: '/foo',
    load: promiseContent(testComponent)
  }, {
    path: '*',
    load: promiseContent(pageNotFound)
  }])


  var result = yield location.open('/foo')
  var str = ReactDom.renderToStaticMarkup(<Container router={router.getState()} location={router.getState()} />)
  t.equal(str, '<div>path: /foo. params: {}. search: </div>')

  var result = yield location.open('/buckets')
  var str = ReactDom.renderToStaticMarkup(<Container location={location.getState()} router={router.getState()} />)
  t.equal(str, '<div>not found</div>')

})
