/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/*	HeaderPanel
--------------------------------------------------*/
TaskManager.HeaderPanel = function(settings) {
	
	var default_params = {
		border: false,
		layout:'anchor',
		region:'north',
		cls: 'docs-header',
		height:25,
		items: [      
			{
				xtype: 'toolbar',
				cls:'top-toolbar',
				items:['<b>Task Manager</b>'
					,'-'					
					,'->','-',{
						text: 'Settings',
						iconCls: 'icon-manage-settings',
						scope: this,
						handler: this.fireShowSettings
					},'-',{
						text: '<b>' + settings.username + '</b> - Log out',
						iconCls: 'icon-logout',
						scope: this,
						handler: this.fireLogout
					}
				]
			}//end Toolbar
		]
	};
	Ext.apply(this.default_params,settings);
	
	// adding events to reload the Menu
	this.addEvents('logout','showsettings');
	
	TaskManager.HeaderPanel.superclass.constructor.call(this, default_params);
}

Ext.extend(TaskManager.HeaderPanel, Ext.Panel, {
	fireShowSettings: function() {
		this.fireEvent('showsettings');
	},
	fireLogout: function() {
		this.fireEvent('logout');
	}
});
