<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<?php
	include_once "bootstrap.php";

	/** PHPExcel */
	require_once 'PHPExcel/Classes/PHPExcel.php';
	
	/** PHPExcel_IOFactory */
	require_once 'PHPExcel/Classes/PHPExcel/IOFactory.php';

	// getting user
	$user_session = new Zend_Session_Namespace('Default');
	$user = $user_session->user;
	
	// Create new PHPExcel object
	$objPHPExcel = new PHPExcel();

	// Set properties
	$objPHPExcel->getProperties()->setCreator($user->getFullName())
						 ->setLastModifiedBy($user->getFullName())
						 ->setTitle("Repository Excel Document")
						 ->setSubject("Repository Excel Document");


	// Add some data
	$objPHPExcel->setActiveSheetIndex(0)
		->setCellValue('A1', 'Add Date')
		->setCellValue('B1', 'Task')
		->setCellValue('C1', 'Priority')
		->setCellValue('D1', 'Prime')
		->setCellValue('E1', 'Forum')
		->setCellValue('F1', 'Due Date')
		->setCellValue('G1', 'Completed')
		->setCellValue('H1', 'Completed Date')
		->setCellValue('I1', 'Notes')
		->setCellValue('J1', 'ID')
		;

	// getting connection to database
	$db = Zend_Registry::get('dbAdapter');
	$select = $db->select()->from('tasks',array(
                'TASK_ID'=> 'ID',
                'REPO_ID',
                'TITLE',
                'FORUM',
                'PRIME',
                'NOTES',
                'DATE_DUE' => new Zend_Db_Expr("date_format(DATE_DUE,'%Y-%m-%d %H:%i:%s')"),
                'DATE_CREATED' => new Zend_Db_Expr("date_format(DATE_CREATED,'%Y-%m-%d %H:%i:%s')"),
                'USER_ID_CREATED',
                'DATE_UPDATED' => new Zend_Db_Expr("date_format(DATE_UPDATED,'%Y-%m-%d %H:%i:%s')"),
                'USER_ID_UPDATED',
                'DATE_ADDED' => new Zend_Db_Expr("date_format(DATE_ADDED,'%Y-%m-%d %H:%i:%s')"),
                'DATE_COMPLETED' => new Zend_Db_Expr("date_format(DATE_COMPLETED,'%Y-%m-%d %H:%i:%s')"),
                'USER_ID_COMPLETED',
                'IS_COMPLETED',
                'PRIORITY'
                ))
        ->where('REPO_ID = ' . $_REQUEST['repo_id'])
        ->where('IS_ARCHIVE = ' . ($_REQUEST['is_archive']?1:0));


	$tasks = $select->query()->fetchAll();						

	$cur_row=2;	
	foreach($tasks AS $task) {
		$objPHPExcel->setActiveSheetIndex(0)
			->setCellValue('A'.$cur_row, $task['DATE_ADDED'])
			->setCellValue('B'.$cur_row, $task['TITLE'])
			->setCellValue('C'.$cur_row, $task['PRIORITY'])
			->setCellValue('D'.$cur_row, $task['PRIME'])
			->setCellValue('E'.$cur_row, $task['FORUM'])
			->setCellValue('F'.$cur_row, $task['DATE_DUE'])
			->setCellValue('G'.$cur_row, (bool)$task['IS_COMPLETED'])
			->setCellValue('H'.$cur_row, $task['DATE_COMPLETED'])
			->setCellValue('I'.$cur_row, $task['NOTES'])
			->setCellValue('J'.$cur_row, $task['TASK_ID'])
			;
		$cur_row++;

	}
	// formatting
	$objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('B1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('C1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('E1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('H1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('F1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('G1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('H1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('I1')->getFont()->setBold(true);
	$objPHPExcel->getActiveSheet()->getStyle('J1')->getFont()->setBold(true);

	// Set active sheet index to the first sheet, so Excel opens this as the first sheet
	$objPHPExcel->setActiveSheetIndex(0);

	// Redirect output to a client's web browser (Excel5)
	header('Content-Type: application/vnd.ms-excel');
	header('Content-Disposition: attachment;filename='.
			'"TaskManager-Repository_'.$_REQUEST['repo_id'].($_REQUEST['is_archive']?'_Archive':'') .'.xls"');
	header('Cache-Control: max-age=0');
	
	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
	$objWriter->save('php://output'); 
	exit;