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

// Todo items are showing
Session.set('showingTodoItems');

/* Globals
------------------------------------------------------------ */

var listItemsEle;
var touchStartX;

/* Prevent default dragging behavior
------------------------------------------------------------ */

function preventBehavior(event) {
	event.preventDefault(); 
};

/* Running on the client...
------------------------------------------------------------ */

if (Meteor.isClient) {
	// DOM is ready
	Meteor.startup(function() {
		listItemsEle = document.getElementById('list-items');
		
		document.addEventListener('touchmove', preventBehavior, false);
	});
	
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
	
	// Show or hide list items
	Template.list_items.preserve(['#list-items']); // Preserved for animation
	
	Template.list_items.isShowing = function() {
		return Session.equals('showingTodoItems', true) ? 'slide-view' : '';
	};
	
	// Return all todo lists
	Template.todo_lists.lists = function() {
		return Lists.find();
	};
	
	// Todo List Template Events
	Template.todo_lists.events({
		'click': function(event) {
			// Prevent default link action
			event.preventDefault();
			
			// Update the currently selected todo list
			Session.set('currentTodoList', this._id);
			
			// Now showing todo items...
			Session.set('showingTodoItems', true);
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
		return Items.find({ 'parentListId': Session.get('currentTodoList') });
	};
	
	// List Items Template Events
	Template.list_items.events({
		'touchstart': function(event) {
			touchStartX = event.targetTouches[0];
		},
		
		'touchmove': function(event) {
			var curX = event.targetTouches[0].pageX;
			
			event.targetTouches[0].target.style.webkitTransform = 'translateX(' + curX + 'px)';
		},
		
		'touchend': function(event) {
			// If the drag is ended early, move it to the far right
			listItemsEle.style.webkitTransform = 'translateX(320px)';
			
			// Now showing list items...
			Session.set('showingTodoItems', false);
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
				Lists.insert({ name: lists[i] });
			}
		}
	});
}