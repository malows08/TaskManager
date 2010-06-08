/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.TaskDetails
 * @extends Ext.Window
 *
 * This Panel shows editable details
 * 
 */
TaskManager.TaskDetails = function(settings) {
	
	this.record = null;
	
	// Form fields
	this.titleField = new Ext.form.TextField({
		fieldLabel: 'Task', 
		name: 'title', 
		id: 'title',
		allowBlank: false,
		anchor:'96%'	
	});
	this.dueDate = new Ext.form.DateField({
		format: 'Y-m-d',
		fieldLabel: 'Due Date', 
		name: 'dueDate', 
		id: 'dueDate', 
		anchor:'95%'
	});
	this.completedField = new Ext.form.Checkbox({
		fieldLabel: 'Completed', 
		name: 'completed', 
		id: 'completed', 
		anchor:'95%'
	});
	this.taskId = new Ext.form.TextField({
		fieldLabel: 'ID', 
		name: 'taskId', 
		id: 'taskId',
		allowBlank: false, 
		readOnly: true,
		anchor:'95%'
	});
	this.addDate = new Ext.form.DateField({
		format: 'Y-m-d',
		fieldLabel: 'Date Added', 
		name: 'addDate', 
		id: 'addDate',
		allowBlank: false,
		disabled: true,
		anchor:'95%'
	});
	this.completeDate = new Ext.form.DateField({
		format: 'Y-m-d',
		fieldLabel: 'Completed Date', 
		name: 'completeDate', 
		id: 'completeDate',
		disabled: true,
		anchor:'95%'
	});
	this.priorityField = new TaskManager.PriorityComboBox({
		fieldLabel: 'Priority',
		name: 'priority',
		id: 'priority',
		anchor:'95%'
	});
	
	// Buttons
	this.SaveBtn = new Ext.Button({
		text: 'Save',
		iconCls: 'icon-save',
		handler: this.onSave,
		scope: this
	});
	this.PreviewBtn = new Ext.Button({
		text: 'Preview Task',
		iconCls: 'icon-note-go',
		handler: this.onPreview,
		scope: this
	});
	
	// Fields to be handled
	this.primeField = new Ext.form.ComboBox({
		displayField: 'prime',
		triggerAction: 'all',
		mode:'local',
		selectOnFocus:true,
		listClass:'x-combo-list-small',
		fieldLabel: 'Prime', 
		name: 'prime', 
		id: 'prime', 
		anchor:'95%'
	});
	this.primeField.on('focus',this.firePrimeFocus,this);
	
	this.forumField = new Ext.form.ComboBox({
		displayField: 'forum',
		triggerAction: 'all',
		mode:'local',
		selectOnFocus:true,
		listClass:'x-combo-list-small',
		fieldLabel: 'Forum', 
		name: 'forum', 
		id: 'forum', 
		anchor:'95%'
	});
	this.forumField.on('focus',this.fireForumFocus,this);

	// html editor
	this.notes = new Ext.form.HtmlEditor({
            fieldLabel:'Notes',
			name: 'notes',
			id: 'notes',
           	height:300,
            anchor:'98%'
 	});

	
	// building Form Panel
	this.formPanel = new Ext.FormPanel({
		frame: true,
		split: true,
		autoScroll: true,
		labelAlign: 'right',
		border: true,
		collapsible:false,
		flex: 1,

		items: [
			this.titleField ,
			{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
					this.primeField,
					this.forumField,
					this.dueDate,
					this.priorityField
				]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
					this.taskId,
					this.addDate,
					this.completeDate,
					this.completedField
				]
            }]
        },
		this.notes
		],
		buttons: [
				  this.PreviewBtn,
				  this.SaveBtn
		]
	});


	// The Window Panel Configs
	this.default_params = {
            title: 'Task -  Details',
			iconCls: 'icon-edit',
            closeAction: 'hide',
			modal: true,
			hidden: true,
            width:750,
            height:550,
			layout: 'vbox',
			layoutConfig: {
				align: 'stretch'
			},
			items: [this.formPanel],
			resizable: true,
			closable: true,
            minimizable: false,
            maximizable: true
	};
	// overriding the defaults
	Ext.apply(this.default_params,settings);
	
	// adding events
	this.addEvents('taskSaved');
	
	TaskManager.TaskDetails.superclass.constructor.call(this, this.default_params);
}

Ext.extend(TaskManager.TaskDetails, Ext.Window, {
	   
	show: function() {
		TaskManager.TaskDetails.superclass.show.apply(this, arguments);	
	},
	
	hide: function() {
		TaskManager.TaskDetails.superclass.hide.apply(this, arguments);	
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
		this.forumField.bindStore(store);
	},
	attachPrimeStore: function(store) {
		this.primeField.bindStore(store);
	},

    /**
     * loadRecord
     * @param {Record} rec
     */
    loadRecord : function(rec) {
        this.record = rec;

		// need to wait for form to render before loading records
		if(this.formPanel.rendered)	{
			this.formPanel.getForm().loadRecord(rec);
		} else {
			var self = this;
			(function() {
				self.formPanel.getForm().loadRecord(rec);
			}).defer(100);
		}
    },
	
    /**
     * onSave
     * Saving the form
     */
	 onSave: function() {
		var mask = new Ext.LoadMask(this.formPanel.getEl());
		mask.show();
		
		// fixing priority value to raw data
		var values = this.formPanel.getForm().getValues();
		Ext.apply(values, {priority: this.priorityField.getValue()});
		
		// direct call
		TaskAction.saveTask(values,
			function(resp) {
				if(resp.success) this.fireEvent('taskSaved');
				mask.hide();
		},this);
	 },
	 
	 
    /**
     * onPreview
     * Previewing the task
     */	
	 onPreview: function() {
		this.getPreviewTaskWindow().show();
		this.getPreviewTaskWindow().submitAsTarget({
				   url      : 'preview-task.php',
				   method   : 'POST',
				   params   : {task_id: this.taskId.getValue()}
			   });
	 },
	 
	getPreviewTaskWindow: function() {
		if(!this.previewtaskWindow) {
			this.previewtaskWindow = new Ext.ux.ManagedIFrame.Window({
				title         : 'Preview Task',
				iconCls: 'icon-note-go',
				width         : 845,
				height        : 469,
				maximizable   : true,
				constrain     : true,
				closeAction   : 'hide',
				loadMask      : {msg: 'Loading...'},
				autoScroll    : true,
				defaultSrc 	  : null
			});
		}
		return this.previewtaskWindow;
	},
	 
	 // Locking fields
	 blockFields: function() {
		this.primeField.disable();
		this.forumField.disable();
		this.notes.disable();
		this.titleField.disable();
		this.dueDate.disable();
		this.completedField.disable();
		this.taskId.disable();
		this.addDate.disable();
		this.completeDate.disable();
		this.priorityField.disable();
		this.SaveBtn.disable();
	 },
	 // UN Locking fields
	 unblockFields: function() {
		this.primeField.enable();
		this.forumField.enable();
		this.notes.enable();
		this.titleField.enable();
		this.dueDate.enable();
		this.completedField.enable();
		this.taskId.enable();
		this.addDate.enable();
		this.completeDate.enable();
		this.priorityField.enable();
		this.SaveBtn.enable();
	 }
});