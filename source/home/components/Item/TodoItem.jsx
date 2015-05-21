'use strict'

var util = require('../../../lib/util.jsx'),
logger = Logger.get('Dashboard'),

TodoActions = require('../../../actions/TodoActions.jsx'),

// Renders a single Todo item in the list
    // Used in TodoMain
TodoItem = React.createClass({
    propTypes: {
        label: React.PropTypes.string.isRequired,
        isComplete: React.PropTypes.bool.isRequired,
        id: React.PropTypes.number
    },
    mixins: [React.addons.LinkedStateMixin], // exposes this.linkState used in render
    getInitialState() {
        return {};
    },
    handleToggle(evt) {
        TodoActions.toggleItem(this.props.id);
    },
    handleEditStart(evt) {
        evt.preventDefault();
        // because of linkState call in render, field will get value from this.state.editValue
        this.setState({
            isEditing: true,
            editValue: this.props.label
        }, function() {
            this.refs.editInput.getDOMNode().focus();
        });
    },
    handleValueChange(evt) {
        var text = this.state.editValue; // because of the linkState call in render, this is the contents of the field
        // we pressed enter, if text isn't empty we blur the field which will cause a save
        if (evt.which === 13 && text) {
            this.refs.editInput.getDOMNode().blur();
        }
        // pressed escape. set editing to false before blurring so we won't save
        else if (evt.which === 27) {
            this.setState({ isEditing: false },function(){
                this.refs.editInput.getDOMNode().blur();
            });
        }
    },
    handleBlur() {
        var text = this.state.editValue; // because of the linkState call in render, this is the contents of the field
        // unless we're not editing (escape was pressed) or text is empty, save!
        if (this.state.isEditing && text) {
            TodoActions.editItem(this.props.id, text);
        }
        // whatever the outcome, if we left the field we're not editing anymore
        this.setState({isEditing:false});
    },
    handleDestroy() {
        console.log(this.props.id);
        TodoActions.removeItem(this.props.id);
    },
    render() {
        var classes = React.addons.classSet({
            'completed': this.props.isComplete,
            'editing': this.state.isEditing
        });
        return (
            <li className={classes}>
                <div className="view">
                    <input className="toggle" type="checkbox" checked={!!this.props.isComplete} onChange={this.handleToggle} />
                    <label onDoubleClick={this.handleEditStart}>{this.props.label}</label>
                    <button className="destroy" onClick={this.handleDestroy}></button>
                </div>
                <input ref="editInput" className="edit" valueLink={this.linkState('editValue')} onKeyUp={this.handleValueChange} onBlur={this.handleBlur} />
            </li>
        );
    }
});

module.exports = TodoItem;
