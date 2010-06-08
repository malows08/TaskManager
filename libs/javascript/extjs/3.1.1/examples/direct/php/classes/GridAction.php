<?php
class GridAction {
    function read($data){
		$rows  = array(
				array('name'=>'John','email'=>'Doe@js.com'),
				array('name'=>'Jane','email'=>'Doe@js.com')
			);
        return array(
			'totalCount' => count($rows),
			'rows' => $rows
		);
    }
	
	function update($data) {
		firelog($data);
	}
	
	function create($data) {
		firelog($data);
	}
}