<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php

$registry = Zend_Registry::getInstance();

/*--- main folders to include ---*/
$registry->INCLUDE_FOLDER = ROOT_URL."/include";


/* ===== JAVASCRIPT ==== 
-----------------------------------------------*/
$registry->javascript_dir = ROOT_URL . '/libs/javascript';