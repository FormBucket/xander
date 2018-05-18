// mock browser globals

var historyQueue = [];

let windowCallbacks = {};
global.window = {
  location: {
    pathname: "/",
    search: "",
    hash: ""
  },
  addEventListener: (name, cb) => {
    windowCallbacks[name] = cb;
  }
};

function* goBack() {
  var item = historyQueue[historyQueue.length - 2];
  window.location.pathname = item.path;
  window.location.search = item.search;
  windowCallbacks.popstate(item);
  historyQueue = historyQueue.slice(0, -1);

  // yield 3 times; once for each promise in redirectPath
  yield Promise.resolve();
  yield Promise.resolve();
  yield Promise.resolve();
}

global.document = {
  title: "test"
};

global.history = {
  pushState: (state, title, path) => {
    var tmp = path.split("?");

    window.location.pathname = tmp[0];
    window.location.search = tmp[1] ? "?" + tmp[1] : "";
    historyQueue.push({
      state,
      title,
      path: tmp[0],
      search: window.location.search
    });
  },
  replaceState: (state, title, path) => {
    var tmp = path.split("?");

    window.location.pathname = tmp[0];
    window.location.search = tmp[1] ? "?" + tmp[1] : "";
    historyQueue[historyQueue.length - 1] = {
      state,
      title,
      path: tmp[0],
      search: window.location.search
    };
  }
};

// run tests
var test = require("tape-async");
var React = require("react");
var ReactDom = require("react-dom/server");

var testComponent = props => (
  <div>
    path: {props.location.pathname}. params:{" "}
    {JSON.stringify(props.router.params)}. search: {props.location.search}
  </div>
);

var pageNotFound = props => <div>not found</div>;

var {
  app,
  loadContent,
  createStore,
  dispatch,
  router,
  Link,
  Container
} = require("../lib/index");

let routes = [
  {
    path: "/",
    component: testComponent
  },
  {
    path: "/buckets",
    component: testComponent
  },
  {
    path: "/buckets/:account_id",
    component: testComponent
  },
  {
    path: "/buckets/:account_id/settings",
    component: testComponent
  },
  {
    path: "*",
    component: pageNotFound
  }
];

let App = app({ routes });

test("Exports are correct type", function(t) {
  t.plan(3);
  t.equal(typeof router, "object");
  t.equal(typeof Link, "function");
  t.equal(typeof Container, "function");
});

test("Location includes valid exports", function(t) {
  t.plan(3);
  t.equal(router.name, "router");
  t.equal(typeof router.open, "function");
  t.equal(typeof router.redirect, "function");
});

test("Router includes valid exports", function(t) {
  t.plan(1);
  t.equal(router.name, "router");
});

test("Link renders correctly", function(t) {
  t.plan(1);
  var str = ReactDom.renderToStaticMarkup(<Link to="/bar" />);
  t.equal(str, '<a href="/bar"></a>');
});

test("Empty container renders the initial page view", function(t) {
  t.plan(1);
  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );
  t.equal(str, "<div>path: /. params: {}. search: </div>");
});

test("location.open(path) works correctly", function*(t) {
  t.plan(8);

  // console.log(router.getState(), location.getState())
  var result = yield router.open("/buckets/456/settings");
  // console.log(router.getState().content)
  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );
  t.equal(
    str,
    "<div>path: /buckets/456/settings. params: {&quot;account_id&quot;:&quot;456&quot;}. search: </div>"
  );

  var result = yield router.open("/buckets/123");

  t.equal(window.location.pathname, "/buckets/123");

  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );
  t.equal(
    str,
    "<div>path: /buckets/123. params: {&quot;account_id&quot;:&quot;123&quot;}. search: </div>"
  );

  var result = yield router.open("/buckets");

  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );
  t.equal(str, "<div>path: /buckets. params: {}. search: </div>");

  // default (not found) page is loaded.
  var result = yield router.open("/foo");
  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );
  t.equal(str, "<div>not found</div>");

  var oneStore = createStore("One", { getInitialState: () => 1 });

  // query strings work correctly
  var result = yield router.open("/?q=test");
  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );
  t.equal(str, "<div>path: /. params: {}. search: ?q=test</div>");

  var newStore = createStore("CountStore", (state = 1) => 1);

  yield goBack();

  t.equal(window.location.pathname, "/foo");
  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );
  t.equal(str, "<div>not found</div>");
});

test("check replace routes", function*(t) {
  t.plan(2);

  router.loadRoutes([
    {
      path: "/",
      component: testComponent
    },
    {
      path: "/foo",
      component: testComponent
    },
    {
      path: "*",
      component: pageNotFound
    }
  ]);

  var result = yield router.open("/foo");
  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );

  t.equal(str, "<div>path: /foo. params: {}. search: </div>");

  var result = yield router.open("/bar");
  // console.log()
  var str = ReactDom.renderToStaticMarkup(
    <Container
      router={router.getState()}
      location={router.getState().location}
    />
  );

  t.equal(str, "<div>not found</div>");
});

// connect tests

var { connect, createStore, dispatch } = require("../lib/index");

test("api tests", function(t) {
  t.plan(1);

  t.equals(typeof connect, "function");
});

var CounterStore = createStore(
  "CounterStore",
  (state = { count: 0 }, action) => {
    switch (action.type) {
      case "increment":
        return { count: state.count + 1 };
      default:
        return state;
    }
  }
);

test("connectStore works as expected", function(t) {
  t.plan(2);

  var CounterView = props => (
    <div>
      {props.foo} - {props.CounterStore.count}
    </div>
  );

  var EnhancedCounterView = connect(CounterView);

  var str = ReactDom.renderToStaticMarkup(<EnhancedCounterView foo="bar" />);
  t.equals(str, "<div>bar - 0</div>");

  dispatch("increment");

  var str = ReactDom.renderToStaticMarkup(<EnhancedCounterView foo="bar" />);
  t.equals(str, "<div>bar - 1</div>");
});
