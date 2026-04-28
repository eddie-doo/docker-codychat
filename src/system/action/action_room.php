<?php
require(__DIR__ . '/../config_session.php');

function leaveRoom(){
	global $mysqli, $data;
	$mysqli->query("UPDATE boom_users SET user_roomid = '0', user_move = '" . time() . "' WHERE user_id = '{$data['user_id']}'");
	redisUpdateUser($data['user_id']);
	return boomCode(1);
}
function joinRoom(){
	global $mysqli, $data;
	$target = escape($_POST['room'], true);
	$page = escape($_POST['cp']);
	if(myRoom($target)){
		return;
	}
	$room = myRoomDetails($target);
	if(empty($room)){
		return boomError('error');
	}
	if($room['room_blocked'] > time()){
		return boomError('room_block');
	}
	if(mustVerify()){
		return boomError('room_block');
	}
	$data['user_role'] = $room['room_ranking'];
	if(boomAllow($room['access'])){
		$mysqli->query("UPDATE boom_users SET user_roomid = '$target', user_move = '" . time() . "', last_action = '" . time() . "', user_role = '{$room['room_ranking']}', room_mute = '{$room['room_muted']}' WHERE user_id = '{$data['user_id']}'");
		$mysqli->query("UPDATE boom_rooms SET room_action = '" . time() . "' WHERE room_id = '$target'");
		joinRoomMessage($target);
		redisUpdateUser($data['user_id']);
		redisUpdateRoom($target);
		if(insideChat($page)){
			return boomCode(10, array('data'=> createRoomData($room)));
		}
		else {
			return boomCode(10);
		}
	}
	else {
		return boomError('access_requirement');
	}
}
function joinRoomPassword(){
	global $mysqli, $data;
	$pass = escape($_POST['pass']);
	$target = escape($_POST['room'], true);
	$page = escape($_POST['cp']);
	if(myRoom($target)){
		return boomCode(0);
	}
	$room = myRoomDetails($target);
	if(empty($room)){
		return boomError('error');
	}
	if($room['room_blocked'] > time()){
		return boomError('room_block');
	}
	if(mustVerify()){
		return boomError('room_block');
	}
	$data['user_role'] = $room['room_ranking'];
	if(boomAllow($room['access'])){
		if($pass == $room['password'] || canRoomPassword()){
			$mysqli->query("UPDATE boom_users SET user_roomid = '$target',  user_move = '" . time() . "', last_action = '" . time() . "', user_role = '{$room['room_ranking']}', room_mute = '{$room['room_muted']}' WHERE user_id = '{$data['user_id']}'");
			$mysqli->query("UPDATE boom_rooms SET room_action = '" . time() . "' WHERE room_id = '$target'");
			joinRoomMessage($target);
			redisUpdateUser($data['user_id']);
			redisUpdateRoom($target);
			if(insideChat($page)){
				return boomCode(10, array('data'=> createRoomData($room)));
			}
			else {
				return boomCode(10);
			}
		}
		else {
			return boomError('wrong_pass', array('code'=> 5));
		}
	}
	else {
		return boomError('access_requirement');
	}
}
function editRoomStaff(){
	global $mysqli, $data;
	
	if(!canEditRoom()){
		return boomCode(0);
	}
	
	$target = escape($_POST['target'], true);
	$rank = escape($_POST['room_staff_rank'], true);
	$user = userRoomDetails($target);
	
	if(!validRoomRank($rank)){
		return boomCode(0);
	}
	if(empty($target)){
		return boomError('no_user');
	}
	if(!canRoomAction($user, 6)){
		return boomError('cannot_user');
	}
	if($rank > 0){
		if(checkMod($user['user_id'])){
			$mysqli->query("INSERT INTO boom_room_staff ( room_id, room_staff, room_rank) VALUES ('{$data['user_roomid']}', '{$user['user_id']}', '$rank')");
		}
		else {
			$mysqli->query("UPDATE boom_room_staff SET room_rank = '$rank' WHERE room_id = '{$data['user_roomid']}' AND room_staff = '{$user['user_id']}'");
		}
		$mysqli->query("DELETE FROM boom_room_action WHERE action_user = '{$user['user_id']}' AND action_room = '{$data['user_roomid']}'");
		$mysqli->query("UPDATE boom_users SET user_role = '$rank', room_mute = '0' WHERE user_id = '{$user['user_id']}' AND user_roomid = '{$data['user_roomid']}'");
	}
	else {
		$mysqli->query("DELETE FROM boom_room_staff WHERE room_staff = '{$user['user_id']}' AND room_id = '{$data['user_roomid']}'");
		$mysqli->query("UPDATE boom_users SET user_role = 0 WHERE user_id = '{$user['user_id']}' AND user_roomid = '{$data['user_roomid']}'");
	}
	redisUpdateUser($data['user_id']);
	boomConsole('change_room_rank', array('target'=> $user['user_id'], 'rank'=>$rank));
	return boomSuccess('action_complete');
}
function saveRoom(){
	global $mysqli, $data;
	if(!canEditRoom()){
		return boomError('error');
	}
	$player_check = 0;
	$name = escape($_POST['set_room_name']);
	$description = escape($_POST['set_room_description']);
	$password = escape($_POST['set_room_password']);
	$access = escape($_POST["set_room_access"], true);
	if(isset($_POST['set_room_player'])){
		$player = escape($_POST['set_room_player'], true);
		$player_check = 1;
	}
	if(!validRoomDesc($description)){
		return boomError('error');
	}
	if(!validRoomPass($password)){
		return boomError('error');
	}
	if(!validRoomAccess($access)){
		return boomError('error');
	}
	if(!validRoomName($name)){
		return boomError('room_name');
	}
	if($data['user_roomid'] == 1){
		$password = '';
	}
	$room = roomDetails($data['user_roomid']);
	if(roomExist($name, $data['user_roomid'])){
		return boomError('room_exist');
	}
	if($player_check == 1){
		if($player != 0){
			if($player != $room['room_player_id']){
				$check_player = $mysqli->query("SELECT * FROM boom_radio_stream WHERE id = '$player'");
				if($check_player->num_rows > 0){
					$setplay = $check_player->fetch_assoc();
					$player_id = $setplay['id'];
				}
				else {
					$player_id = $room['room_player_id'];
				}
			}
			else {
				$player_id = $room['room_player_id'];
			}
		}
		else {
			$player_id = 0;
		}
	}
	else {
		$player_id = 0;
	}
	$mysqli->query("UPDATE boom_rooms SET room_name = '$name', access = '$access', description = '$description', password = '$password', room_player_id = '$player_id' WHERE room_id = '{$data['user_roomid']}'");
	redisUpdateRoom($data['user_roomid']);
	return boomSuccess('saved');
}
function createRoom(){
	global $mysqli, $data, $setting;
	$set_pass = escape($_POST["set_pass"]);
	$set_access = escape($_POST["set_type"], true);
	$set_name = escape($_POST['set_name']);
	$set_description = escape($_POST['set_description']);
	$page = escape($_POST['cp']);
	if(!canRoom()){
		return boomCode(0);
	}
	$room_system = 0;
	if(boomAllow(100)){
		$room_system = 1;
	}
	if(!boomAllow($set_access)){
		return boomError('error');
	}
	if(!validRoomAccess($set_access)){
		return boomError('error');
	}
	if(!validRoomDesc($set_description)){
		return boomError('error');
	}
	if(!validRoomPass($set_pass)){
		return boomError('error');
	}
	if(!validRoomName($set_name)){
		return boomError('room_name');
	}
	$max_room = $mysqli->query("SELECT room_id FROM boom_rooms WHERE room_creator = '{$data['user_id']}'");
	if($max_room->num_rows >= $setting['max_room'] && !isStaff($data)){
		return boomError('max_room');
	}
	$check_duplicate = $mysqli->query("SELECT room_name FROM boom_rooms WHERE room_name = '$set_name'");
	if($check_duplicate->num_rows > 0){
		return boomError('room_exist');
	}
	$mysqli->query("INSERT INTO boom_rooms (room_name, access, description, password, room_system, room_creator, room_action) VALUES ('$set_name', '$set_access', '$set_description', '$set_pass', '$room_system', '{$data['user_id']}', '" . time() . "')");
	$last_id = $mysqli->insert_id;
	$mysqli->query("DELETE FROM boom_room_staff WHERE room_id = '$last_id'");
	if(!boomAllow(90) && autoRoomStaff()){
		$mysqli->query("UPDATE boom_users SET user_roomid = '$last_id', last_action = '" . time() . "', user_role = '6' WHERE user_id = '{$data['user_id']}'");
		$mysqli->query("INSERT INTO boom_room_staff ( room_id, room_staff, room_rank) VAlUES ('$last_id', '{$data['user_id']}', '6')");
	}
	else {
		$mysqli->query("UPDATE boom_users SET user_roomid = '$last_id', last_action = '" . time() . "' WHERE user_id = '{$data['user_id']}'");
	}
	$groom = roomDetails($last_id);
	boomConsole('create_room', array('room'=>$groom['room_id']));
	redisUpdateUser($data['user_id']);
		if(insideChat($page)){
			return boomCode(7, array('data'=> createRoomData($groom)));
		}
		else {
			return boomCode(7);
		}
}

// end of functions

if(isset($_POST['join_room'], $_POST['room'])){
	echo joinRoom();
}
if(isset($_POST['join_room_pass'], $_POST['room'], $_POST['pass'])){
	echo joinRoomPassword();
}
if(isset($_POST['leave_room'])){
	echo leaveRoom();
	die();
}
if(isset($_POST['target'], $_POST['room_staff_rank'])){
	echo editRoomStaff();
	die();
}
if(isset($_POST['set_name'], $_POST['set_pass'], $_POST['set_type'], $_POST['set_description'])){
	echo createRoom();	
	die();
}
if(isset($_POST['set_room_name'], $_POST['set_room_description'], $_POST['set_room_password'], $_POST['set_room_access'], $_POST['save_room'])){
	echo saveRoom();
	die();
}
die();
?>