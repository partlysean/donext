/* MongoDB Collections
------------------------------------------------------------ */

Lists = new Meteor.Collection('lists');
// _id: Auto-generated MongoDB ID
// name: Name of the todo list

Items = new Meteor.Collection('items');
// _id: Auto-generated MongoDB ID
// description: Todo item text
// parentListId: The _id of a corresponding Lists entry

/* Sessions
------------------------------------------------------------ */

// Currently selected todo list
Session.set('currentTodoList');

/* Running on the client...
------------------------------------------------------------ */

if (Meteor.isClient) {
	// Add new todo list
	Template.add_todo_list.events({
		'submit': function(event) {
			// Prevent default form action
			event.preventDefault();
			
			// Save the input data
	    	var inputData = document.addTodoListForm.addTodoListInput.value;
	    	
	    	// Add new todo
	    	Lists.insert({ name: inputData });
	    	
	    	// Clear field value
	    	document.addTodoListForm.addTodoListInput.value = '';
		}
	});
	
	// Return all todo lists
	Template.todo_lists.lists = function() {
		return Lists.find();
	};
	
	// Todo List Template Events
	Template.todo_lists.events({
		'click': function() {
			Session.set('currentTodoList', this._id);
		}
	});
	
	// Add new todo item
	Template.add_todo_item.events({
		'submit': function(event) {
			// Prevent default form action
			event.preventDefault();
			
			// Save the input data
	    	var inputData = document.addTodoItemForm.addTodoItemInput.value;
	    	
	    	// If a list is selected...
	    	if (Session.get('currentTodoList')) {
	    		// Add new todo
		    	Items.insert({ description: inputData, parentListId: Session.get('currentTodoList') });
		    	
		    	// Clear field value
		    	document.addTodoItemForm.addTodoItemInput.value = '';
		    }
		    else {
		    	alert('You don\'t have a list selected');
		    }
		}
	});
	
	// Return currently selected todo list items	
	Template.list_items.items = function() {
		return Items.find({'parentListId': Session.get('currentTodoList')});
	};
}

/* Running on the server...
------------------------------------------------------------ */

if (Meteor.isServer) {
	// Do stuff on the server...
}