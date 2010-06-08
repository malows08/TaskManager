<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php


//	LOGGING FUNCTIONS
//----------------------------------------------------

/**
 * Function to implement FirePHP logging using easy to remember functioin firelog
 * 
 * @return null
 */	
function firelog($str, $priority=Zend_Log::INFO)
{
	$logger = Zend_Registry::get('logger');
	$response = Zend_Registry::get('response');
	$channel = Zend_Registry::get('channel');
	
	// Start output buffering
	ob_start();
	
	// Now you can make calls to the logger
	
	$output = (is_string($str)?utf8_encode($str):$str);
	$logger->log($output,$priority);
	
	// Flush log data to browser
	$channel->flush();
	$response->sendHeaders();
}

/**
 * Function to implement FirePHP logging using easy to remember functioin fb
 * 
 * @return null
 */	
function fb($message, $label=null)
{
    if ($label!=null) {
        $message = array($label,$message);
    }
	
	$logger = Zend_Registry::get('logger');
	$response = Zend_Registry::get('response');
	$channel = Zend_Registry::get('channel');
	
	// Start output buffering
	ob_start();
	
	// Now you can make calls to the logger
	
	$logger->debug($message);
	
	// Flush log data to browser
	$channel->flush();
	$response->sendHeaders();
}

/**
 * Function to use print_t (can use var_dump)
 * 
 * @return null
 */	
function pre_print_r($arr) {
	echo '<pre>';
	print_r($arr);
	echo '</pre>';
}

//	HELPER FUNCTIONS
//-------------------------------------------
function curPageName() {
	return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);
}
function curPageURL() {
	$pageURL = 'http';
	if (isset($_SERVER["HTTPS"]) &&  $_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
		$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
		$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	} else {
		$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}

function to_boolean($value) {
	if(is_string($value) and $value=='false') 	$value = false;
	if(is_string($value) and $value=='true') 	$value = true;
	
	return (boolean)$value;
}
function booleanToString($bool) {
	if($bool) return 'true';
	return 'false';
}


/**
 * Function extract browser information
 * 
 * http://us3.php.net/manual/en/function.get-browser.php#89387
 *
 * @return array, boolean
 */	
function _exp($a = ''){if (empty($a)) return array();return explode(' ', $a);}
function _browser($params = array())
{
	$defaults = array(
		"browser"	=> false,
		"version"	=> false,
		"name"		=> false,
		"ua"		=> $_SERVER['HTTP_USER_AGENT']
	);
	$config = (object)array_merge($defaults,$params);
	
    $browser_list = 'msie firefox konqueror safari netscape navigator opera mosaic lynx amaya omniweb chrome avant camino flock seamonkey aol mozilla gecko';
    $user_browser = strtolower($config->ua);
    $this_version = $this_browser = '';
   
    $browser_limit = strlen($user_browser);
    foreach (_exp($browser_list) as $row)
    {
        $row = ($config->browser !== false) ? $config->browser : $row;
        $n = stristr($user_browser, $row);
        if (!$n || !empty($this_browser)) continue;
       
        $this_browser = $row;
        $j = strpos($user_browser, $row) + strlen($row) + 1;
        for (; $j <= $browser_limit; $j++)
        {
            $s = trim(substr($user_browser, $j, 1));
            $this_version .= $s;
           
            if ($s === '') break;
        }
    }
   
    if ($config->browser !== false)
    {
        $ret = false;
        if (strtolower($config->browser) == $this_browser)
        {
            $ret = true;
           
            if ($config->version !== false && !empty($this_version))
            {
                $a_sign = explode(' ', $config->version);
                if (version_compare($this_version, $a_sign[1], $a_sign[0]) === false)
                {
                    $ret = false;
                }
            }
        }
       
        return $ret;
    }
   
    //
    $this_platform = '';
    if (strpos($user_browser, 'linux'))
    {
        $this_platform = 'linux';
    }
    elseif (strpos($user_browser, 'macintosh') || strpos($user_browser, 'mac platform x'))
    {
        $this_platform = 'mac';
    }
    else if (strpos($user_browser, 'windows') || strpos($user_browser, 'win32'))
    {
        $this_platform = 'windows';
    }
   
    if ($config->name !== false)
    {
        return $this_browser . ' ' . $this_version;
    }
   
    return array(
        "browser"      => $this_browser,
        "version"      => $this_version,
        "platform"     => $this_platform,
        "useragent"    => $user_browser
    );
}

/**
*
*  PHP validate email
*  http://www.webtoolkit.info/
*
**/
 
function isValidEmail($email){
	return eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email);
}


/**
*
*  PHP character encoding  UTF-8 encoded, to ISO-8859-1.
*  http://www.php.net/manual/en/function.utf8-decode.php#85034
*
**/
function charset_decode_utf_8 ($string) { 
      /* Only do the slow convert if there are 8-bit characters */ 
    /* avoid using 0xA0 (\240) in ereg ranges. RH73 does not like that */ 
    if (! ereg("[\200-\237]", $string) and ! ereg("[\241-\377]", $string)) 
        return $string; 

    // decode three byte unicode characters 
    $string = preg_replace("/([\340-\357])([\200-\277])([\200-\277])/e",        
    "'&#'.((ord('\\1')-224)*4096 + (ord('\\2')-128)*64 + (ord('\\3')-128)).';'",    
    $string); 

    // decode two byte unicode characters 
    $string = preg_replace("/([\300-\337])([\200-\277])/e", 
    "'&#'.((ord('\\1')-192)*64+(ord('\\2')-128)).';'", 
    $string); 

    return $string; 
} 