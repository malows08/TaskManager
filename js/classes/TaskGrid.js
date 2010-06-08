/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.TaskGrid
 * @extends Ext.grid.EditorGridPanel
 *
 * This Ext.grid.EditorGridPanel contains the view of Tasks
 * 
 */
TaskManager.InboxGrid = function(settings) {

	// template
	this.headerTpl = new Ext.Template(
		'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
		'<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
		'<tbody><tr class="new-task-row">',
			'<td><div id="new-task-icon"></div></td>',
			'<td><div class="x-small-editor" id="new-task-title"></div></td>',
			'<td><div class="x-small-editor" id="new-task-priority"></div></td>',
			'<td><div class="x-small-editor" id="new-task-prime"></div></td>',
			'<td><div class="x-small-editor" id="new-task-forum"></div></td>',
			'<td><div class="x-small-editor" id="new-task-due"></div></td>',
			'<td><div class="x-small-editor" id="new-task-added"></div></td>',
			'<td><div class="x-small-editor" id="new-task-add"></div></td>',
		'</tr></tbody>',
		"</table>"
	);
	
	// check plugin
	this.completeColumn = new Ext.ux.CompleteColumn();
	
	// logic variables
	this.nt_handlers = {
					scope: this,
					specialkey: function(f, e){
						if(e.getKey()==e.ENTER){
							e.stopEvent();
							f.el.blur();
							if(f.triggerBlur){
								f.triggerBlur();
							}
							this.doAdd();
						}
					}
				};
				
	// Task Store
	this.store = new TaskManager.TaskStore();
	this.store.on('load',function() {
		if(this.isCleanLoad())
			this.applyFilter('all');
		else
			this.applyFilter(this.getStore().getFilter());
		this.titleRefresh();
	},this);
	
	// defaults
	this.default_params = {
		id:'tasks-grid',
		store: this.store,
		sm: new Ext.grid.RowSelectionModel(),
		clicksToEdit: 'auto',
		enableColumnHide:true,
		enableColumnMove:false,
		border:false,
		title:'All Tasks',
		iconCls:'icon-show-all',
		
        // config options for stateful behavior
        stateful: true,
		stateEvents: ['columnmove', 'columnresize', 'sortchange','groupchange'],
		
		// plugins
		plugins: [this.completeColumn,new Ext.ux.grid.GroupSummary()],

		// columns
		columns: [
			this.completeColumn,
			{
				header: "Task",
				width:250,
				sortable: true,
				dataIndex: 'title',
				id:'task-title',
				hideable: false,
				summaryType: 'count',
				summaryRenderer: function(v, params, data){
                    return ((v === 0 || v > 1) ? '(' + v +' Tasks)' : '(1 Task)');
                }
			},{
				header: "Priority",
				width: 75,
				sortable: true,
				dataIndex: 'priority',
				groupName: 'Priority',
				hideable: false,
				renderer: function(val) {
					switch(val) {
						case 5:
							return 'Closed';
							break;
						case 4:
							return 'Pending';
							break;
						case 3:
							return 'Low';
							break;
						case 2:
							return 'Med';
							break;
						case 1:
							return 'High';
							break;
					}
					return '-';
				}
			},{
				header: "Prime",
				width:125,
				sortable: true,
				dataIndex: 'prime',
				hideable: false
			},{
				header: "Forum",
				width:150,
				sortable: true,
				dataIndex: 'forum',
				hideable: false
			},{
				header: "Due Date",
				width: 150,
				sortable: true,
				renderer: Ext.util.Format.dateRenderer('D Y-m-d'),
				dataIndex: 'dueDate',
				groupRenderer: textDate(),
				groupName: 'Due',
				hideable: false
			},{
				header: "Add Date",
				width: 150,
				sortable: true,
				renderer: Ext.util.Format.dateRenderer('D Y-m-d'),
				dataIndex: 'addDate',
				groupRenderer: textDate(),
				groupName: 'Added',
				hideable: false
			},{
				header: "Completed Date",
				width: 150,
				sortable: true,
				renderer: Ext.util.Format.dateRenderer('D Y-m-d'),
				dataIndex: 'completeDate',
				groupRenderer: textDate(),
				groupName: 'Completed',
				hideable: false
			},{
				header: "Id",
				id:'task-id',
				width:50,
				sortable: true,
				dataIndex: 'taskId',
				hideable: true,
				hidden: true
			}
		],

		// View
		view: new Ext.grid.GroupingView({
			forceFit:true,
			ignoreAdd: true,
			emptyText: 'No Tasks to display',

			templates: {
				header: this.headerTpl
			},
			
			onLoad: Ext.emptyFn,
			listeners: {
				scope: this,
				beforerefresh: function(v) {
					v.scrollTop = v.scroller.dom.scrollTop;
					v.scrollHeight = v.scroller.dom.scrollHeight;
				},
				refresh: function(v) {
					this.fireEvent('groupchange');
					
					// fixing the scrolling to keep it at same spot on repository reload
					if(!this.isCleanLoad()) {
				   		v.scroller.dom.scrollTop = v.scrollTop 
								+ (v.scrollTop == 0 ? 0 : v.scroller.dom.scrollHeight - v.scrollHeight);
					} else
						v.scroller.dom.scrollTop = 0;

				}
			},

			getRowClass : function(r){
				var d = r.data;
				var row_class = '';
				
				// completed
				if(d.completed){
					row_class += ' task-completed';
				} else if(d.dueDate && d.dueDate.getTime() < new Date().clearTime().getTime()){
					row_class += ' task-overdue';
				}
				
				// priority
				switch(d.priority) {
					case 5:
						row_class += ' task-priority-closed';
						break;
					case 4:
						row_class += ' task-priority-pending';
						break;
					case 3:
						row_class += ' task-priority-low';
						break;
					case 2:
						row_class += ' task-priority-med';
						break;
					case 1:
						row_class += ' task-priority-high';
						break;
				}
				return row_class;
			}
		}),
		
		// listeners
		listeners: {
			scope: this,
			
			afterrender: function() {
				this.ntTitle = new Ext.form.TextField({
					renderTo: 'new-task-title',
					emptyText: 'Add an Task...'
				});	
				this.ntTitle.on(this.nt_handlers);

				this.ntPriority = new TaskManager.PriorityComboBox({
					renderTo: 'new-task-priority',
					emptyText: 'Add a priority...'
				});	
				this.ntPriority.on(this.nt_handlers);

				this.ntPrime = new Ext.form.ComboBox({
					renderTo: 'new-task-prime',
					emptyText: 'Add a prime...',
					displayField: 'prime',
					triggerAction: 'all',
					mode:'local',
					selectOnFocus:true,
					listClass:'x-combo-list-small'
				});	
				this.ntPrime.on(this.nt_handlers);
				this.ntPrime.on('focus',this.firePrimeFocus,this);
				
				this.ntForum = new Ext.form.ComboBox({
					renderTo: 'new-task-forum',
					emptyText: 'Select a forum...',
					displayField: 'forum',
					triggerAction: 'all',
					mode:'local',
					selectOnFocus:true,
					listClass:'x-combo-list-small'
				});	
				this.ntForum.on(this.nt_handlers);
				this.ntForum.on('focus',this.fireForumFocus,this);
				
				this.ntDue = new Ext.form.DateField({
					renderTo: 'new-task-due',
					format : "Y-m-d"
				});
				this.ntDue.on(this.nt_handlers);
				
				this.ntAdded = new Ext.form.DateField({
					disabled: true,
					renderTo: 'new-task-added',
					value: new Date(),
					disabled:true,
					format : "Y-m-d"
				});
				this.ntAdded.on(this.nt_handlers);
				
				this.ntAddBtn = new Ext.Button({
					iconCls: 'icon-add',
					disabled: true,
					renderTo: 'new-task-add',
					text: 'Add',
					disabled: true,
					scope: this,
					handler: this.doAdd
				});
				
				this.syncFields();
			}
		}
	};
	Ext.apply(this.default_params,settings);
	
	// adding events
	this.addEvents('groupchange','stateresfresh');
	
	TaskManager.InboxGrid.superclass.constructor.call(this, this.default_params);
}
Ext.extend(TaskManager.InboxGrid, Ext.grid.GridPanel, {
	// syncs the header fields' widths with the grid column widths
    syncFields: function(){
		
		var buffer=0;
		if(Ext.isIE)buffer=10;
		
        var cm = this.getColumnModel();
        this.ntTitle.setSize(cm.getColumnWidth(1)+buffer-2);
		this.ntPriority.setSize(cm.getColumnWidth(2)+buffer-14);
		this.ntPrime.setSize(cm.getColumnWidth(3)+buffer-14);
        this.ntForum.setSize(cm.getColumnWidth(4)+buffer-14);
        this.ntDue.setSize(cm.getColumnWidth(5)+buffer-18);
		this.ntAdded.setSize(cm.getColumnWidth(6)+buffer-4);
		this.ntAddBtn.setSize(cm.getColumnWidth(7)+buffer-10);
    },
	
	focusAddnew: function() {
		this.ntTitle.focus();
	},
	resetFields: function() {
		this.ntTitle.setValue('');
		this.ntPriority.reset();
		this.ntPrime.setValue('');
		this.ntForum.setValue('');
		this.ntDue.setValue('');
	},    
	blockFields: function() {
		this.ntTitle.disable();
		this.ntPriority.disable();
		this.ntPrime.disable();
		this.ntForum.disable();
		this.ntDue.disable();
		this.ntAddBtn.disable();
		this.completeColumn.lock();
	}, 
	unblockFields: function() {
		this.ntTitle.enable();
		this.ntPriority.enable();
		this.ntPrime.enable();
		this.ntForum.enable();
		this.ntDue.enable();
		this.ntAddBtn.enable();
		this.completeColumn.unlock();
	}, 	
	
	// fire functions
	fireForumFocus: function() {
		this.fireEvent('forum_focus');
	},
	firePrimeFocus: function() {
		this.fireEvent('prime_focus');
	},
	
	// Attach functions
	attachForumStore: function(store) {
		this.ntForum.bindStore(store);
	},
	attachPrimeStore: function(store) {
		this.ntPrime.bindStore(store);
	},
	
	// Store functions
	doAdd: function() {
		var self = this;
		
		// check for non existant fields
		if(self.ntTitle.getValue() === '') {
			Ext.MessageBox.show({
			   title: 'Add Item Error',
			   msg: 'Please enter an Task name',
			   buttons: Ext.MessageBox.OK,
			   icon: Ext.MessageBox.ERROR,
			   scope: this,
			   fn: function() {
					this.focusAddnew();
			   }
		   	});
		// add new Task
		} else {
			this.getStore().addTask({
						repo_id: self.getStore().getRepoId(),
						priority: self.ntPriority.getValue(),
						title: self.ntTitle.getValue(),
						prime: self.ntPrime.getValue(),
						forum: self.ntForum.getValue(),
						dueDate: self.ntDue.getValue()||'',
						completed: false
			});
			this.fireEvent('new_task');
			// reset fields
			this.resetFields();
		}

	},
	setRepoId: function(repo_id) {
		this.getStore().setRepoId(repo_id);
	},
	getRepoId: function() {
		return this.getStore().getRepoId();
	},
	setRepoName: function(repo_name) {
		this.getStore().setRepoName(repo_name);
	},
	getRepoName: function() {
		return this.getStore().getRepoName();
	},
	setRepoPrivilege: function(repo_priv) {
		this.getStore().setRepoPrivilege(repo_priv);
	},
	getRepoPrivilege: function() {
		return this.getStore().getRepoPrivilege();
	},
	load: function(repo_id) {
		this.setCleanLoad();
		this.getStore().setRepoId(repo_id);
		this.getStore().load();
	},
	reload: function() {
		this.setDirtyLoad();
		this.getStore().load();
	},
	
	// To Check if its a Clean Load ie: new repository
	setCleanLoad: function() {
		this.getStore().setCleanLoad();
	},
	setDirtyLoad: function() {
		this.getStore().setDirtyLoad();
	},
	isCleanLoad: function() {
		return this.getStore().isCleanLoad();
	},
	
    getFolder: function(){
		return this.getStore().getFolder();
    },	
	isArchive: function() {
		return this.getStore().isArchive();
	},
    setArchive : function(is_archive){
		this.getStore().setArchive(is_archive);
		this.reload();
    },
	titleRefresh: function() {
		this.setTitle(
					'[' + this.getRepoName() + ' - <i>' + this.getRepoPrivilege() + '</i> ] ' +
					this.getFolder() +
					this.getStore().getMsg(),
					this.getStore().getIconCls()
		);
	},
	
	applyFilter: function(filter) {
		this.getStore().applyFilter(filter);
		this.titleRefresh();
	},
	
	// Handling Statefulness of Grid
	getState: function() {	

		return {
			sorting: 	this.getStore().getSortState(),
			filter:		this.getStore().getFilter(),
			grouping:	{field: this.getStore().groupField, direction: this.getStore().groupDir},
			repo_id:	this.getRepoId(),
			columns:	[
						 {	
						 	index: 	8,
							hidden:			this.getColumnModel().isHidden(8)
						 }
					]
		};
	},
	
	applyState: function(state) {
		//console.debug(state);
		this.saved_state = state;
	},
	
	hasSavedState: function() {
		if(this.saved_state)	return true;
		return false;
	},
	
	getSavedState: function() {
		if(this.saved_state) return this.saved_state;
		return null;
	}
});


/**
 * TaskManager.TaskStore
 * @extends Ext.data.GroupingStore
 *
 * Provides the store for grouping
 * 
 */
TaskManager.TaskStore = function(){
	// initialising Archive bit
	this.is_archive = false;
	
	TaskManager.TaskStore.superclass.constructor.call(this, {
		//autoLoad: true,
        sortInfo:{field: 'dueDate', direction: "ASC"},
        groupField:'dueDate',
        taskFilter: 'all',
		//restful: true,
		writer: new Ext.data.JsonWriter({
					returnJson: true,
					writeAllFields: true,
					encode: false
		}),
		proxy: new Ext.data.DirectProxy({
			paramsAsHash: true,
			api: {
				read: 		TaskAction.loadTasks,
				destroy:	TaskAction.deleteTask,
				update:		TaskAction.updateTask,
				create:		TaskAction.createTask
			}
		}),
        reader: new Ext.data.JsonReader({
				root: 'rows',
				totalProperty: 'totalCount',
				idProperty: 'taskId',
        		fields: TaskManager.Task
		}),
		listeners: {
			scope: this,
			beforeload: function() {
				this.setBaseParam('is_archive',this.is_archive);
				this.setBaseParam('repo_id',this.getRepoId());
			}
		}
    });

};

Ext.extend(TaskManager.TaskStore, Ext.data.GroupingStore, {
    applyFilter : function(filter){

		// Setting Filter variables
		if(filter == 'all') {
			this.taskFilter = filter;
			this.setMsg(' - All Tasks');
			this.setIconCls(this.isArchive()?'icon-archive':'icon-show-all');
			
			return this.clearFilter();
		}
		
		if(filter == 'completed') {
			this.taskFilter = filter;
			this.setMsg(' - Completed Tasks');
			this.setIconCls(this.isArchive()?'icon-archive':'icon-show-complete');
			
			return this.filterBy(function(item){
				return item.data.completed === true;
			});
		}
		
		if(filter == 'active') {
			this.taskFilter = filter;
			this.setMsg(' - Active Tasks');
			this.setIconCls(this.isArchive()?'icon-archive':'icon-show-active');
			
			return this.filterBy(function(item){
				return item.data.completed === false;
			});
		}

    },
	getFilter: function() {
		return this.taskFilter;
	},

    addTask : function(data){
		var rec = new this.recordType(data);
		this.addSorted(rec);
       
	   	this.fireEvent('datachanged', this);
    },

    getFolder: function(){
		if(this.is_archive) return 'Archive';
		return 'Inbox';
    },
	isArchive: function() {
		return this.is_archive;
	},
    setArchive : function(is_archive){
		this.is_archive = is_archive;

    },	
	setRepoId: function(repo_id) {
		this.repo_id = repo_id;
	},
	getRepoId: function() {
		return this.repo_id;
	},
	setRepoName: function(repo_name) {
		this.repo_name = repo_name
	},
	getRepoName: function() {
		return this.repo_name;
	},
	setRepoPrivilege: function(repo_priv) {
		this.privilege = repo_priv;
	},
	getRepoPrivilege: function() {
		return this.privilege;
	},
	
	// To Check if its a Clean Load ie: new repository
	setCleanLoad: function() {
		this.load_is_dirty = false;
	},
	setDirtyLoad: function() {
		this.load_is_dirty = true;
	},
	isCleanLoad: function() {
		return !this.load_is_dirty;
	},	
	
	getIconCls: function() {
		if(this.taskFilter_iconCls)	return this.taskFilter_iconCls;
		return 'icon-show-all';	
	},
	setIconCls: function(iconCls) {
		this.taskFilter_iconCls = iconCls;
	},
	getMsg: function() {
		if(this.taskFilter_msg)	return this.taskFilter_msg;
		return ' - All Tasks';	
	},
	setMsg: function(msg) {
		this.taskFilter_msg = msg;
	},

    prepareTable : function(){
        try{
        this.createTable({
            name: 'task',
            key: 'taskId',
            fields: TaskManager.Task.prototype.fields
        });
        }catch(e){console.log(e)}
    }
});

/**
 * TaskManager.Task
 *
 * a data record of the taskmanager store
 * 
 */
TaskManager.Task = Ext.data.Record.create([
	{name: 'repo_id', type:'int'},
	{name: 'taskId', type:'int'},
	{name: 'title', type:'string'},
	{name: 'forum', type:'string'},
	{name: 'prime', type:'string'},
	{name: 'createDate', type:'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'dueDate', type:'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'addDate', type:'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'completeDate', type:'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'notes', type:'string'},
	{name: 'completed', type:'boolean'},
	{name: 'priority', type:'int'}
]);

 // generates a renderer function to be used for textual date groups
function textDate(){
	// create the cache of ranges to be reused
	var today = new Date().clearTime(true);
	var year = today.getFullYear();
	var todayTime = today.getTime();
	var yesterday = today.add('d', -1).getTime();
	var tomorrow = today.add('d', 1).getTime();
	var weekDays = today.add('d', 6).getTime();
	var lastWeekDays = today.add('d', -6).getTime();

	return function(date){
		if(!date) {
			return '(No Date)';
		}
		var notime = date.clearTime(true).getTime();

		if (notime == todayTime) {
			return 'Today';
		}
		if(notime > todayTime){
			if (notime == tomorrow) {
				return 'Tomorrow';
			}
			if (notime <= weekDays) {
				return date.format('l');
			}
		}else {
			if(notime == yesterday) {
				return 'Yesterday';
			}
			if(notime >= lastWeekDays) {
				return 'Last ' + date.format('l');
			}
		}            
		return date.getFullYear() == year ? date.format('D m/d') : date.format('D m/d/Y');
   }
}
