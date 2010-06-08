<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php

include_once "../bootstrap.php";

class RepoAction {

     /**
     * Method to return the user privilege for that repo
     * 
     * @return string
     */	
	 function getRepoInfo($repo_id) {
	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;
		
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		$select = $db->select()->from('v_privileges',
						array(
							'REPO_ID',
							'REPO_NAME',
							'PRIVILEGE'
						))
					->where('REPO_ID = ' . $repo_id)
					->where('USER_ID = ' . $user->getUserID());
		$priv = $select->query()->fetch();
		
		return array(
				'repo_id' 	=> $priv['REPO_ID'],
				'priv' 		=> $priv['PRIVILEGE'],
				'repo_name' => $priv['REPO_NAME']
		);	
	 }
	 
     /**
     * Method to return all repos
     * 
     * @return string
     */	
	 function getRepos($params) {

	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;
		
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		$select = $db->select()->from('v_privileges',array(
									'REPO_ID',
									'REPO_NAME',
									'REPO_DESCRIPTION',
									'PRIVILEGE',
									'USER_ID',
									'TOTAL_INBOX',
									'TOTAL_INBOX_OPEN',
									'TOTAL_ARCHIVE'
									))
								->where('user_id = ' . $user->getUserID());
								
		if($params->restricted)	$select->where("PRIVILEGE = 'ADMIN'");

		$repos = $select->query()->fetchAll();					

		$rows = array();		
		foreach($repos AS $repo) {
			$row = array();
			$row['repo_id'] 		= $repo['REPO_ID'];
			$row['name'] 			= $repo['REPO_NAME'];
			$row['description'] 	= $repo['REPO_DESCRIPTION'];
			$row['privilege']		= $repo['PRIVILEGE'];
			$row['total_inbox']		= $repo['TOTAL_INBOX'];
			$row['total_inbox_open']= $repo['TOTAL_INBOX_OPEN'];
			$row['total_archive']	= $repo['TOTAL_ARCHIVE'];
			$rows[]					= $row;
		}
		
		$result = array(
			"totalCount" => sizeof($rows),
			"rows" => $rows
		);

		return $result;
	 }
 
      /**
     * Method to return all User for that repos
     * 
     * @return string
     */	
	 function getRepoUsers($params) {
	 
	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;
		
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		$select = $db->select()->from('v_privileges',array(
									'ID',
									'REPO_ID',
									'REPO_NAME',
									'PRIVILEGE',
									'lastname',
									'firstname',
									'USER_ID'
									))
								->where('REPO_ID = ' . $params->repo_id)
								->order('lastname');

		$repos = $select->query()->fetchAll();						

		$rows = array();		
		foreach($repos AS $repo) {
			$row = array();
			$row['id'] 				= $repo['ID'];
			$row['repo_id'] 		= $repo['REPO_ID'];
			$row['name'] 			= $repo['REPO_NAME'];
			$row['privilege']		= $repo['PRIVILEGE'];
			$row['lastname']		= $repo['lastname'];
			$row['firstname']		= $repo['firstname'];
			$row['user_id']			= $repo['user_id'];
			$rows[]					= $row;
		}
		
		$result = array(
			"totalCount" => sizeof($rows),
			"rows" => $rows
		);

		return $result;
	 }
 
     /**
     * Method to save repository info
     * 
     * @return boolean
     */	
	 function saveRepoInfo($params) {
	 
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		
		
		// update statement
		$db->update('repos', array(
                        'NAME'		=> $params->name,
                        'DESCRIPTION'	=> $params->description
                ), "ID = ".$params->repo_id);
		
		return array('success' => 'true');	
	 }
	 
     /**
     * Method to modify or add a privilege to a user on a repo
     * 
     * @return boolean
     */	
	 function addUserPrivilege($params) {
	 
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		

		// first delete user privilege
		$db->delete('privileges',array(
			'REPO_ID = ' . $params->repo_id,
			'USER_ID = ' . $params->user_id
		));
		// update statement
		$db->insert('privileges', array(
                        'REPO_ID'	=> $params->repo_id,
                        'USER_ID'	=> $params->user_id,
                        'PRIVILEGE'	=> $params->privilege,
                        "create_date"   => new Zend_Db_Expr("NOW()")
                ));		
		
		return array('success' => 'true');	
	 } 

     /**
     * Method to delete a user on a repo
     * 
     * @return boolean
     */	
	 function deleteUser($params) {
	 
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		
		$user_id_array = implode(',',$params->users);

		// first delete user privilege
		$db->delete('privileges',array(
			'REPO_ID = ' . $params->repo_id,
			"USER_ID IN ($user_id_array)"
		));
		
		return array('success' => 'true');	
	 }
	 
     /**
     * Method to add a new Repository
     * 
     * @return boolean
     */	
	 function addRepo($params) {
	 
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		
	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;
                
                // insert new repo
                $db->insert("repos",array(
                    "name"              => $params->name,
                    "create_date"       => new Zend_Db_Expr("NOW()"),
                    "create_user_id"    => $user->getUserId()
                ));
                $new_repo_id = $db->lastInsertId();

                // and insert into privileges
                $db->insert("privileges",array(
                    "repo_id"       => $new_repo_id,
                    "user_id"       => $user->getUserId(),
                    "privilege"     => "ADMIN",
                    "create_date"   => new Zend_Db_Expr("NOW()")
                ));


		return array('success' => 'true','repo_id'=> $new_repo_id);
	 }
 
  /**
     * Method to fetch UserInfo data
     * 
     * @return json array of user info
     */		
	function getUsers($data) {
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
	
		// setting some variables
		$rp 	  	= isset($data->limit) ? $data->limit : 1000;
		$start		= isset($data->start) ? $data->start : 0;
		$cur_page 	= floor(($start+$rp)/$rp);
		
		// Creating the Select Statement
		$select = $db->select()
			->from('users', array(
                                'lastname',
								'firstname',
                                'id'
                        ) /*, 'dbname' */)
			->limitPage($cur_page,$rp)
			->order(array("lastname ASC"));
		
		// Filtering the data	
		if(isset($data->query)) {
			$query = $data->query;
			
			// 2 types of query, one with fields and one without
			if(isset($data->fields)) {
				$fields = Zend_Json::decode($data->fields);
				foreach($fields as $field) {
					$select->orWhere("UPPER($field) LIKE CONCAT(UPPER('$query'),'%')");
				}
			} else {
				$select->where("UPPER(lastname)  LIKE  CONCAT(UPPER('$query'),'%')")
						->orWhere("UPPER(firstname)  LIKE  CONCAT(UPPER('$query'),'%')")
						->orWhere("id LIKE '$query%'");
			}
		}
		firelog($select->__toString());

		// Building json rows array
		$rows = array();		
		foreach($select->query()->fetchAll() AS $user) { 					
				$row = array();
				$row['firstname'] 	= $user['firstname'];
				$row['lastname'] 	= $user['lastname'];
				$row['user_id'] 	= $user['id'];
				$rows[]				= $row;
		}
		
		// getting the count
		$total = $select->reset('limitcount')
						->reset('order')
						->reset('columns')
						->columns(array(
                                 	'COUNT'=> 'COUNT(*)'
                 		))
						->query()->fetch();
				
		$result = array(
			"totalCount" => $total['COUNT'],
			"users" => $rows
		);
	
		// returning the resulting array
		return $result;
	} 

     /**
     * Method to export a Repository to Excel
     * 
     * @return string
     */	
	 function exportToExcel($params) {
		return array('success' => 'true','url'=>"toExcel.php?repo_id=$params->repo_id&is_archive=$params->is_archive");	
	 }
 
}
?>