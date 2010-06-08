/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
Ext.ns('TaskManager');

/**
 * TaskManager.PrimeStore
 * @extends Ext.data.DirectStore
 *
 * Provides the store for grouping
 * 
 */
TaskManager.PrimeStore = function(settings){
	
	
	TaskManager.PrimeStore.superclass.constructor.call(this, {
		//autoLoad:true,
		paramsAsHash: true,
		api: {
			read: 		TaskAction.loadPrimes
		},

        reader: new Ext.data.JsonReader({
				root: 'rows'
				,totalProperty: 'totalCount'
				,idProperty: 'prime'
        }, [
			{name: 'prime', mapping: 'prime'}
		]),
		listeners: {
			scope: this,
			beforeload: function() {
				this.setBaseParam('repo_id',this.getRepoId());
			}
		}
    });
};

Ext.extend(TaskManager.PrimeStore, Ext.data.DirectStore, {
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