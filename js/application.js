/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */

/**
  * Application Layout
  * 
  */

// create namespace
Ext.ns('TaskManager');

/*	Global Variables
------------------------------------*/

/* Helper Functions */

/*	Create Application
---------------------------------*/
TaskManager.app = function() {
	// do NOT access DOM from here; elements don't exist yet
 
 	// private variables
 
	// private functions
 	
	// public space
	return {
		// public methods
		init: function(settings) {

			Ext.QuickTips.init();
			Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
			
			// extending time limit on Ajax requests
			Ext.Ajax.timeout =  60000*5;
			
			/*	Adding Direct Provider
			------------------------------*/
			Ext.Direct.addProvider(Ext.app.REMOTING_API);
			
			/*	Create and load Forum and Prime Stores
			------------------------------------*/
			this.forum_store = new TaskManager.ForumStore();
			this.prime_store = new TaskManager.PrimeStore();


			/*	HEADER PANEL
			---------------------------------*/
			this.headerPanel = new TaskManager.HeaderPanel({region: 'north', username: settings.user.fullname});
			this.headerPanel.on('showsettings',this.showSettingsWindow,this);
			this.headerPanel.on('logout',this.doLogout,this);

			/*	CONTENT PANEL
			---------------------------------*/
			this.contentPanel = new TaskManager.ContentPanel({region: 'center'});
	

			/*	LEFT PANEL
			--------------------------------*/
			this.leftPanel = new TaskManager.LeftPanel({region:'west'});
			
			this.leftPanel.on('render',function(){
				this.leftPanel.body.on('mousedown', this.doAction, this, {delegate: 'a'});
				this.leftPanel.body.on('click', Ext.emptyFn, this, {delegate:'a', preventDefault:true});
			},this);
			
			
			/* GRID controls
			---------------------------*/
			
			// showing more actions
			this.getInboxGrid().getSelectionModel().on('selectionchange', this.onSelectionChange, this);
			this.getInboxGrid().on('rowdblclick',this.showTaskDetails,this);
			
			// deleting key down
			this.getInboxGrid().on('keydown', function(e){
				 if(e.getKey() == e.DELETE){
					 if(this.isAdmin() && !this.getInboxGrid().isArchive()) {
					 	this.actions['action-delete'].createDelegate(this)();
					 }
				 }
			},this);
			
			// attaching stores
			this.getInboxGrid().on('forum_focus',function() {this.getInboxGrid().attachForumStore(this.forum_store)},this);
			this.getInboxGrid().on('prime_focus',function() {this.getInboxGrid().attachPrimeStore(this.prime_store)},this);

			
			// reloads of stores on new task
			this.getInboxGrid().on('new_task',function() {
				this.forum_store.load();
				this.prime_store.load();
			},this);
			
			
			// Status Bar 
			Ext.Ajax.on('beforerequest', this.showStatusLoading, this);
			Ext.Ajax.on('requestcomplete', this.stopStatusLoading, this);
			Ext.Ajax.on('requestexception', this.stopStatusLoading, this);
			this.getInboxGrid().getStore().on('load',this.doInboxGridCounts,this);
			this.getInboxGrid().getStore().on('write',this.doInboxGridCounts,this);
			this.getStatusBar().on('exportToExcel',this.exportToExcel,this);
			this.getStatusBar().on('refresh',this.reloadStores,this);
			

			/*---------------------------------------
			 *	VIEWPORT
			 *--------------------------------------*/	
			this.viewport = new Ext.Viewport({
				id: 'viewport',
				layout: 'border',
				items: [this.leftPanel,this.contentPanel,this.headerPanel],
				renderTo: Ext.getBody()
			});
			
			/*------------------------------
			*	Setting the inital Repository using cookies
			*	------------------------------*/
			this.getTaksDetails().hide();
			this.lockAllFields();

			// repo id already set in cookie so just load it
			if(this.getInboxGrid().hasSavedState()) {
				var state = this.getInboxGrid().getSavedState();
				this.setRepoId(state.repo_id);
				this.getInboxGrid().getStore().sort(state.sorting.field, state.sorting.direction);
				this.getInboxGrid().getStore().groupBy(state.grouping.field);

				for(i=0;i<state.columns.length;i++){
					var col = state.columns[i];
					this.getInboxGrid().getColumnModel().setHidden(col.index,col.hidden);
				}
				//this.getInboxGrid().getStore().applyFilter(state.filter);
					
			// need to show a modal box to select available repos for user
			} else {
				this.getReposWindow().show();
			}
			
			/*---------------------------
			*	Grid Reload every minute (Comet)
			*----------------------------*/
			Ext.TaskMgr.start({
				run: function() {
					this.reloadStores();
				},
				scope: this,
				interval: 60000
			});
		},
		
		/*	Managing Stores and Repos
		---------------------------------*/
		getRepoId: function() {
			return this.repo_id?this.repo_id:0;
		},
		setRepoId: function(repo_id) {
			
			// fetch Repository Privilege and set Repository information
			RepoAction.getRepoInfo(repo_id,function(msg) {
				this.repo_id = repo_id;
				this.setRepoName(msg.repo_name);
				this.setPrivilege(msg.priv);
				
				// load stores for changes to take effect
				this.loadStores();
				
				// reload main Inbox ### HACK to show repo name and switch to inbox
				this.actions['get-inbox'].createDelegate(this)();		
		
			},this);
			
		},
		getRepoName: function() {
			return this.getInboxGrid().getRepoName();
		},
		setRepoName: function(repo_name) {
			this.getInboxGrid().setRepoName(repo_name);
		},
		setPrivilege: function(priv) {
			this.getInboxGrid().setRepoPrivilege(priv);
			
			// block add Task
			if(this.isAdmin()) {
				this.unlockAllFields();
			} else {
				this.lockAllFields();
			}
		},
		getPrivilege: function() {
			return this.getInboxGrid().getRepoPrivilege();
		},
		isAdmin: function() {
			return this.getPrivilege() == 'ADMIN';
		},
		lockAllFields: function() {
			this.getInboxGrid().blockFields();
			this.getTaksDetails().blockFields();
		},
		unlockAllFields: function() {
			this.getInboxGrid().unblockFields();
			this.getTaksDetails().unblockFields();
		},
		loadStores: function() {
			var repo_id = this.getRepoId();
			this.getInboxGrid().load(repo_id);
			this.prime_store.loadStore(repo_id);
			this.forum_store.loadStore(repo_id);
		},
		reloadStores: function() {
			var repo_id = this.getRepoId();
			if(repo_id) {
				this.getInboxGrid().reload();
				this.prime_store.reload(repo_id);
				this.forum_store.reload(repo_id);
			} else {
				this.getInboxGrid().load(0);
			}
		},
		
		/*	Get functions
		*---------------------------*/		
		getTaskActionsPanel: function() {
			return this.leftPanel.taskActions;
		},
		getInboxGrid: function() {
			return this.contentPanel.inboxgrid;
		},
		getStatusBar: function() {
			return this.contentPanel.statusbar;
		},
		getTaksDetails: function() {
			if(!this.taskDetails) {
				/*	TASK DETAIL PANEL
				--------------------------------*/
				this.taskDetails = new TaskManager.TaskDetails();
				this.taskDetails.on('forum_focus',function() {this.taskDetails.attachForumStore(this.forum_store)},this);
				this.taskDetails.on('prime_focus',function() {this.taskDetails.attachPrimeStore(this.prime_store)},this);
				// reload of stores on task save
				this.taskDetails.on('taskSaved',this.reloadStores,this);
			}
			return this.taskDetails;
		},
		getReposWindow: function() {
			if(!this.reposWindow) {
				/*	REPOS WINDOW
				 *--------------------------------------*/
				this.reposWindow = new TaskManager.ReposWindow();
				this.reposWindow.on('repoSelected',this.setRepoId,this);
			}
			return this.reposWindow;
		},
		getManageReposWindow: function() {
			if(!this.manageReposWindow) {
				this.manageReposWindow = new TaskManager.ManageReposWindow();
				this.manageReposWindow.on('repoAdded',this.setRepoId,this);
				this.manageReposWindow.on('repoSelected',this.setRepoId,this);
			}
			return this.manageReposWindow;
		},
		getSettingsWindow: function() {
			if(!this.settingsWindow) {
				/*	Settings WINDOW
				--------------------------------------------*/
				this.settingsWindow = new TaskManager.SettingsWindow({hidden: true});
			}
			return this.settingsWindow;
		},

		
		/*	Show functions
		*---------------------------*/
		onSelectionChange: function(sm) {
			if(this.isAdmin() && !this.getInboxGrid().isArchive()) {
				this.toggleMoreActions(sm,sm.getCount() > 0);
			} else {
				this.toggleMoreActions(sm,false);
			}
		},
		toggleMoreActions:  function(sm,show) {
			var bd = this.getTaskActionsPanel().body;
    		bd.select('li:not(#new-task)').setDisplayed(show);
    		bd.select('span.s').setDisplayed(sm.getCount() > 1);
		},
		showTaskDetails:  function() {
			var  win = this.getTaksDetails();
			win.loadRecord(this.getInboxGrid().getSelectionModel().getSelected());
			win.show();	
		},
		showSettingsWindow: function() {
			this.getSettingsWindow().show();
		},
		showStatusLoading:  function() {
			this.getStatusBar().showBusy();
		},
		stopStatusLoading:  function() {
			this.getStatusBar().clearStatus(); // setIcon
		},
		
		//------------------------------
		//	ACTIONS
		//--------------------------------
		doLogout: function() {
			window.location = 'logout.php';
		},
		doInboxGridCounts: function() {

			var task_total = 0, task_open =0;
			this.getInboxGrid().getStore().each(function(rec) {
				task_total++;
				if(!rec.get('completed'))	task_open++;
			},this);
			this.getStatusBar().updateCounts({
				open_count: 	task_open,
				total_count: 	task_total
			});
		},
		exportToExcel: function() {
			var mask = new Ext.LoadMask(this.viewport.getEl(), {msg:"Exporting to Excel..."});
			mask.show();
			RepoAction.exportToExcel({repo_id:this.getRepoId(), is_archive: this.getInboxGrid().isArchive()},function(resp){
				//window.open(resp.url);
				window.location = resp.url;
				mask.hide();
			 },this);
			
		},
		doAction: function(e,t) {
			e.stopEvent();
			this.actions[t.id].createDelegate(this)();	// need change the scope to this
		},
		actions: {

			'change-repo' : function(){
				this.getReposWindow().reposGrid.getStore().load();
				this.getReposWindow().show();
			},
			
			'manage-repo' : function(){
				this.getManageReposWindow().show();
			},

			'get-inbox' : function(){
				this.getInboxGrid().setArchive(false);
				this.getInboxGrid().titleRefresh();
				
				// need to reactivate fields
				if(this.isAdmin())	this.unlockAllFields();
			},

			'get-archive' : function(){
				this.getInboxGrid().setArchive(true);
				this.getInboxGrid().titleRefresh();
				
				// need to deactivate Add new Task
				this.lockAllFields();
				
			},


			'view-all' : function(){
				this.getInboxGrid().applyFilter('all');
			},
			
			'view-active' : function(){
				this.getInboxGrid().applyFilter('active');
			},
			
			'view-complete' : function(){
				this.getInboxGrid().applyFilter('completed');
			},
			
			'action-new' : function(){
				this.getInboxGrid().focusAddnew();
			},
			
			'action-edit' : function(){
				this.showTaskDetails();
			},
			
			'action-complete' : function(){
				this.getInboxGrid().getSelectionModel().each(function(s){
					s.set('completed', true);
				});
				this.getInboxGrid().getStore().applyFilter();
			},
			
			'action-active' : function(){
				this.getInboxGrid().getSelectionModel().each(function(s){
					s.set('completed', false);
				});
				this.getInboxGrid().getStore().applyFilter();
			},
			
			'action-delete' : function(){
				var self = this;
				Ext.Msg.confirm('Confirm', 'Are you sure you want to acrhive the selected task(s)?', 
				function(btn){
					if(btn == 'yes'){
						self.getInboxGrid().getSelectionModel().each(function(s){
							self.getInboxGrid().getStore().remove(s);
						});
					}
				});
			},
			
			'group-date' : function(){
				this.getInboxGrid().getStore().groupBy('dueDate');
			},
			
			'group-forum' : function(){
				this.getInboxGrid().getStore().groupBy('forum');
			},
			
			'group-prime' : function(){
				this.getInboxGrid().getStore().groupBy('prime');
			},
			
			'group-priority' : function(){
				this.getInboxGrid().getStore().groupBy('priority');
			},
			
			'no-group' : function(){
				this.getInboxGrid().getStore().clearGrouping();
			}
		}
	};
}();