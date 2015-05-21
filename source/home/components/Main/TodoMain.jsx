'use strict'

var util = require('../../../lib/util.jsx'),
logger = Logger.get('TodoMain'),

TodoActions = require('../../../actions/TodoActions.jsx'),

TodoItem = require('../Item'),
// Renders the todo list as well as the toggle all button
    // Used in TodoApp
TodoMain = React.createClass({
  mixins: [ Router.State ],
  propTypes: {
      list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  },
  toggleAll(evt) {
      TodoActions.toggleAllItems(evt.target.checked);
  },
  render() {
      var filteredList;
      switch(this.getPath()){
          case '/completed':
              filteredList = _.filter(this.props.list,function(item){ return item.isComplete; });
              break;
          case '/active':
              filteredList = _.filter(this.props.list,function(item){ return !item.isComplete; });
              break;
          default:
              filteredList = this.props.list;
      }
      var classes = React.addons.classSet({
          "hidden": this.props.list.length < 1
      });
      return (
          <section id="main" className={classes}>
              <input id="toggle-all" type="checkbox" onChange={this.toggleAll} />
              <label htmlFor="toggle-all">Mark all as complete</label>
              <ul id="todo-list">
                  { filteredList.map(function(item){
                      return <TodoItem label={item.label} isComplete={item.isComplete} id={item.key} key={item.key}/>;
                  })}
              </ul>
          </section>
      );
  }
});

module.exports = TodoMain;
