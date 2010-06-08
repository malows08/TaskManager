/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.SettingsWindow
 * @extends Ext.Window
 *
 * This Ext.Window shows all TaskManager Settings
 * 
 */

TaskManager.SettingsWindow = function(settings) {

	this.SaveBtn = new Ext.Button({
		text: 'Save',
		iconCls: 'icon-save',
		scope: this, 
		handler: this.doSave
	});
	
	this.send_box = new Ext.form.Radio({
				boxLabel: 'Yes', 
				name: 'receive_alerts', 
				inputValue: '1'
	});
	this.nosend_box = new Ext.form.Radio({
				boxLabel: 'No', 
				name: 'receive_alerts', 
				inputValue: '0'
	});
	this.receiveAlerts = new Ext.form.RadioGroup({
			fieldLabel: 'Receive Alerts By Email',
			labelSeparator: ' ?',
			name: 'receive_alerts',
			width: 300, // right overflow - firefox hack
			items: [this.send_box,this.nosend_box]
	});
	this.emailField = new Ext.form.TextField({
			fieldLabel: 'Email',
			name: 'email',
			anchor: '95%',
			fieldClass: "x-item-disabled",
			readOnly: true
	});
	
	/* FieldSet
	-------------------------------------*/
	var fieldset = new Ext.form.FieldSet({
						xtype:'fieldset',
					//	title: 'Local',
						autoHeight:true,
						items: [	
									this.emailField,
									this.receiveAlerts
								]
					});	
	

	this.settingsPanel = new Ext.form.FormPanel({
			api: {
				load: SettingsAction.get
			},
			autoLoad: false,
			baseParams: {},
			paramsAsHash: true,
			waitMsg:'Loading',	
			
			//title: 'Details',
			region:'center',
        	frame:true,
			layout: 'vbox',
			layoutConfig: {
				align: 'stretch'
			},
			labelWidth: 200,
			items:[fieldset], //end form items
			buttons: [this.SaveBtn]
	});
	
	var default_params = {
            title: 'Settings',
			iconCls: 'icon-manage-settings',
            closeAction: 'hide',
			minimizable: false,
            maximizable: true,
			constrainHeader:true,
			hidden: false,
			modal: true,
            width:700,
            height:250,
            plain:true,
            layout: 'border',
			resizable: true,
            items: [this.settingsPanel],
			listeners: {
				scope:this,
				show: function() {
					this.settingsPanel.load();
				}
			}
	};
	// overriding the defaults
	Ext.apply(default_params,settings);


	TaskManager.SettingsWindow.superclass.constructor.call(this, default_params);
}

Ext.extend(TaskManager.SettingsWindow, Ext.Window, {
		   
	show: function() {
		TaskManager.SettingsWindow.superclass.show.apply(this, arguments);	
	},
	
	hide: function() {
		TaskManager.SettingsWindow.superclass.hide.apply(this, arguments);	
	},
	
	// Saving function
	doSave: function() {
		var mask = new Ext.LoadMask(this.settingsPanel.getEl());
		mask.show();
		
		// setting values
		var values = this.settingsPanel.getForm().getValues();
		
		// direct call
		SettingsAction.save(values,function() {mask.hide();},this);
	}
});