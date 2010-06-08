/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');
/**
 * Ext.ux.ComboBox
 * @extends Ext.form.ComboBox
 *
 * This ComboBox simplifies the ComboBox creation by including an array of values
 * 
 */
 
TaskManager.PriorityComboBox = function(config) {
	
	Ext.apply(config,{
		store: new Ext.data.SimpleStore({
		fields: ['disp','val'],
			data : [['High',1],['Med',2],['Low',3],['Pending',4],['Closed',5]]
		}),
		valueField:'val',
		displayField:'disp',
		typeAhead: true,
		editable: false,
		mode: 'local',
		triggerAction: 'all',
		selectOnFocus:true
	});
	
	TaskManager.PriorityComboBox.superclass.constructor.call(this, config);
};
Ext.extend(TaskManager.PriorityComboBox, Ext.form.ComboBox, {});

// register the  TaskManager.PriorityComboBox class with an xtype of report
Ext.reg('priority_combobox', TaskManager.PriorityComboBox);