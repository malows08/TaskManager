<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */

	// ERROR DISPLAY
	//---------------------------------
	error_reporting(E_ALL|E_STRICT);
	ini_set('display_errors', true);

	// DEFINING GLOBAL PATHS
	//--------------------------------------
	defined('APPLICATION_PATH')
		or define('APPLICATION_PATH', dirname(__FILE__));
	
	defined('APPLICATION_ENVIRONMENT')
		or define('APPLICATION_ENVIRONMENT', 'development');
		
//###################################################################################	
//	1
//###################################################################################

	set_include_path(APPLICATION_PATH . '/libs/php'
		. PATH_SEPARATOR . get_include_path()
	);	

	// ZEND LIBRARY
	//---------------------------------------

	// 1.8 - loading classes
	require_once 'Zend/Loader/Autoloader.php';
	$loader = Zend_Loader_Autoloader::getInstance();
	$loader->registerNamespace('My_');

	// SAVING TO REGISTRY - global variables
	//------------------------------------------------
	$registry = Zend_Registry::getInstance();
	

//###################################################################################	
//	2
//###################################################################################	
	// CONFIGURATION FILE
	//----------------------------------------------
	$configuration = new Zend_Config_Ini(APPLICATION_PATH . '/configs/app.ini', APPLICATION_ENVIRONMENT);
	$registry->configuration = $configuration;
	
		
	// DATABASE CONFIGURATION
	//-------------------------------------------
	$dbAdapter = Zend_Db::factory($configuration->database);
	Zend_Db_Table_Abstract::setDefaultAdapter($dbAdapter);
	$registry->dbAdapter = $dbAdapter;

	// LOG
	//-----------------------------------------
	$writer = new Zend_Log_Writer_Firebug();
	$logger = new Zend_Log($writer);
	$request = new Zend_Controller_Request_Http();
	$response = new Zend_Controller_Response_Http();
	$channel = Zend_Wildfire_Channel_HttpHeaders::getInstance();
	$channel->setRequest($request);
	$channel->setResponse($response);
	
	$registry->writer = $writer;
	$registry->logger = $logger;
	$registry->request = $request;
	$registry->response = $response;
	$registry->channel = $channel;
	
	
//###################################################################################	
//	3
//###################################################################################
        $self = explode('/',$_SERVER['PHP_SELF']);
        $current_page = basename($_SERVER['SCRIPT_NAME']);
        
        defined('ROOT_URL')
            or define('ROOT_URL', 'http://'.$_SERVER['HTTP_HOST'] . "/" . $self[1]);

	//	HELPER CLASSES
	//--------------------------------------------
	require_once "path_definitions.php";
	require_once "ExtJs.php";
	require_once "functions.php";
	

//###################################################################################	
//	4
//###################################################################################	
	// SESSION MANAGEMENT
	//--------------------------------------

	//start your session!
	Zend_Session::start(); // Zend_Session::destroy()
	$user_session = new Zend_Session_Namespace('Default');

	$auth = Zend_Auth::getInstance();
	$session_need_to_relogin = !$auth->hasIdentity();

        // check if need to login
	if($session_need_to_relogin && $current_page != 'login.php' && $current_page != 'login_action.php') {
            $next_url = '?next_url=' . urlencode($_SERVER['REQUEST_URI']);
            header("Location: ".ROOT_URL."/login.php" . $next_url);
        }
	//$user_session->user = new My_User($user_id);
	
	
	// saving data to registry
	$registry->auth = $auth;
	$registry->session = $user_session;
	$registry->user = $user_session->user;
	
	unset($configuration, $dbAdapter, $registry, $user_session, $stage, $auth, $writer, $logger, $request, $response, $channel);
	

?>