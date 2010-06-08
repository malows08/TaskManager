/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * UserManagement.AccessCopyPanel
 * @extends Ext.Panel
 *
 * This Panel contains an iframe for adding users from batch file
 * 
 */
TaskManager.ContentPanel = function(settings) {
	
	// INBOX
	this.inboxgrid	= new TaskManager.InboxGrid({region:'center'});
	
	// STATUS BAR
	this.statusbar 	= new TaskManager.StatusBar({});

	this.default_params = {
		layout: 'border',
		items: [this.inboxgrid,this.statusbar],
		bbar: this.statusbar,
		listeners: {
			scope: this,
            render: {
                fn: function() {this.statusbar.initiate()},
                delay: 100
            }
		}
	};
	Ext.apply(this.default_params,settings);
	
	TaskManager.ContentPanel.superclass.constructor.call(this, this.default_params);
}
Ext.extend(TaskManager.ContentPanel, Ext.Panel, {
});