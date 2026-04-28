<?php
require('../config_session.php');

function createHelp($i){
	return '
		<div class="info_container pad10">
			<div class="info_content">
				' . boomTemplate('help/' . $i) . '
			</div>
		</div>
	';
}

if(!isset($_POST['info'])){
	die();
}
$info = basename($_POST['info']);

if (!preg_match('/^[A-Za-z0-9_-]+$/', $info)) { 
	echo 'Help not found'; 
	die();
}
if(!is_file(BOOM_PATH . '/system/help/' . $info . '.php')){
	echo 'Help not found';
	die();
}
echo createHelp($info);
?>