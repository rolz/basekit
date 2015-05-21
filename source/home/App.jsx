'use strict'

var {RouteHandler} = Router,
TodoActions = require('../actions/TodoActions.jsx'),
TodoStore = require('../stores/TodoStore.jsx'),
TodoHeader = require('./components/Header'),
TodoFooter = require('./components/Footer'),

App = React.createClass({
  mixins: [Reflux.connect(TodoStore, 'list')],
  componentDidMount: function () {
    TodoActions.load();
  },
  render() {
    return (
      <div>
        <TodoHeader />
        <RouteHandler {...this.props} list={this.state.list}/>
        <TodoFooter list={this.state.list} />
      </div>
    );
  }
});

module.exports = App;
