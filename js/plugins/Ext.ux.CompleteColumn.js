// Grid column plugin that does the complete/active button in the left-most column
Ext.ux.CompleteColumn = function(){
    var grid;
	var locked = false;

    function getRecord(t){
        var index = grid.getView().findRowIndex(t);
        return grid.store.getAt(index);
    }

    function onMouseDown(e, t){
        if(!locked && Ext.fly(t).hasClass('task-check')){
            e.stopEvent();
            var record = getRecord(t);
            record.set('completed', !record.data.completed);
            grid.store.applyFilter();
        }
    }

    function onMouseOver(e, t){
        if(!locked && Ext.fly(t).hasClass('task-check')){
            Ext.fly(t.parentNode).addClass('task-check-over');
        }
    }

    function onMouseOut(e, t){
        if(!locked && Ext.fly(t).hasClass('task-check')){
            Ext.fly(t.parentNode).removeClass('task-check-over');
        }
    }

    Ext.apply(this, {
        width: 22,
        header: '<div class="task-col-hd"></div>',
        menuDisabled:true,
        fixed: true,
        id: 'task-col',
        renderer: function(){
            return '<div class="task-check"></div>';
        },
        init : function(xg){
            grid = xg;
            grid.on('render', function(){
                var view = grid.getView();
                view.mainBody.on('mousedown', onMouseDown);
                view.mainBody.on('mouseover', onMouseOver);
                view.mainBody.on('mouseout', onMouseOut);
            });
        },
		lock: function() {
			locked = true;
		},
		unlock: function() {
			locked = false;
		}
    });
};