Ext.ns('TaskManager');
/**
 * Ext.ux.ComboBox
 * @extends Ext.form.ComboBox
 *
 * This ComboBox simplifies the ComboBox creation by including an array of values
 * 
 */
 
TaskManager.PrivilegeComboBox = function(config) {
	
	Ext.apply(config,{
		store: new Ext.data.SimpleStore({
		fields: ['disp','val'],
			data : [['ADMIN','ADMIN'],['VIEW','VIEW']]
		}),
		valueField:'val',
		displayField:'disp',
		typeAhead: true,
		editable: false,
		mode: 'local',
		triggerAction: 'all',
		selectOnFocus:true
	});
	
	TaskManager.PrivilegeComboBox.superclass.constructor.call(this, config);
};
Ext.extend(TaskManager.PrivilegeComboBox, Ext.form.ComboBox, {});

// register the  TaskManager.PrivilegeComboBox class with an xtype of report
Ext.reg('privilege_combobox', TaskManager.PrivilegeComboBox);