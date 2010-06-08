/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.ReposWindow
 * @extends Ext.Window
 *
 * This Ext.Window shows all repositories user has access to
 * 
 */

TaskManager.ReposWindow = function(settings) {
	
	// Repo Grid
	this.reposGrid = new TaskManager.ReposGrid({region:'center',restricted: false, loadMask: true});
	this.reposGrid.on('rowclick',function(grid,rowIndex,e) {
		var record = grid.getStore().getAt(rowIndex);  // Get the Record);
		this.fireEvent('repoSelected',record.get('repo_id'));
		this.hide();
	},this);
	
	var default_params = {
            title: 'Change Repository',
			iconCls: 'icon-change-repo',
            closeAction: 'hide',
			minimizable: false,
            maximizable: true,
			constrainHeader:true,
			hidden: true,
			modal: true,
            width:600,
            height:300,
            plain:true,
            layout: 'border',
			resizable: true,
            items: [this.reposGrid]
	};
	// overriding the defaults
	Ext.apply(default_params,settings);

	// adding events to reload the Menu
	this.addEvents('repoSelected');

	TaskManager.ReposWindow.superclass.constructor.call(this, default_params);
}

Ext.extend(TaskManager.ReposWindow, Ext.Window, {
		   
	show: function() {
		TaskManager.ReposWindow.superclass.show.apply(this, arguments);	
	},
	
	hide: function() {
		TaskManager.ReposWindow.superclass.hide.apply(this, arguments);	
	}
});