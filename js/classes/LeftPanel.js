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
TaskManager.LeftPanel = function(settings) {
	
	this.viewPanel = new Ext.Panel({
		frame:true,
		title: 'Views',
		collapsible:true,
		contentEl:'task-views',
		titleCollapse: true
	});
	
	this.taskActions = new Ext.Panel({
		frame:true,
		title: 'Task Actions',
		collapsible:true,
		contentEl:'task-actions',
		titleCollapse: true
	});

	this.groupActions = new Ext.Panel({
		frame:true,
		title: 'Task Grouping',
		collapsible:true,
		contentEl:'task-grouping',
		titleCollapse: true
	});
	
	this.folderActions = new Ext.Panel({
		frame:true,
		title: 'Folder',
		collapsible:true,
		contentEl:'task-folder',
		titleCollapse: true
	});
	
	this.repoActions = new Ext.Panel({
		frame:true,
		title: 'Repositories',
		collapsible:true,
		contentEl:'task-repo',
		titleCollapse: true
	});
	
	this.default_params = {
		id:'action-panel',
		split:true,
		collapsible: true,
		collapseMode: 'mini',
		header: false, // Done by Evan, temp fix
		width:200,
		minWidth: 150,
		border: false,
		baseCls:'x-plain',
		items: [this.repoActions,this.folderActions,this.groupActions,this.viewPanel,this.taskActions]
	};
	Ext.apply(this.default_params,settings);
	
	TaskManager.LeftPanel.superclass.constructor.call(this, this.default_params);
}
Ext.extend(TaskManager.LeftPanel, Ext.Panel, {
});