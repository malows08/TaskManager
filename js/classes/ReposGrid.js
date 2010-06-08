/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.ReposGrid
 * @extends Ext.grid.GridPanel
 *
 * This Panel shows all available Repositories
 * 
 */
TaskManager.ReposGrid = function(settings) {
	
	// Creating store of all Apps and privileges on them
	this.store = new Ext.data.GroupingStore({
		groupField:'privilege',
		sortInfo:{field: 'privilege', direction: "ASC"},
		proxy: new Ext.data.DirectProxy({
			paramsAsHash: true,
			api: {
				read: 	RepoAction.getRepos
			}
		}),
		autoLoad: true,
		paramsAsHash: true,	// needed for baseParams
		baseParams: {restricted: settings.restricted},
		reader: new Ext.data.JsonReader({
				root: 'rows'
				,totalProperty: 'totalCount'
				,idProperty: 'repo_id'
			},
			[
			 	{name: 'repo_id', mapping: 'repo_id'},
				{name: 'name', mapping: 'name'},
				{name: 'description', mapping: 'description'},
				{name: 'privilege', mapping: 'privilege'},
				{name: 'total_inbox', mapping: 'total_inbox', type: 'int'},
				{name: 'total_inbox_open', mapping: 'total_inbox_open', type: 'int'},
				{name: 'total_archive', mapping: 'total_archive', type: 'int'}
			]
		)
	});	
	
	// default show list for columns
	this.show_list = {
		id: false,
		name: true,
		privilege: true,
		description: true,
		total_inbox: true,
		total_inbox_open: true,
		total_archive: true
	};
	Ext.apply(this.show_list,settings.show_list);
	
	// Default Params for the Grid
	var default_params = {
		loadMask: false,
		stripeRows: true,	
		store: this.store,
		autoExpandColumn: 'description',
		sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
		columns:[
				new Ext.grid.RowNumberer(),
				{header: "id", width: 30, sortable: true, dataIndex: 'repo_id', hidden: !this.show_list.id},
				{header: "Name", width: 100, sortable: true, dataIndex: 'name', hidden: !this.show_list.name},
				{header: "Privilege", width: 50, sortable: true, dataIndex: 'privilege', hidden: !this.show_list.privilege},
				{header: "Active", width: 50, sortable: true, dataIndex: 'total_inbox_open', hidden: !this.show_list.total_inbox_open},
				{header: "Inbox", width: 50, sortable: true, dataIndex: 'total_inbox', hidden: !this.show_list.total_inbox},
				{header: "Archived", width: 50, sortable: true, dataIndex: 'total_archive', hidden: !this.show_list.total_archive},
				{header: "Description", width: 120, sortable: true, dataIndex: 'description',id: 'description', hidden: !this.show_list.description}
		],
		view: new Ext.grid.GroupingView({
			forceFit: true,
			emptyText: 'You do not have access to any repositories yet...' + 
						'<br><br>To Create one, go to <b>Manage Repositories > Add New Repository</b>'
		})
	};	
	Ext.apply(default_params,settings);
	
	TaskManager.ReposGrid.superclass.constructor.call(this, default_params);
}

Ext.extend(TaskManager.ReposGrid, Ext.grid.GridPanel, {	   	   
});