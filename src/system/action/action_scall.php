<?php
require('../config_admin.php');

if(!boomAllow(100)){
	die();
}

function reloadCall(){
	return boomCode(1, array('data'=> listAdminCall()));
}
function reloadGroupCall(){
	return boomCode(1, array('data'=> listAdminGroupCall()));
}
function adminCancelCall(){
	global $mysqli, $setting, $data;
	$id = escape($_POST['admin_cancel'], true);
	$call = callDetails($id);
	if(empty($call)){
		return boomError('error');
	}
	endCall($call, 8);
	$call['call_status'] = 2;
	return boomSuccess('action_complete', array('data'=> boomTemplate('element/admin_call', $call)));
}

if(isset($_POST['admin_cancel'])){
	echo adminCancelCall();
	die();
}
if(isset($_POST['reload_call'])){
	echo reloadCall();
	die();
}
if(isset($_POST['reload_group_call'])){
	echo reloadGroupCall();
	die();
}
?>