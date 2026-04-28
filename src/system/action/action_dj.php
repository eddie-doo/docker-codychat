<?php
require(__DIR__ . '/../config_session.php');

function addUserDj(){
	global $mysqli, $setting, $data;
	$target = escape($_POST['add_dj']);
	$user = userNameDetails($target);
	if(empty($user)){
		return boomError('no_user');
	}
	if(userDj($user)){
		return boomError('already_action');
	}
	if(canEditUser($user, $setting['can_dj'], 1) || canManageDj() && mySelf($user['user_id'])){
		$mysqli->query("UPDATE boom_users SET user_dj = 1 WHERE user_id = '{$user['user_id']}'");
		$user['user_dj'] = 1;
		redisUpdateUser($user['user_id']);
		return boomSuccess('saved', array('data'=> boomTemplate('element/admin_dj', $user)));
	}
	else {
		return boomError('cannot_user');
	}
}
function removeUserDj(){
	global $mysqli, $setting, $data;
	$target = escape($_POST['remove_dj'], true);
	$user = userDetails($target);
	if(empty($user)){
		return boomError('error');
	}
	if(canEditUser($user, $setting['can_dj'], 1) || canManageDj() && mySelf($user['user_id'])){
		$mysqli->query("UPDATE boom_users SET user_dj = 0, user_onair = 0 WHERE user_id = '{$user['user_id']}'");
		redisUpdateUser($user['user_id']);
		return boomCode(1);
	}
	else {
		return boomError('cannot_user');
	}
}

function setUserOnAir(){
	global $mysqli, $setting, $data;
	$id = escape($_POST['admin_onair'], true);
	$user = userDetails($id);
	if(empty($user)){
		return boomError('error');
	}
	if(canManageDj() && canEditUser($user, $setting['can_dj']) && userDj($user)){
		if(isOnAir($user)){
			$mysqli->query("UPDATE boom_users SET user_onair = '0' WHERE user_id = '{$user['user_id']}'");
			redisUpdateUser($user['user_id']);
			return boomCode(2);
		}
		else {
			$mysqli->query("UPDATE boom_users SET user_onair = '1' WHERE user_id = '{$user['user_id']}'");
			redisUpdateUser($user['user_id']);
			return boomCode(1);
		}
	}
	else {
		return boomError('cannot_user');
	}
}
function setOnAir(){
	global $mysqli, $data;
	$onair = escape($_POST['user_onair'], true);
	if(!userDj($data)){
		return boomError('error');
	}
	$mysqli->query("UPDATE boom_users SET user_onair = '$onair' WHERE user_id = '{$data['user_id']}'");
	redisUpdateUser($data['user_id']);
	return boomCode(1);
}	

// end of functions

if(isset($_POST["admin_onair"])){
	echo setUserOnAir();
	die();
}
if(isset($_POST["user_onair"])){
	echo setOnAir();
	die();
}
if(isset($_POST["add_dj"])){
	echo addUserDj();
	die();
}
if(isset($_POST['remove_dj'])){
	echo removeUserDj();
	die();
}
die();
?>