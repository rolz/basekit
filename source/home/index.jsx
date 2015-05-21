'use strict'

/*
 * React Router
 * A complete routing library for React.
 * https://github.com/rackt/react-router
 */

require('../style/main.scss');
require('./style.scss');

var util = require('../lib/util.jsx');
util.setLogger();

/*
 * Temporary context data.
 */
var context = require('../json/context');

var { Route, DefaultRoute, NotFoundRoute } = Router,
  TodoApp = require('./App.jsx'),
  TodoMain = require('./components/Main');

var routes = (
  <Route name="TodoApp" path="/" handler={TodoApp}>
    <Route name="All" path="/all" handler={TodoMain} />
    <Route name="Completed" path="/completed" handler={TodoMain} />
    <Route name="Active" path="/active" handler={TodoMain} />
    <DefaultRoute handler={TodoMain} />
    <NotFoundRoute handler={TodoMain} />
  </Route>
);

var router = Router.create({
  routes: routes,
  location: Router.HistoryLocation
});

router.run((Handler, state) => {
  /*
   * Dynamic Segments
   * We've used this alternative way to get params and for adding context.
   * You can access the params with this.props.params
   * https://github.com/rackt/react-router/blob/master/docs/guides/overview.md#dynamic-segments
   */
  var params = state.params || {},
    name = state.path.split('/')[2];
  params.name = name || 'Todos';
  params.state = state;
  params.context = _.extend(context.common, context.user[params.name]);
  React.render(<Handler params={params} />, document.getElementById('app'));
});
