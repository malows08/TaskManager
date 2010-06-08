/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.UserSearchCombo
 * @extends Ext.Panel
 *
 * This is a Combo extension speicific to User searches
 * 
 */
TaskManager.UserSearchCombo = function(settings) {

	this.store = new Ext.data.DirectStore({
		directFn: RepoAction.getUsers,  
		paramsAsHash: true,	// needed because len of getUsers > 1
		root: 'users',
		totalProperty: 'totalCount',
		idProperty: 'user_id',
		sortInfo: {
			field: 'firstname',
			direction: 'DESC'
		},
		fields: [
			{name: 'firstname', mapping: 'firstname'},
			{name: 'lastname', mapping: 'lastname'},
			{name: 'user_id', mapping: 'user_id'}
		]
	});	
	
	var default_params = {
			store: this.store,
			typeAhead: false,
			minChars: 2,
			loadingText: 'Searching...',
			hideTrigger:true,
			tpl: new Ext.XTemplate(
				'<tpl for="."><div class="search-item">',
					'<h3><span>{lastname}, {firstname}</span></h3>{user_id}',
					'',
				'</div></tpl>'
			),
			itemSelector: 'div.search-item'
	};
	
	Ext.apply(default_params,settings);
	
	TaskManager.UserSearchCombo.superclass.constructor.call(this, default_params);
}

Ext.extend(TaskManager.UserSearchCombo, Ext.form.ComboBox, {

});