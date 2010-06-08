<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php

Class ExtJs {
	protected $_version;
	protected $_dir;
	protected $_base;
	protected $_all;
	protected $_css;
	protected $_locale_loc;
	
	/**
	* Constructor
	*
	* Constructs the ExtJs Object to handle ExtJs integration
	* 
	* @param  $version 
	*/		
	function __construct($version=null) {
		$registry = Zend_Registry::getInstance();
		
		// version
		if($version) 	$this->_version = $version;
		else 			$this->_version = $registry->extjs_cur;
		
		// file path setup
		$this->_dir		= $registry->javascript_dir . "/extjs/" . $this->_version;
		$this->_base	= $this->_dir . "/adapter/ext/ext-base.js";
		$this->_all		= $this->_dir . "/ext-all.js";
		$this->_css		= $this->_dir . "/resources/css/ext-all.css";
		$this->_locale_loc= $this->_dir . "/src/locale";
	}
	
	/**
	* include method, to output javscript include script
	* 
	*/		
	public function includeIt() {

		echo "\n<!-- Ext JS -->\n";
		echo '<link rel="stylesheet" type="text/css" href="'.$this->_css.'" />' . "\n";
		echo '<script type="text/javascript" src="'.$this->_base.'"></script>' . "\n";
		echo '<script type="text/javascript" src="'.$this->_all.'"></script>' . "\n\n";
		echo '<script type="text/javascript">' .
				'Ext.BLANK_IMAGE_URL = "'.$this->_dir.'/resources/images/default/s.gif";'.
				'Ext.CHART_URL = "'.$this->_dir.'/resources/charts.swf";'.
				'</script>' . "\n";
		
	}	

	/**
	* include method, to output javscript include script
	* 
	*/		
	public function includeLocale($lang) {
		echo "\n<!-- Ext JS locale -->\n";
		if($lang == 'fr') {
			echo '<script type="text/javascript" src="'.$this->_locale_loc .'/ext-lang-fr_CA.js"></script>' . "\n";
		} else {
			echo '<script type="text/javascript" src="'.$this->_locale_loc .'/ext-lang-en.js"></script>' . "\n";
		}
		
	}
	
	/**
	* method to get the ExtJs version
	* 
	*/		
	public function getVersion() {
		return $this->_version;
		
	}
	
}