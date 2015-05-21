'use strict'

var util = require('../../../lib/util.jsx'),
logger = Logger.get('Dashboard'),
{ Link } = Router,
TodoActions = require('../../../actions/TodoActions.jsx'),



// Renders the bottom item count, navigation bar and clearallcompleted button
// Used in TodoApp
TodoFooter = React.createClass({
  propTypes: {
      list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  },
  render() {
      var nbrcompleted = _.filter(this.props.list, "isComplete").length,
          nbrtotal = this.props.list.length,
          nbrincomplete = nbrtotal-nbrcompleted,
          clearButtonClass = React.addons.classSet({hidden: nbrcompleted < 1}),
          footerClass = React.addons.classSet({hidden: !nbrtotal }),
          completedLabel = "Clear completed (" + nbrcompleted + ")",
          itemsLeftLabel = nbrincomplete === 1 ? " item left" : " items left";
      return (
          <footer id="footer" className={footerClass}>
              <span id="todo-count"><strong>{nbrincomplete}</strong>{itemsLeftLabel}</span>
              <ul id="filters">
                  <li>
                      <Link activeClassName="selected" to="All">All</Link>
                  </li>
                  <li>
                      <Link activeClassName="selected" to="Active">Active</Link>
                  </li>
                  <li>
                      <Link activeClassName="selected" to="Completed">Completed</Link>
                  </li>
              </ul>
              <button id="clear-completed" className={clearButtonClass} onClick={TodoActions.clearCompleted}>{completedLabel}</button>
          </footer>
      );
  }
});

module.exports = TodoFooter;
