<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php

include_once "../bootstrap.php";

class SettingsAction {

     /**
     * Method to return the user settings
     * 
     * @return string
     */	
	 function get() {
		
	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;
		
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		
		$select = $db->select()->from('settings',array(
							'USER_ID',
							'SEND_ALERT'
							))
				->where('USER_ID=' . $user->getUserId());
		//firelog($select->__toString()); 

		// default settings
		$data = array(
			"receive_alerts"=>0
		);

		// overwriting default settings
		$settings = $select->query()->fetch();
		if($settings) {
			$data = array(
				"receive_alerts"=>$settings['SEND_ALERT']
			);
		}
		$data['email'] = $user->getEmail();

		// return
		$return = array(
			"success"	=> true,
			"data"		=> $data
		);
		
		return $return;
	 }

     /**
     * Method to save new settings
     * 
     * @return boolean
     */	
	 function save($values) {

	 	// getting user
	 	$user_session = new Zend_Session_Namespace('Default');
		$user = $user_session->user;
	 
		// getting connection to database
		$db = Zend_Registry::get('dbAdapter');
		
		// first delete user privilege
		$db->delete('tsettings',array(
			'USER_ID = ' . $user->getUserId()
		));
		// update statement
		$db->insert('settings', array(
                        'USER_ID'	=> $user->getUserId(),
                        'SEND_ALERT'	=> $values->receive_alerts
                ));
		
		return array('success' => 'true');	
		
	 }

}