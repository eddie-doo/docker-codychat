<?php
require('../config_session.php');
	
$target = escape($_POST['target'], true);

if(!canPrivate()){
	$cpriv = 0;
}

echo json_encode(getPrivateHistory($target), JSON_UNESCAPED_UNICODE);
?>