/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.ForumStore
 * @extends Ext.data.DirectStore
 *
 * Provides the store for grouping
 * 
 */
TaskManager.ForumStore = function(settings){
	
	TaskManager.ForumStore.superclass.constructor.call(this, {
		//autoLoad:true,
		paramsAsHash: true,
		api: {
			read: 		TaskAction.loadForums
		},

        reader: new Ext.data.JsonReader({
				root: 'rows'
				,totalProperty: 'totalCount'
				,idProperty: 'forum'
        }, [
			{name: 'forum', mapping: 'forum'}
		]),
		listeners: {
			scope: this,
			beforeload: function() {
				this.setBaseParam('repo_id',this.getRepoId());
			}
		}
    });
};

Ext.extend(TaskManager.ForumStore, Ext.data.DirectStore, {
	setRepoId: function(repo_id) {
		this.repo_id = repo_id;
	},
	getRepoId: function() {
		return this.repo_id;
	},
	loadStore: function(repo_id) {
		this.setRepoId(repo_id);
		this.load();
	},
	reload: function() {
		this.load();
	}
});