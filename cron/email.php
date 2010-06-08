<?php
	$from_cli = false;
	$enable_send = (isset($_GET['send'])?$_GET['send']:false);

	echo date('l jS \of F Y h:i:s A'). "\n";	

	// Setting Paths and Loading Zend when called from CLI
	if(!defined('APPLICATION_PATH')) {

		$from_cli = true;
		$enable_send = true;
		
		// Setup Environment variables
//		putenv("ORACLE_HOME=/apps/oracle/instantclient_10_2");
		putenv("TNS_ADMIN=/apps/oracle/instantclient_10_2");
//		putenv("LD_LIBRARY_PATH=/apps/oracle/instantclient_10_2");
//		putenv("ORACLE_SID=DVCCRDB");


/*		echo getenv('ORACLE_SID') . "\n";	//		DVCCRDB 
		echo getenv('ORACLE_HOME'). "\n";	// 		/apps/oracle/instantclient_10_2 
		echo getenv('LD_LIBRARY_PATH'). "\n";	// 	/apps/oracle/instantclient_10_2
		echo getenv('TNS_ADMIN'). "\n";*/

		define('APPLICATION_PATH', dirname(__FILE__) . '/../..');
		define('APPLICATION_ENVIRONMENT', 'development');

		set_include_path(APPLICATION_PATH . '/include/php_libraries/library_z1.8' 
				. PATH_SEPARATOR . get_include_path()
			);

		// 1.8 - loading classes
		require_once 'Zend/Loader/Autoloader.php';
		$loader = Zend_Loader_Autoloader::getInstance();
		$loader->registerNamespace('My_');
		require_once "functions.php";
	
		// SAVING TO REGISTRY - global variables
		//------------------------------------------------
		$registry = Zend_Registry::getInstance();
		
		// CONFIGURATION FILE
		//----------------------------------------------
		$configuration = new Zend_Config_Ini(APPLICATION_PATH . '/include/config/app.ini', APPLICATION_ENVIRONMENT);
		$registry->configuration = $configuration;
		
			
		// DATABASE CONFIGURATION
		//-------------------------------------------
		$dbAdapter = Zend_Db::factory($configuration->database);
		Zend_Db_Table_Abstract::setDefaultAdapter($dbAdapter);
		$registry->dbAdapter = $dbAdapter;
		
	}



	// getting connection to database
	$db = Zend_Registry::get('dbAdapter');
	
	
	
	// Loop Through Each User registered to at least one Repo
	$select = $db->select()->from('V_TASKMANAGER_PRIVILEGES',array(
								'NIPNUM',
								'LASTNAME',
								'FIRSTNAME',
								'FULLNAME',
								'EMAIL',
								'SEND_ALERT'
								),'PHP')
					->group(array(
								'NIPNUM',
								'LASTNAME',
								'FIRSTNAME',
								'FULLNAME',
								'EMAIL',
								'SEND_ALERT'
								))
					->order(array('LASTNAME'));

					
	$invalid_email_users = array();
	foreach($select->query()->fetchAll() as $user) {
	
		// validate email
		if(isValidEmail($user['EMAIL'])) {
		
		
			// create the message body by going through each repository that the user has signed up for
			$message = "<br>Hello " . $user['FIRSTNAME'] 
									. ",<br>The <a href='http://ccsmetrics.int.bell.ca/TaskManager/'>TaskManager</a>"
									. " tool has the following alerts for you:<br><br>";
			$message .= "<table border='1' cellpadding='5' cellspacing='0'>
							<thead>
								<tr>
									<th>Repository</th>
									<th>Privilege</th>
									<th>Newly Open</th>
									<th>Recently Closed</th>
									<th>Total Open</th>
									<th>Total Closed</th>
									<th>Total Inbox</th>
									<th>Total Archive</th>
								</tr>
							</thead>
							<tbody>
						";
			
			
			$select_repos = $db->select()->from('V_TASKMANAGER_PRIVILEGES',array(
									'REPO_ID',
									'REPO_NAME',
									'REPO_DESCRIPTION',
									'PRIVILEGE',
									'LASTNAME',
									'FIRSTNAME',
									'FULLNAME',
									'NIPNUM',
									'TOTAL_INBOX',
									'TOTAL_INBOX_OPEN',
									'TOTAL_INBOX_COMPLETED',
									'TOTAL_ARCHIVE',
									'TOTAL_NEW_TASKS',
									'TOTAL_NEW_CLOSE'
									),'PHP')
								->where('NIPNUM = ' . $user['NIPNUM'])
								->order(array('TOTAL_NEW_TASKS DESC','PRIVILEGE','REPO_NAME'));
			
			$send_alert = false;					
			foreach($select_repos->query()->fetchAll() as $repo){
				if($repo['TOTAL_NEW_TASKS'] + $repo['TOTAL_NEW_CLOSE'] > 0)	$send_alert=true;
				$message .= "		<tr>
										<td>".$repo['REPO_NAME']."</td>
										<td>".$repo['PRIVILEGE']."</td>
										<td align='center' style='color:blue;font-weight:bold'>".$repo['TOTAL_NEW_TASKS']."</td>
										<td align='center' style='color:green;font-weight:bold'>".$repo['TOTAL_NEW_CLOSE']."</td>
										<td align='center' style='color:red'>".$repo['TOTAL_INBOX_OPEN']."</td>
										<td align='center' style='color:green'>".$repo['TOTAL_INBOX_COMPLETED']."</td>
										<td align='center'>".$repo['TOTAL_INBOX']."</td>
										<td align='center' style='color:grey'>".$repo['TOTAL_ARCHIVE']."</td>
									</tr>
							";	
			}
			$message .= "	</tbody>
						</table>";
						
			$message .= "<br>Regards,<br><a href='mailto:ccs.metrics@bell.ca'>CCS Metrics</a><br>";
			
			
			// CHECK IF NEWLY OPENED THEN SEND
			if($send_alert) {
				$send_mail = $user['SEND_ALERT'] && $enable_send;
				$success_string = (sendEmail($user['EMAIL'],$message,$send_mail)?'SENT':'NOT SENT');
				echo date('l jS \of F Y h:i:s A') . " - ".$success_string." - Email sent to: " . $user['EMAIL'] . "\n";
				if(!$from_cli) echo $message . '<hr>';

			}
			
		
		// add invalid emails to tracking array	
		} else {
			$invalid_email_users[] = $user;
		}
	}

	// sending invalid emails
	if(sizeof($invalid_email_users)) {
		$message = 'The following users do not have a valid email: <br><br>';
		foreach($invalid_email_users as $user) $message .= implode(' / ',$user) . '<br>';
		sendEmail('daniel.dallala@bell.ca',$message,$enable_send);
		if(!$from_cli) echo $message . '<hr>';
	}

/**
*
*  PHP send email
*
**/
// function to send emails from TaskManager	
function sendEmail($to,$message,$send=true) {

	if(!$send) return false;
	
	
	$mail = new Zend_Mail();
	$mail->setBodyHtml($message)
			->setFrom('ccs.metrics@bell.ca','TaskManager Reminder')
			->addTo($to)
			->setSubject('TaskManager Reminders for');
	
	$mail->send();
	return true;
}

?>