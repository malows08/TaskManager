<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */

 	include_once "bootstrap.php";

        
	// Clear Auth Instance
	Zend_Auth::getInstance()->clearIdentity();

	// destroy the current session
	Zend_Session::destroy();

	// forward to login page
	header('Location: login.php');

?>