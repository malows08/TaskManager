/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.StatusBar
 * @extends new Ext.ux.StatusBar
 *
 * Provides the store for grouping
 * 
 */
TaskManager.StatusBar = function(settings){

	this.exportBtn	= new Ext.Button({
					iconCls: 'icon-excel',
                 	tooltip: 'Export to Excel',
					scope: this,
                    handler: this.fireExportToExcel
                }); 
	this.refreshBtn	= new Ext.Button({
					iconCls: 'icon-refresh',
                 	tooltip: 'Refresh Tasks',
					scope: this,
                    handler: this.fireRefresh
                }); 
    this.openCount 	= new Ext.Toolbar.TextItem('Open: 0');
    this.totalCount = new Ext.Toolbar.TextItem('Total: 0');
    this.clock 		= new Ext.Toolbar.TextItem('');
	
	this.default_params = {
		items: [this.exportBtn,this.refreshBtn,this.openCount,this.totalCount,this.clock]
	};	
	Ext.apply(this.default_params,settings);
	
	// adding events
	this.addEvents('exportToExcel');

	TaskManager.StatusBar.superclass.constructor.call(this, this.default_params);
}
Ext.extend(TaskManager.StatusBar, Ext.ux.StatusBar, {
	initiate: function() {
		Ext.fly(this.openCount.getEl().parent()).addClass('x-status-text-panel').createChild({cls:'spacer'});
		Ext.fly(this.totalCount.getEl().parent()).addClass('x-status-text-panel').createChild({cls:'spacer'});
		Ext.fly(this.clock.getEl().parent()).addClass('x-status-text-panel').createChild({cls:'spacer'});
		
		// Kick off the clock timer that updates the clock el every second:
		Ext.TaskMgr.start({
			scope: this,
			run: function(){
				Ext.fly(this.clock.getEl()).update(new Date().format('g:i:s A'));
			},
			interval: 1000
		});
	},
	
	// updates the Status bar counts
	updateCounts: function(params) {
		Ext.fly(this.openCount.getEl()).update('Open: ' + params.open_count);
      	Ext.fly(this.totalCount.getEl()).update('Total: ' + params.total_count);
	},
	
	fireExportToExcel: function() {
		this.fireEvent('exportToExcel');
	},
	fireRefresh: function() {
		this.fireEvent('refresh');
	}
});