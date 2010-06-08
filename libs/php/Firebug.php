<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php

Class Firebug {
	protected $_stage;
	
	/**
	* Constructor
	*
	* Constructs the FIrebug handler
	* 
	* @param  $version 
	*/		
	function __construct() {
		$registry = Zend_Registry::getInstance();
		
		$this->_stage = $registry->stage;
	}
	
	/**
	* include method, to output javscript include script for IE
	* 
	*/		
	public function includeIt($force = false) {

		echo "\n<!-- FIREBUG -->\n";
		$browser_info = _browser();
		if($browser_info['browser'] == 'msie'){
			if($this->_stage == 'live' || $force) {
				echo "<script>window.console = {debug: function(){}};</script>";
			} else {
				echo "<script type='text/javascript' src='http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js'></script>";
			}
		}
		echo "\n";
		
	}	
	
}