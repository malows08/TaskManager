<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php

include_once "../bootstrap.php";

class TaskAction {

   /**
     * Method to Load Tasks from database
     * 
     * @return json array with user label keys
     */	
	function loadTasks($params) {
		if(!isset($params->repo_id))	$params->repo_id = 0;
		
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
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
            ->where('REPO_ID = ' . $params->repo_id)
            ->where('IS_ARCHIVE = ' . ($params->is_archive?1:0));


		$tasks = $select->query()->fetchAll();

                // outputting each task
		$rows = array();		
		foreach($tasks AS $task) {
			$row = array();
			$row['repo_id'] 		= $task['repo_id'];
			$row['taskId'] 			= $task['TASK_ID'];
			$row['title'] 			= $task['title'];
			$row['forum'] 			= $task['forum'];
			$row['prime']			= $task['prime'];
			$row['createDate']		= $task['DATE_CREATED'];
			$row['dueDate'] 		= $task['DATE_DUE'];
			$row['addDate'] 		= $task['DATE_ADDED'];
			$row['completeDate'] 	= $task['DATE_COMPLETED'];
			$row['notes'] 			= $task['notes'];
			$row['completed'] 		= (bool)$task['is_completed'];
			$row['priority'] 		= $task['priority'];
			$rows[]					= $row;
		}
		
		$result = array(
			"totalCount" => sizeof($rows),
			"rows" => $rows
		);

		return $result;
	}

   /**
     * Method to Delete Tasks, set is_archive = 1
     * 
     * @return json array with user label keys
     */	
	function deleteTask($data) {
	
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');

	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;		
			
		$id = $data->rows;
		
		// fake delete - moving to trash
		$db->update('tasks', array(
                        'DATE_UPDATED'		=> new Zend_Db_Expr("NOW()"),
                        'USER_ID_UPDATED'	=> $user->getUserId(),
                        'IS_ARCHIVE'		=> 1
                ), "ID = ".$id);
		return array("success"=>true);
	}
 
   /**
     * Method to update a Task
     * 
     * @return json array with user label keys
     */	
	function updateTask($data) {
		//firelog($data);
		
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		$task_mods = $data->rows;

	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;
		
		// MANY TASKS TO UPDATE
		if(array_key_exists("0",$task_mods)) {
			//firelog("many tasks");
			$rows = array();
			foreach($task_mods as $tm) {
				$task_mod = (object)$tm;

				// update task
				$db->update('tasks', array(
                                        'DATE_UPDATED'		=> new Zend_Db_Expr("sysdate"),
                                        'USER_ID_UPDATED'	=> $user->getUserId(),
                                        'DATE_COMPLETED'	=> ($task_mod->completed?new Zend_Db_Expr("NOW()"):null),
                                        'USER_ID_COMPLETED'	=> ($task_mod->completed?$user->getUserId():null),
                                        'IS_COMPLETED'		=> ($task_mod->completed?1:0)
                                ), "ID = ".$task_mod->taskId);
										
				// fetch task
				$select = $db->select()->from('tasks',array(
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
                                        'IS_COMPLETED'
                                        ))
                                ->where("ID = ".$task_mod->taskId);
														
				// return task					
				$task = $select->query()->fetch();	
				
				$row = array();
				$row['repo_id']		= $task['REPO_ID'];
				$row['taskId'] 		= $task['TASK_ID'];
				$row['title'] 		= $task['TITLE'];
				$row['forum'] 		= $task['FORUM'];
				$row['prime']		= $task['PRIME'];
				$row['createDate']	= $task['DATE_CREATED'];
				$row['dueDate'] 	= $task['DATE_DUE'];
				$row['addDate'] 	= $task['DATE_ADDED'];
				$row['completeDate'] 	= $task['DATE_COMPLETED'];
				$row['notes'] 		= $task['NOTES'];
				$row['completed'] 	= (bool)$task['IS_COMPLETED'];
				$rows[] = $row;
			}
			
			return $rows;
		
		// ONE TASKS TO UPDATE	
		} else {
			$task_mod = (object)$task_mods;
			
			// update task
			$db->update('tasks', array(
                                'DATE_UPDATED'		=> new Zend_Db_Expr("NOW()"),
                                'USER_ID_UPDATED'	=> $user->getUserId(),
                                'DATE_COMPLETED'	=> ($task_mod->completed?new Zend_Db_Expr("NOW()"):null),
                                'USER_ID_COMPLETED'	=> ($task_mod->completed?$user->getUserId():null),
                                'IS_COMPLETED'		=> ($task_mod->completed?1:0)
                        ), "ID = ".$task_mod->taskId);
			
			// fetch task
			$select = $db->select()->from('tasks',array(
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
                                'IS_COMPLETED'
                                ))
                        ->where("ID = ".$task_mod->taskId);

			// return task					
			$task = $select->query()->fetch();

			$row = array();
			$row['repo_id']		= $task['REPO_ID'];
			$row['taskId'] 		= $task['TASK_ID'];
			$row['title'] 		= $task['TITLE'];
			$row['forum'] 		= $task['FORUM'];
			$row['prime']		= $task['PRIME'];
			$row['createDate']	= $task['DATE_CREATED'];
			$row['dueDate'] 	= $task['DATE_DUE'];
			$row['addDate'] 	= $task['DATE_ADDED'];
			$row['completeDate'] 	= $task['DATE_COMPLETED'];
			$row['notes'] 		= $task['NOTES'];
			$row['completed'] 	= (bool)$task['IS_COMPLETED'];	
			
			return $row;
		}
	} 

   /**
     * Method to create a new Task
     * 
     * @return json array with user label keys
     */	
	function createTask($sent_data) {
	
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		$task_new = $sent_data->rows;
		//firelog($task_new);

	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;

                // insderting the data
                $db->insert("tasks",array(
                    "repo_id"   => $task_new->repo_id,
                    "title"     => $task_new->title,
                    "priority"  => $task_new->priority,
                    "forum"     => $task_new->forum,
                    "prime"     => $task_new->prime,
                    "date_due"  => ($task_new->dueDate?str_replace("T"," ",$task_new->dueDate):null),
                    "date_created" => new Zend_Db_Expr("NOW()"),
                    "user_id_created" => $user->getUserId(),
                    "date_updated"  => new Zend_Db_Expr("NOW()"),
                    "user_id_created" => $user->getUserId(),
                    "date_added"    => new Zend_Db_Expr("NOW()"),
                    "is_completed"  => 0,
                    "is_archive"   => 0
                ));

                $new_task_id = $db->lastInsertId();

                // fetch task
                $select = $db->select()->from('tasks',array(
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
                        'IS_COMPLETED'
                        ))
                ->where("ID = ".$new_task_id);

                // return task
                $task = $select->query()->fetch();

                $row = array();
                $row['repo_id']		= $task['REPO_ID'];
                $row['taskId'] 		= $task['TASK_ID'];
                $row['title'] 		= $task['TITLE'];
                $row['forum'] 		= $task['FORUM'];
                $row['prime']		= $task['PRIME'];
                $row['createDate']	= $task['DATE_CREATED'];
                $row['dueDate'] 	= $task['DATE_DUE'];
                $row['addDate'] 	= $task['DATE_ADDED'];
                $row['completeDate'] 	= $task['DATE_COMPLETED'];
                $row['notes'] 		= $task['NOTES'];
                $row['completed'] 	= (bool)$task['IS_COMPLETED'];
		
		return $row;
		
	}
	
   /**
     * Method to save a Task
     * 
     * @return boolean
     */	
	function saveTask($task) {
	
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');

	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;
		
		// formatting data
		if($task->dueDate) {
			$due_date = $task->dueDate;
		} else
			$due_date = null;
			
		$add_date = $task->addDate;
		
		// completed	
		$completed = isset($task->completed);
		$complete_date = ($task->completeDate?
                                    $task->completeDate:
                                    new Zend_Db_Expr("NOW()")
		);
		
		// update task
		$db->update('tasks', array(
                                    'DATE_UPDATED'	=> new Zend_Db_Expr("NOW()"),
                                    'USER_ID_UPDATED'	=> $user->getUserId(),
                                    'TITLE'		=> $task->title,
                                    'PRIORITY'		=> $task->priority,
                                    'FORUM'		=> $task->forum,
                                    'PRIME'		=> $task->prime,
                                    'NOTES'		=> $task->notes,
                                    'DATE_DUE'		=> $due_date,
                                    'DATE_ADDED'	=> $add_date,
                                    'DATE_COMPLETED'	=> ($completed?$complete_date :null),
                                    'USER_ID_COMPLETED'	=> ($completed?$user->getUserId():null),
                                    'IS_COMPLETED'	=> ($completed?1:0)
		), "ID = ".$task->taskId);
		
		return array('success'=>true);
	} 	
 
    /**
     * Method to Load Forums from database
     * 
     * @return json array with user label keys
     */	
	function loadForums($params) {

		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		$select = $db->select()->from('v_tasks',array(
									'FORUM'
									))
								->where('REPO_ID = ' . (isset($params->repo_id)?$params->repo_id:0))
								->where('FORUM IS NOT NULL')
								->group(array('FORUM'))
								->order(array('UPPER(FORUM)'));				

		$rows = array();		
		foreach($select->query()->fetchAll() AS $forum) {
			$row = array();
			$row['forum'] 	= $forum['forum'];
			$rows[]		= $row;
		}
		
		$result = array(
			"totalCount" => sizeof($rows),
			"rows" => $rows
		);

		return $result;
	}
 
     /**
     * Method to Load Primes from database
     * 
     * @return json array with user label keys
     */	
	function loadPrimes($params) {

		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		$select = $db->select()->from('v_tasks',array(
									'PRIME'
									))
								->where('REPO_ID = ' . (isset($params->repo_id)?$params->repo_id:0))
								->where('PRIME IS NOT NULL')
								->group(array('PRIME'))
								->order(array('UPPER(PRIME)'));				

		$rows = array();		
		foreach($select->query()->fetchAll() AS $prime) {
			$row = array();
			$row['prime'] 	= $prime['prime'];
			$rows[]			= $row;
		}
		
		$result = array(
			"totalCount" => sizeof($rows),
			"rows" => $rows
		);

		return $result;
	}
 
 
}
?>