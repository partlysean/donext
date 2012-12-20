/* MongoDB Collections
------------------------------------------------------------ */

Lists = new Meteor.Collection('lists');
// _id: Auto-generated MongoDB ID
// name: Name of the todo list
// dateCreated: Date the list was created

Items = new Meteor.Collection('items');
// _id: Auto-generated MongoDB ID
// description: Todo item text
// parentListId: The _id of a corresponding Lists entry
// dateCreated: Date the todo item was created

/* Sessions
------------------------------------------------------------ */

// Currently selected todo list
Session.set('currentTodoList');

// Todo items are showing
Session.set('showingTodoItems');

/* Globals
------------------------------------------------------------ */

// Global variables here

/* Running on the client...
------------------------------------------------------------ */

if (Meteor.isClient) {
	/* Show or hide items
	------------------------------ */
	
	Template.todo_lists.preserve(['#todo-lists']); // Preserved for animation
	Template.list_items.preserve(['#list-items']); // Preserved for animation
	
	Template.todo_lists.isShowing = function() {
		return Session.equals('showingTodoItems', true) ? 'slide-view' : '';
	};
	
	Template.list_items.isShowing = function() {
		return Session.equals('showingTodoItems', true) ? 'slide-view' : '';
	};
	
	/* Todo lists
	------------------------------ */
	
	// Return items from DB
	Template.todo_lists.lists = function() {
		return Lists.find({}, { sort: { dateCreated: -1 } });
	};
	
	// Template events
	Template.todo_lists.events({
		'click a': function(event) {
			// Prevent default link action
			event.preventDefault();
			
			// Update the currently selected todo list
			Session.set('currentTodoList', this._id);
			
			// Now showing todo items...
			Session.set('showingTodoItems', true);
		}
	});
	
	/* Todo items
	------------------------------ */
	
	// Return items from DB
	Template.list_items.items = function() {
		return Items.find({ 'parentListId': Session.get('currentTodoList') });
	};
	
	/* Add new form
	------------------------------ */
	
	Template.add_new.addInputPlaceholder = function() {
		return Session.equals('showingTodoItems', true) ? 'Start typing to create a new todo...' : 'Start typing to create a new list...';
	}
	
	Template.add_new.events({
		'submit': function(event) {
			// Prevent default form action
			event.preventDefault();
			
			// Get the input value
			var inputData = document.addNew.addNew.value;
			
			// If we're looking at todo lists...
			if (Session.equals('showingTodoItems')) {
				// Create a new todo list
				Lists.insert({
	    		    name: inputData,
	    		    dateCreated: new Date()
	    		});
			}
			else {
				// Create a new todo item
				Items.insert({
		    		description: inputData,
		    		parentListId: Session.get('currentTodoList'),
		    		dateCreated: new Date()
		    	});
			}
			
			// Clear field value
	    	document.addNew.addNew.value = '';
		}
	});
}

/* Running on the server...
------------------------------------------------------------ */

if (Meteor.isServer) {
	// Create some database entries if they don't exist
	Meteor.startup(function() {
	    if (Lists.find().count() === 0) {
			var lists = [
				'Work',
				'School',
				'Just Landed',
				'Shopping',
				'Home',
				'Christmas'
			];
                   
			for (var i = 0; i < lists.length; i++) {
				Lists.insert({ name: lists[i], dateCreated: new Date() });
			}
		}
	});
}