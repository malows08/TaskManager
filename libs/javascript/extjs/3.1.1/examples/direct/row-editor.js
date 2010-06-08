/*!
 * Ext JS Library 3.1.1
 * Copyright(c) 2006-2010 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
	Ext.Direct.addProvider(Ext.app.REMOTING_API);

    var Employee = Ext.data.Record.create([{
        name: 'name',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    },{
        name: 'active',
        type: 'bool'
    }]);



    var store = new Ext.data.DirectStore({
		api: {
			read: GridAction.read,
			update: GridAction.update,
			create: GridAction.create
		},
		autoLoad: true,
        reader: new Ext.data.JsonReader({
				root: 'rows',
				totalProperty:'totalCount',
				idProperty: 'id',
				fields: Employee
		}),
			writer: new Ext.data.JsonWriter({
					returnJson: true,
					writeAllFields: true,
					encode: false
    		})
    });

    var editor = new Ext.ux.grid.RowEditor({
        saveText: 'Update'
    });

    var grid = new Ext.grid.GridPanel({
        store: store,
        width: 600,
        region:'center',
        margins: '0 5 5 5',
        autoExpandColumn: 'name',
        plugins: [editor],
        tbar: [{
            iconCls: 'icon-user-add',
            text: 'Add Employee',
            handler: function(){
                var e = new Employee({
                    name: 'New Guy',
                    email: 'new@exttest.com',
                    start: (new Date()).clearTime(),
                    salary: 50000,
                    active: true
                });
                editor.stopEditing();
                store.insert(0, e);
                grid.getView().refresh();
                grid.getSelectionModel().selectRow(0);
                editor.startEditing(0);
            }
        }],

        columns: [
        new Ext.grid.RowNumberer(),
        {
            id: 'name',
            header: 'First Name',
            dataIndex: 'name',
            width: 220,
            sortable: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        },{
            header: 'Email',
            dataIndex: 'email',
            width: 150,
            sortable: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                vtype: 'email'
            }
        },{
            xtype: 'booleancolumn',
            header: 'Active',
            dataIndex: 'active',
            align: 'center',
            width: 50,
            trueText: 'Yes',
            falseText: 'No',
            editor: {
                xtype: 'checkbox'
            }
        }]
    });

  

    var layout = new Ext.Panel({
        title: 'Employee Salary by Month',
        layout: 'border',
        layoutConfig: {
            columns: 1
        },
        width:600,
        height: 600,
        items: [grid]
    });
    layout.render(Ext.getBody());

});