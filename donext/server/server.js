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

/* When the server starts up...
------------------------------------------------------------ */

Meteor.startup(function() {
	// Create some database entries if they don't exist
    if (Lists.find().count() === 0) {
    	var lists = [
    		'Work',
    		'School',
    		'Just Landed',
    		'Shopping',
    		'Home',
    		'Christmas',
    		'Finances'
    	];
               
    	for (var i = 0; i < lists.length; i++) {
    		Lists.insert({
    			name: lists[i],
    			dateCreated: new Date()
    		});
    	}
    }
});