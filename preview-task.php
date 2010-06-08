<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>

<?php

    include_once "bootstrap.php";

	// getting Task id from Request header
	$task_id = $_REQUEST['task_id'];
	
	// getting connection to database
	$db = Zend_Registry::get('dbAdapter');
	
	// getting the requested task
	$select = $db->select()->from('v_tasks',array(
                'TASK_ID'=> 'ID',
                'REPO_ID',
                'TITLE',
                'FORUM',
                'PRIME',
                'NOTES',
                'DATE_DUE' => new Zend_Db_Expr("date_format(DATE_DUE,'%Y-%m-%d %H:%i:%s')"),
                'DATE_CREATED' => new Zend_Db_Expr("date_format(DATE_CREATED,'%Y-%m-%d %H:%i:%s')"),
                'USER_ID_CREATED',
                'DATE_UPDATED' => new Zend_Db_Expr("date_format(DATE_UPDATED,'%Y-%m-%d %H:%i:%s')"),
                'USER_ID_UPDATED',
                'DATE_ADDED' => new Zend_Db_Expr("date_format(DATE_ADDED,'%Y-%m-%d %H:%i:%s')"),
                'DATE_COMPLETED' => new Zend_Db_Expr("date_format(DATE_COMPLETED,'%Y-%m-%d %H:%i:%s')"),
                'USER_ID_COMPLETED',
                'IS_COMPLETED',
                'PRIORITY'
                ))
        ->where('ID = ' . $task_id);

	$tasks = $select->query()->fetchAll();
	$task = $tasks[0];	
	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>preview Task</title>
<script type="text/javascript">

	window.onload=function(){
		var el_action = document.getElementById('action');
		var el_a = document.createElement('a');
		
		// check if in iFrame
		if (top.location!= self.location) {
			el_a.setAttribute('href', 'Javascript:go_to_printer_friendly(<?php echo $task_id;?>);');
			el_a.appendChild(document.createTextNode("Printer friendly"));	
		} else {
			el_a.setAttribute('href', 'Javascript:window.print();');
			el_a.appendChild(document.createTextNode("Print"));	
		}
		
		// append link to action
		el_action.appendChild(el_a);
	}

	function go_to_printer_friendly(task_id) {
		window.open(self.location + '?task_id=' + task_id);
	}
</script>
<style type="text/css">
	body {
		background-color:#FFFFFF;
		margin-right:80px;
	}
	.label {
		color:#666666;
		text-align:right;
		font-weight:bold;
	}
	.value {
		border: 1px solid #999999
	}
	.task_details td {
		padding:5px;
	}
</style>
</head>

<body>

<table width="100%" class="task_details">
	<tr>
		<td>&nbsp;</td>
		<td id="action"></td>
		<td class="label">ID:</td>
		<td class="value"><?php echo $task_id;?></td>
	</tr>
	<tr>
		<td class="label">Title:</td>
		<td class="value"><b><?php echo $task['title'];?></b></td>
		<td class="label">Created On:</td>
		<td class="value"><?php echo $task['DATE_CREATED'];?></td>
	</tr>
	<tr>
		<td class="label">Forum:</td>
		<td class="value"><?php echo $task['forum'];?></td>
		<td class="label">Due On:</td>
		<td class="value"><?php echo $task['DATE_DUE'];?></td>
	</tr>
	<tr>
		<td class="label">Prime:</td>
		<td class="value"><?php echo $task['prime'];?></td>
		<td class="label">Completed On:</td>
		<td class="value"><?php echo $task['DATE_COMPLETED'];?></td>
	</tr>
	<tr>
		<td class="label" valign="top">Notes:</td>
		<td class="value" colspan="3" style=""><?php echo $task['notes'];?></td>
	</tr>
</table>

</body>
</html>
