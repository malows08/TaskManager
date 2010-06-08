<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */

        include_once "bootstrap.php";
	$user_session = new Zend_Session_Namespace('Default');
	$user = $user_session->user;
	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="icon" type="image/vnd.microsoft.icon" href="favicon.ico">
<title>Task Manager</title>

<link rel="stylesheet" type="text/css" href="css/application.css">
<link rel="stylesheet" type="text/css" href="css/Ext.ux.Statusbar.css">
<link rel="stylesheet" type="text/css" href="css/Ext.ux.GroupSummary.css">

<?php
	$extjs = new ExtJs('3.1.1');
	$extjs->includeIt();
?>
<script type="text/javascript" src="php/api.php"></script>

<!-- extensions and plugins -->
<script type="text/javascript" src="js/plugins/Ext.ux.CompleteColumn.js"></script>
<script type="text/javascript" src="js/plugins/Ext.ux.StatusBar.js"></script>
<script type="text/javascript" src="js/plugins/Ext.ux.GroupSummary.js"></script>
<script type="text/javascript" src="js/plugins/miframe/multidom.js"></script>
<script type="text/javascript" src="js/plugins/miframe/mif.js"></script>

<!-- page specific classes -->
<script type="text/javascript" src="js/application.js"></script>
<script type="text/javascript" src="js/classes/TaskGrid.js"></script>
<script type="text/javascript" src="js/classes/LeftPanel.js"></script>
<script type="text/javascript" src="js/classes/ContentPanel.js"></script>
<script type="text/javascript" src="js/classes/TaskDetails.js"></script>
<script type="text/javascript" src="js/classes/ForumStore.js"></script>
<script type="text/javascript" src="js/classes/PrimeStore.js"></script>
<script type="text/javascript" src="js/classes/PriorityComboBox.js"></script>
<script type="text/javascript" src="js/classes/ReposGrid.js"></script>
<script type="text/javascript" src="js/classes/ReposWindow.js"></script>
<script type="text/javascript" src="js/classes/ManageReposWindow.js"></script>
<script type="text/javascript" src="js/classes/UserSearchCombo.js"></script>
<script type="text/javascript" src="js/classes/PrivilegeComboBox.js"></script>
<script type="text/javascript" src="js/classes/StatusBar.js"></script>
<script type="text/javascript" src="js/classes/SettingsWindow.js"></script>
<script type="text/javascript" src="js/classes/HeaderPanel.js"></script>

<script type="text/javascript">
	Ext.onReady(function() {
		TaskManager.app.init({
			user: {
				fullname: '<?php echo addslashes($user->getFullname(false))?>'
			}
		});
	});
</script>

</head>

<body>

<span></span> 

<!-------------------->
<!-- Left Side Bar --->
<!-------------------->

<ul id="task-actions" class="x-hidden"> 
	<li id="new-task"> 
		<img src="img/s.gif" class="icon-note-add"/> 
		<a id="action-new" href="#">Add a new Task</a> 
	</li>
	<li style="display:none;"> 
		<img src="img/s.gif" class="icon-note-edit"/> 
		<a id="action-edit" href="#">Edit Task</a> 
	</li> 
	<li style="display:none;"> 
		<img src="img/s.gif" class="icon-complete"/> 
		<a id="action-complete" href="#">Mark selected Item<span class="s">s</span> completed</a> 
	</li> 
	<li style="display:none;"> 
		<img src="img/s.gif" class="icon-active"/> 
		<a id="action-active" href="#">Mark selected Item<span class="s">s</span> active</a> 
	</li> 
	<li style="display:none;"> 
		<img src="img/s.gif" class="icon-note-delete"/> 
		<a id="action-delete" href="#">Archive selected Item<span class="s">s</span></a> 
	</li> 
</ul> 

<ul id="task-grouping" class="x-hidden"> 
	<li> 
		<img src="img/s.gif" class="icon-by-date"/> 
		<a id="group-date" href="#">By Date</a> 
	</li> 
	<li> 
		<img src="img/s.gif" class="icon-by-forum"/> 
		<a id="group-forum" href="#">By Forum</a> 
	</li> 
	<li> 
		<img src="img/s.gif" class="icon-by-prime"/> 
		<a id="group-prime" href="#">By Prime</a> 
	</li>
	<li> 
		<img src="img/s.gif" class="icon-by-priority"/> 
		<a id="group-priority" href="#">By Priority</a> 
	</li> 
	<li> 
		<img src="img/s.gif" class="icon-no-group"/> 
		<a id="no-group" href="#">No Grouping</a> 
	</li> 
</ul> 

<ul id="task-views" class="x-hidden"> 
	<li> 
		<img src="img/s.gif" class="icon-show-all"/> 
		<a id="view-all" href="#">All Tasks</a> 
	</li> 
	<li> 
		<img src="img/s.gif" class="icon-show-active"/> 
		<a id="view-active" href="#">Active Tasks</a> 
	</li> 
	<li> 
		<img src="img/s.gif" class="icon-show-complete"/> 
		<a id="view-complete" href="#">Completed Tasks</a> 
	</li> 
</ul> 

<ul id="task-folder">
	<li> 
		<img src="img/s.gif" class="icon-inbox"/> 
		<a id="get-inbox" href="#">Inbox</a> 
	</li> 
	<li> 
		<img src="img/s.gif" class="icon-archive"/> 
		<a id="get-archive" href="#">Archive</a> 
	</li> 
</ul>

<ul id="task-repo">
	<li> 
		<img src="img/s.gif" class="icon-change-repo"/> 
		<a id="change-repo" href="#">Change Repository</a> 
	</li> 
	<li> 
		<img src="img/s.gif" class="icon-manage-repo"/> 
		<a id="manage-repo" href="#">Manage Repositories</a> 
	</li>
</ul>

</body>
</html>
