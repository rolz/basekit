'use strict'

var util = require('../../../lib/util.jsx'),
logger = Logger.get('Dashboard'),

TodoActions = require('../../../actions/TodoActions.jsx'),

// Renders the headline and the form for creating new todos.
// Used in TodoApp
// Observe that the toogleall button is NOT rendered here, but in TodoMain (it is then moved up to the header with CSS)
TodoHeader = React.createClass({
    handleValueChange(evt) {
        var text = evt.target.value;
        if (evt.which === 13 && text) { // hit enter, create new item if field isn't empty
            TodoActions.addItem(text);
            evt.target.value = '';
        } else if (evt.which === 27) { // hit escape, clear without creating
            evt.target.value = '';
        }
    },
    render() {
        return (
            <header id="header">
                <h1>Todos</h1>
                <input id="new-todo" placeholder="What needs to be done?" autoFocus onKeyUp={this.handleValueChange}/>
            </header>
        );
    }
});

module.exports = TodoHeader;
