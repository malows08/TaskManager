/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.ManageReposWindow
 * @extends Ext.Window
 *
 * This Ext.Window shows all repositories user has access to
 * 
 */

TaskManager.ManageReposWindow = function(settings) {
	
	// Add Window
	this.add_window = new TaskManager.AddRepoWindow();
	this.add_window.hide();
	this.add_window.on('repoAdded',function(repo_id) {
		this.reposGrid.getStore().load();
		this.fireEvent('repoAdded',repo_id);
	},this);
	
	// Repo Grid
	this.reposGrid = new TaskManager.ReposGrid({
		region:'west', 
		restricted: true,
		title: 'Select Repository',
		width: 250,
		bbar: [{
			   iconCls: 'icon-add-large',
			   iconAlign: 'top',
			   scale: 'large',
			   text: '<b>Add New Repository</b>',
			   scope: this,
			   handler:function() {
					this.add_window.show();
					
					// small bug fix to focus on name field
					var self=this;
					(function() {
						self.add_window.nameField.focus();
					}).defer(500);
					
				}
		},'->',{
			text: 'Go to Repository',
			iconAlign: 'top',
			scale: 'large',
			iconCls: 'icon-change-repo',
			scope: this,
			handler: function() {
				if(this.getRepoId()){
					this.fireEvent('repoSelected',this.getRepoId());
					this.hide();
				}
			}
		}],
		show_list: {description: false,privilege: false}
	});
	this.reposGrid.on('rowclick',function(grid,rowIndex,e) {
		this.setRepoId(this.reposGrid.getSelectionModel().getSelected().get('repo_id'));
		this.loadRecord(this.reposGrid.getSelectionModel().getSelected());
		this.reposUsersGrid.reload(this.reposGrid.getSelectionModel().getSelected().get('repo_id'));
	},this);
	
	// Repo Users Grid
	this.reposUsersGrid = new TaskManager.ReposUsersGrid({
		frame:true,
		flex:1,
		bbar: [{iconCls: 'icon-delete',text: 'Remove User',scope: this, handler: this.doDeleteUser}]
	});
	// deleting key down
	this.reposUsersGrid.on('keydown', function(e){
		 if(e.getKey() == e.DELETE){
			 this.doDeleteUser();
		 }
	},this);
	
	
	// Details Panel
	this.nameField = new Ext.form.TextField({
		fieldLabel: 'Name',
		name: 'name',
		anchor:'95%',
		allowBlank: false,
		disabled:true
	});
	this.descriptionField = new Ext.form.TextField({
		fieldLabel: 'Description',
		name: 'description',
		height: 40,
		anchor:'95%',
		disabled:true
	}); 
	this.SaveBtn = new Ext.Button({
		text: 'Save',
		iconCls: 'icon-save',
		scope: this, 
		handler: this.doDetailsSave, 
		disabled:true
	});
	this.detailsPanel = new Ext.form.FormPanel({
			title: 'Details',
			region:'center',
			labelAlign: 'top',
        	frame:true,
			height: 140,
			layout: 'vbox',
			layoutConfig: {
				align: 'stretch'
			},
			items:[{
				layout:'column',
				items:[{
						columnWidth:.3,
						layout: 'form',
						items: [this.nameField]// end column items
					},{
						columnWidth:.7,
						layout: 'form',
						items: [this.descriptionField]// end column items
					}]// end columns
			}], //end form items
		buttons: [this.SaveBtn]
	});
	
	// User Management Panel
	this.userField = new TaskManager.UserSearchCombo({
		fieldLabel: 'User',
		displayField:'user_id',
		valueField: 'user_id',
		name: 'user_id',
		anchor:'95%',
		allowBlank: false,
		disabled: true
	});
	this.privilegeField = new TaskManager.PrivilegeComboBox({
		fieldLabel: 'Privilege',
		name: 'privilege',
		anchor:'95%',
		allowBlank: false,
		disabled: true
	});
	this.AddBtn = new Ext.Button({
		fieldLabel: 'Action',
		text: 'Add',
		iconCls: 'icon-add',
		anchor:'95%',
		scope: this, 
		handler: this.doAdd, 
		disabled:true
	});
	this.userPanel = new Ext.form.FormPanel({
			title: 'Users',
			region:'center',
			labelAlign: 'top',
        	frame:true,
			flex: 1,
			layout: 'vbox',
			layoutConfig: {
				align: 'stretch'
			},
			items:
			[{
				layout:'column',
				items:[{
						columnWidth:.3,
						layout: 'form',
						items: [this.userField]// end column items
					},{
						columnWidth:.3,
						layout: 'form',
						items: [this.privilegeField]// end column items
					},{
						columnWidth:.3,
						layout: 'form',
						items: [this.AddBtn]// end column items
					}]// end columns
			},this.reposUsersGrid] //end form items
	});
	
	this.centerPanel = new Ext.Panel({
		region:'center',
		layout: 'vbox',
		layoutConfig: {
			align: 'stretch'
		},
		items: [this.detailsPanel,this.userPanel]
	});
	
	var default_params = {
            title: 'Manage Repositories',
			iconCls: 'icon-manage-repo',
            closeAction: 'hide',
			minimizable: false,
            maximizable: true,
			constrainHeader:true,
			hidden: true,
			modal: true,
            width:700,
            height:500,
            plain:true,
            layout: 'border',
			resizable: true,
            items: [this.reposGrid,this.centerPanel]
	};
	// overriding the defaults
	Ext.apply(default_params,settings);

	// adding events
	this.addEvents('repoAdded');

	TaskManager.ManageReposWindow.superclass.constructor.call(this, default_params);
}

Ext.extend(TaskManager.ManageReposWindow, Ext.Window, {
		   
	show: function() {
		TaskManager.ManageReposWindow.superclass.show.apply(this, arguments);	
	},
	
	hide: function() {
		TaskManager.ManageReposWindow.superclass.hide.apply(this, arguments);	
	},
	
	setRepoId: function(repo_id) {
		this.repo_id = repo_id;
	},
	getRepoId: function() {
		return this.repo_id;
	},
	
    /**
     * loadRecord
     * @param {Record} rec
     */
    loadRecord : function(rec) {
        this.record = rec;
		this.detailsPanel.getForm().loadRecord(rec);
		
		// unblocking fields
		this.nameField.enable();
		this.descriptionField.enable();
		this.SaveBtn.enable();
		this.userField.enable();
		this.privilegeField.enable();
		this.AddBtn.enable();
    },
	
	// Saving function
	doDetailsSave: function() {
		if(this.detailsPanel.getForm().isValid()) {
			var mask = new Ext.LoadMask(this.detailsPanel.getEl());
			mask.show();
			
			// setting values
			var values = this.detailsPanel.getForm().getValues();
			values = Ext.apply(values,{repo_id: this.getRepoId()});
			
			// direct call
			RepoAction.saveRepoInfo(values,function() {
				mask.hide();
				this.reposGrid.getStore().load();
			},this);
		}
	},
	doAdd: function() {

		if(this.userPanel.getForm().isValid()) {
			var mask = new Ext.LoadMask(this.userPanel.getEl());
			mask.show();
			
			// setting values
			var values = this.userPanel.getForm().getValues();
			values = Ext.apply(values,{repo_id: this.getRepoId()});

			// direct call
			RepoAction.addUserPrivilege(values,function() {
				mask.hide();
				this.userField.reset();
				this.privilegeField.reset();
				this.reposUsersGrid.getStore().load();
			},this);
		}
	},
	doDeleteUser: function() {
                // get list of user ids to be removed
		var user_array = [];
		this.reposUsersGrid.getSelectionModel().each(function(s){
			user_array.push(s.get('user_id'));
		});
		RepoAction.deleteUser( {repo_id: this.getRepoId(), users: user_array}, function() {
			this.reposUsersGrid.getStore().load();
		},this);
	}
});

/**
 * TaskManager.ReposUsersGrid
 * @extends Ext.grid.GridPanel
 *
 * This Panel shows all user and their privileges on the specific repository
 * 
 */
TaskManager.ReposUsersGrid = function(settings) {
	
	// Creating store of all Apps and privileges on them
	this.store = new Ext.data.DirectStore({
		api: {
			read: 	RepoAction.getRepoUsers
		},
		paramsAsHash: true,	// needed for baseParams
		baseParams: {repo_id: 2},
		reader: new Ext.data.JsonReader({
				root: 'rows'
				,totalProperty: 'totalCount'
				,idProperty: 'id'
			},
			[
			 	{name: 'id', mapping: 'id'},
			 	{name: 'repo_id', mapping: 'repo_id'},
				{name: 'name', mapping: 'name'},
				{name: 'user_id', mapping: 'user_id'},
				{name: 'lastname', mapping: 'lastname'},
				{name: 'firstname', mapping: 'firstname'},
				{name: 'privilege', mapping: 'privilege'}
			]
		),
		listeners: {
			scope: this,
			beforeload: function() {
				this.getStore().setBaseParam('repo_id',this.getRepoId());
			}
		}
	});	
	
	
	// Default Params for the Grid
	var default_params = {
		loadMask: true,
		stripeRows: true,	
		store: this.store,
		autoExpandColumn: 'lastname',
		columns:[
				{header: "id", width: 30, sortable: true, dataIndex: 'id', hidden: true},
				{header: "repo_id", width: 30, sortable: true, dataIndex: 'repo_id', hidden: true},
				{header: "LastName", width: 100, sortable: true, dataIndex: 'lastname',id: 'lastname'},
				{header: "Firstname", width: 100, sortable: true, dataIndex: 'firstname',id: 'firstname'},
				{header: "User Id", width: 100, sortable: true, dataIndex: 'user_id',id: 'user_id'},
				{header: "Privilege", width: 50, sortable: true, dataIndex: 'privilege'}		
		],
		viewConfig: {
			forceFit: true
		}
	};	
	Ext.apply(default_params,settings);
	
	TaskManager.ReposUsersGrid.superclass.constructor.call(this, default_params);
}

Ext.extend(TaskManager.ReposUsersGrid, Ext.grid.GridPanel, {
	reload: function(repo_id){
		this.setRepoId(repo_id);
		this.getStore().load();
	},
	setRepoId: function(repo_id) {
		this.repo_id = repo_id;
	},
	getRepoId: function() {
		return this.repo_id;
	}
});

/**
 * TaskManager.AddRepoWindow
 * @extends Ext.Window
 *
 * This Panel shows an Add new Repository
 * 
 */

TaskManager.AddRepoWindow = function(settings) {

	// Date Editors
	this.nameField = new Ext.form.TextField({
		anchor:'95%',
		allowBlank: false,
		fieldLabel: 'Repository Name',
       	name: 'name'
  	});	

	// Form Panel inside window
	this.formPanel = new Ext.FormPanel({						   
		region: 'center',
		bodyStyle: {padding: 10},							   
		frame:true,
		labelAlign: 'left',
		waitMsgTarget: true,	
		
        items: [this.nameField],
		buttons: [{
			text: 'Submit',
			scope: this,
			handler: function(){
				if(this.formPanel.getForm().isValid()){
						
					// sending create request	
					var mask = new Ext.LoadMask(this.getEl());
					mask.show();

					RepoAction.addRepo(this.formPanel.getForm().getValues(),function(msg) {
						this.formPanel.getForm().reset();
						this.fireEvent('repoAdded',msg.repo_id);
						mask.hide();
						this.hide();
					}
					,this);
				}
			}
		},{
            text: 'Cancel',
			scope: this,
			handler: function() {this.hide()}
        }]
	});

	// The Window Panel Configs
	var default_params = {
            title: 'Add New Repository',
			iconCls: 'icon-add-small',
            closeAction: 'hide',
			modal: true,
			hidden: true,
            width:300,
            height:110,
            layout: 'border',
			items: [this.formPanel],
			resizable: false			
	};
	// overriding the defaults
	Ext.apply(default_params,settings);
	
	// adding events to reload the Menu
	this.addEvents('repoAdded');	
	
	TaskManager.AddRepoWindow.superclass.constructor.call(this, default_params);

}

Ext.extend(TaskManager.AddRepoWindow, Ext.Window, {
		   
	show: function() {
		TaskManager.AddRepoWindow.superclass.show.apply(this, arguments);	
	},
	
	hide: function() {
		TaskManager.AddRepoWindow.superclass.hide.apply(this, arguments);	
	}
});