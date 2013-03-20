'use strict';

app.view.MessageListView = Backbone.View.extend({

    initialize: function(args) {
        this.template = _.template(app.util.tpl.get('messagelist'));
		this.folder = args.folder;
		this.dao = args.dao;
    },

    render: function(eventName) {		
		var self = this,
			page = $(this.el);

		page.html(this.template(this.options));

		page.find('#refreshBtn').on('vmousedown', function() {			
			self.syncFolder();
		});

        return this;
    },

	/**
	 * Synchronize emails from the cloud
	 */
	syncFolder: function() {
		var self = this;
		
		$.mobile.loading('show', { text: 'Syncing...', textVisible: true });
		// sync from cloud
		this.dao.syncFromCloud(this.folder, function(res) {
			$.mobile.loading('hide');
			
			// check for error
			if (res && res.status) {
				alert('Syncing failed!');
				return;
			}
			
			// read local storage and add to list view
			self.loadItems();
		});
	},
	
	/**
	 * Load items from local storage
	 */
	loadItems: function() {
		var self = this,
			page = $(this.el),
			list = page.find('#message-list'),
			listItemArgs;
		
		$.mobile.loading('show', { text: 'decrypting...', textVisible: true });
		this.dao.listItems(this.folder, 0, 20, function(collection) {			
			// clear list
			list.html('');
			
			_.each(collection.models, function(email) {
				listItemArgs = {account: self.options.account, folder: self.folder, model: email};
				list.append(new app.view.MessageListItemView(listItemArgs).render().el);
			}, this);
			
			// refresh list view
			list.listview('refresh');			
			$.mobile.loading('hide');
		});
	}
	
});