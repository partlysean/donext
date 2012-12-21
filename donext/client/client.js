/* MongoDB Collections
------------------------------------------------------------ */

Lists = new Meteor.Collection('lists');
Items = new Meteor.Collection('items');

/* Sessions
------------------------------------------------------------ */

// Currently selected todo list
Session.set('currentTodoList');
Session.set('currentTodoListName');

// Todo items are showing
Session.set('showingTodoItems');

/* DOM is ready
------------------------------------------------------------ */

Meteor.startup(function() {
	/* Keyboard shortcuts
	------------------------------ */

	var alphabet = ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'W', 'w', 'X', 'x', 'Y', 'y', 'Z', 'z'];

	// Any alphabet key is pressed
	Mousetrap.bind(alphabet, function(event) {
		// Focus on the input
		document.addNew.addNew.focus();
	});

	// CTRL + L takes you back to lists
    Mousetrap.bind('ctrl+l', function(event) {
    	// Prevent default scroll action
    	event.preventDefault();
    	
    	// If we're looking at todo items, go back to the lists view
	    if (Session.equals('showingTodoItems', true)) {
	    	Session.set('showingTodoItems', false);
	    }
    });
});

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
    	Session.set('currentTodoListName', this.name);
    	
    	// Now showing todo items...
    	Session.set('showingTodoItems', true);
    }
});

/* Todo items
------------------------------ */

// Return the item to do next
Template.list_items.doNextItem = function() {
	return Items.findOne({ $and: [{ 'parentListId': Session.get('currentTodoList') }, { 'doNext': true }] });
};

// Return todo items that aren't ones to do next
Template.list_items.items = function() {
    return Items.find({ $and: [{ 'parentListId': Session.get('currentTodoList') }, { 'doNext': false }] });
};

/* Add new form
------------------------------ */

Template.add_new.addInputPlaceholder = function() {
    return Session.equals('showingTodoItems', true) ? 'Start typing to create a new ' + Session.get('currentTodoListName') + ' todo...' : 'Start typing to create a new list...';
}

Template.add_new.events({
    'submit': function(event) {
    	// Prevent default form action
    	event.preventDefault();
    	
    	var doNextBool;
    	
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
    		// If the list is empty, make the new item do next
    		if (Items.find({ 'parentListId': Session.get('currentTodoList') }).count() === 0) {
    			doNextBool = true;
    		}
    		else {
    			doNextBool = false;
    		}
    		
    		// Create a new todo item
        	Items.insert({
        	    description: inputData,
        	    parentListId: Session.get('currentTodoList'),
        	    dateCreated: new Date(),
        	    doNext: doNextBool
        	});
    	}
    	
    	// Clear field value
    	document.addNew.addNew.value = '';
    }
});