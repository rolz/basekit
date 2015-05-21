'use strict';

var _ = require('lodash'),
  util = require('../lib/util.jsx'),
  config = require('../../json/config'),
  logger = Logger.get('TodoStore'),
  request = require('superagent'),
  TodoActions = require('../actions/TodoActions.jsx'),
  socket,

  todoCounter = 0,

TodoListStore = Reflux.createStore({
  listenables: [TodoActions],
  init: function () {
    this.listenTo(TodoActions.load, this.fetchData);
  },

  // this will be called by all listening components as they register their listeners
  getInitialState: function() {
    this.list = [];
    return this.list;
  },

  fetchData: function () {

    var self = this;

    /* Get list of todos from api */
    request.get(config.api.urlParam, function (res) {

      var loadedList = res.body,
        length = loadedList.length;

      if (length !== 0) {

        // set todoCounter to match keys in db
        todoCounter = res.body[length-1]['id'];

         self.list = _.map(loadedList, function(item) {

           // just resetting the properties for each todo item
           var todo = {
             key: item.id,
             created: item.created,
             label: item.title,
             isComplete: item.completed
           }

           return todo;

         });
      } else {
        /* reset db key to start at 1 */
        request.put(config.api.urlParam + '/reset', function () {
          console.log('reset db');
        });
      }

      self.trigger(self.list);

    });


  },

  onEditItem: function(itemKey, newLabel) {
    var self = this,
    foundItem = getItemByKey(this.list,itemKey);
    if (!foundItem) {
        return;
    }

    foundItem.label = newLabel;

    request.patch(config.api.urlParam + '/' + itemKey, {title: foundItem.label}, function () {
      console.log('editing todo');
      self.updateList(self.list);
    });

  },
  onAddItem: function(text) {
    console.log("new todo: "+ text);
    todoCounter++

    var self = this,
      order = todoCounter,
      createdAt = new Date(),
      todo = {
        key: order,
        created: createdAt,
        isComplete: false,
        label: text
      }

    /* Post new todo to server */
    request.post(config.api.urlParam,{title: text, order: order, created: createdAt}, function (res) {
      console.log(res);
      self.updateList([todo].concat(self.list));
    });

  },
  onRemoveItem: function(itemKey) {

    var self = this;

    /* Remove todo from db */
    request.del(config.api.urlParam + '/' + itemKey, function (res) {

      /* remove todo from DOM */
      self.updateList(_.filter(self.list,function(item){
          return item.key!==itemKey;
      }));

    });

  },
  onToggleItem: function(itemKey) {
    var self = this,
      foundItem = getItemByKey(this.list,itemKey);

    if (foundItem) {
      foundItem.isComplete = !foundItem.isComplete;

      request.patch(config.api.urlParam + '/' + itemKey, {completed: foundItem.isComplete}, function () {
        console.log('toogle complete todo');
        self.updateList(self.list);
      });
    }
  },
  onToggleAllItems: function(checked) {

    /* iterate through todo items */
    this.updateList(_.map(this.list, function(item) {

      /* toggle todo in DOM */
      item.isComplete = checked;

      /* toggle completed in db */
      request.patch(config.api.urlParam + '/' + item.key, {completed: item.isComplete}, function () {
        console.log('toogle complete todo');
      });

      return item;

    }));

  },
  onClearCompleted: function() {
    var self = this;

    /* Remove all todos from db */
    request.del(config.api.urlParam, function (res) {

      /* remove all todos from DOM */
      self.updateList(_.filter(self.list, function(item) {
        return !item.isComplete;
      }));

    });

  },
  // called whenever we change a list. normally this would mean a database API call
  updateList: function(list){
    this.list = list;
    this.trigger(list); // sends the updated list to all listening components (TodoApp)
  }

});

// helper
function getItemByKey(list,itemKey){
  return _.find(list, function(item) {
      return item.key === itemKey;
  });
}

module.exports = TodoListStore;
