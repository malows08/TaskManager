<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php

class My_User 
{
   	protected $_id;
	protected $_firstname;
	protected $_lastname;
	protected $_email;

		

    /**
     * Zend_Db_Adapter_Abstract object.
     *
     * @var Zend_Db_Adapter_Abstract
     */
    protected $_db;

	
	/**
	* Constructor
	*
	* Constructs the User Object to handle All USer related queries (Access Levels)
	* 
	* @param  name 
	* @return My_User Object
	*/		
	public function __construct($user_id)
	{
		$this->_setupDatabaseAdapter();
		$this->_loadUserInfo($user_id);
	}
	
    /**
     * Initialize database adapter.
     *
     * @return void
     */
    protected function _setupDatabaseAdapter()
    {
        if (! $this->_db) {
            $this->_db = Zend_Db_Table_Abstract::getDefaultAdapter();
            if (!$this->_db instanceof Zend_Db_Adapter_Abstract) {
                require_once 'Zend/Db/Table/Exception.php';
                throw new Zend_Db_Table_Exception('No adapter found for ' . get_class($this));
            }
        }
    }	
	
    /**
     * Gets the Zend_Db_Adapter_Abstract for this particular Zend_Db_Table object.
     *
     * @return Zend_Db_Adapter_Abstract
     */
    public function getAdapter()
    {
        return $this->_db;
    }	
	
    /**
     * Gets the default Zend_Db_Adapter_Abstract for all Zend_Db_Table objects.
     *
     * @return Zend_Db_Adapter_Abstract or null
     */
    public static function getDefaultAdapter()
    {
		return Zend_Db_Table_Abstract::getDefaultAdapter();
       // return self::$_defaultDb;
    }	
	
   /**
     * GET Functions
     * 
     * @return User property
     */	
	public function getUserID() 
	{
		return $this->_id;
	}
	public function getFirstName()
	{
		return $this->_firstname;
	}
	public function getLastName()
	{
		return $this->_lastname;
	}
	public function getFullName()
	{
		return $this->_firstname . ' ' . $this->_lastname;
	}

	public function getEmail() 
	{
		return $this->_email;
	}			


   /**
     * Loads User Info
     * 
     */		
	protected function _loadUserInfo($user_id)
	{
		$db = $this->getAdapter();
	
		// Select query to fecth User Information
		$select = $db->select()
					->from('users', array('id','email','lastname','firstname') /*, 'dbname' */)
					->where("id = $user_id");
					
		$stmt = $select->query();
		$result = $stmt->fetch();

       	$this->_id  		= $result['id'];
		$this->_lastname  	= $result['lastname'];
		$this->_firstname  	= $result['firstname'];
		$this->_email		= (isset($result['email'])?$result['email']:null);
		

	}
	
}