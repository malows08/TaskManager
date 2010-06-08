<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php
include_once "bootstrap.php";

try {

    // Processing Form Submit
    if($_POST['user_id'] != '' && $_POST['password'] != '') {

        $db = Zend_Registry::get('dbAdapter');

        // Authentication service
        $authAdapter = new Zend_Auth_Adapter_DbTable($db, /*'dbname.'*/ 'users', 'id', 'password');
        $authAdapter->setIdentity(trim($_POST['user_id']))
                ->setCredential($_POST['password']);

        $auth = Zend_Auth::getInstance();
        $result = $auth->authenticate($authAdapter);

        switch ($result->getCode()) {

            case Zend_Auth_Result::FAILURE_IDENTITY_NOT_FOUND:
            /** do stuff for nonexistent identity **/
                $return = array('success'=>false,'error_msg'=>'Nonexistent Identity: ' . $_POST['user_id']);
                break;

            case Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID:
            /** do stuff for invalid credential **/
                $return = array('success'=>false,'error_msg'=>'Invalid password: ' . $_POST['password']);
                break;

            case Zend_Auth_Result::SUCCESS:
            /** do stuff for successful authentication **/
                $user_session = new Zend_Session_Namespace('Default');
                $user_session->numberOfPageRequests = 1; // first time
                $user_session->user = new My_User($auth->getIdentity());


                if(isset($_POST['next_url']) && $_POST['next_url'] != '') {
                    $return = array('success'=>true,'next_url'=>urldecode($_POST['next_url']));
                    header('Location: ' . urldecode($_POST['next_url']));
                } else {
                    $return = array('success'=>true,'next_url'=>'index.php');
                    header('Location: index.php');
                }
                break;

            default:
            /** do stuff for other failure **/
                $return = array('success'=>false,'error_msg'=>'Other Failure');
                break;
        }

    }
    else
        $return = array('success'=>false,'error_msg'=>'Missing Fields');

    // Encode it to return to the client:
    $json = Zend_Json::encode($return);
    echo $json;
}
catch(Exception $e) {
    firelog($e);
    $return = array('success'=>false,'error_msg'=>'Internal error');

    // Encode it to return to the client:
    $json = Zend_Json::encode($return);
    echo $json;
}


?>