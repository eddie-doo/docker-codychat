<?php
require('../config.php');

function sendAccountRecovery(){
	global $mysqli;
	$email = escape($_POST['remail']);
	if(!isEmail($email)){
		return boomError('invalid_email', array('code'=> 3));
	}
	$getuser = $mysqli->query("SELECT * FROM boom_users WHERE user_email = '$email' AND user_bot = 0 LIMIT 1");
	if($getuser->num_rows > 0){
		$user = $getuser->fetch_assoc();
		$rmail = sendRecovery($user);
		if($rmail == 1){
			return boomSuccess('recovery_sent');
		}
		else {
			return boomError('error');
		}
	}
	else {
		return boomError('no_user', array('code'=> 2));
	}
}
function accountRecovery(){
	global $mysqli, $setting;
	$pass = escape($_POST['rpass']);
	$repeat = escape($_POST['rrepeat']);
	$k = escape($_POST['rk']);
	$v = escape($_POST['rv']);
	$t = escape($_POST['rt']);
	
	if($pass == '' || $repeat == ''){
		return boomError('error');
	}
	if(!validRecovery($k, $t, $v)){
		return boomError('error');
	}
	if(!boomSame($pass, $repeat)){
		return boomError('not_match');
	}
	if(!validPassword($pass)){
		return boomError('invalid_pass');
	}
	$get_recovery = $mysqli->query("SELECT * FROM boom_temp WHERE temp_key = '$k'");
	if($get_recovery->num_rows < 1){
		return boomError('error');
	}
	$recovery = $get_recovery->fetch_assoc();
	if($recovery['temp_date'] != $t){
		return boomError('error');
	}
	if($recovery['temp_date'] < tempTimer()){
		return boomError('error');
	}
	$user = userDetails($recovery['temp_user']);
	if(empty($user)){
		return boomError('error');
	}
	$new_pass = encrypt($pass);
	$mysqli->query("UPDATE boom_users SET user_password = '$new_pass' WHERE user_id = '{$user['user_id']}'");
	$mysqli->query("DELETE FROM boom_temp WHERE temp_user = '{$user['user_id']}'");
	return boomCode(1);
}

if (isset($_POST["remail"])){
	echo sendAccountRecovery();
	die();
}
if (isset($_POST["rpass"], $_POST['rrepeat'], $_POST['rk'], $_POST['rv'], $_POST['rt'])){
	echo accountRecovery();
	die();
}
else {
	echo 99;
	die();
}
?>