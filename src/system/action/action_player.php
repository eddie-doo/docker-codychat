<?php
require(__DIR__ . '/../config_session.php');

function deletePlayer(){
	global $mysqli, $setting;
	$id = escape($_POST['delete_player'], true);
	if(!canManagePlayer()){
		return boomError('error');
	}
	$mysqli->query("UPDATE boom_rooms SET room_player_id = 0 WHERE room_player_id = '$id'");
	$mysqli->query("DELETE FROM boom_radio_stream WHERE id = '$id'");
	if($id == $setting['player_id']){
		$mysqli->query("UPDATE boom_setting SET player_id = 0 WHERE id = 1");
		boomSaveSettings();
		redisUpdatePlayer($id);
		return boomCode(2);
	}
	else {
		return boomCode(1);
	}
}
function staffAddPlayer(){
	global $mysqli, $data;
	
	$stream_url = escape($_POST['stream_url']);
	$stream_alias = escape($_POST['stream_alias']);
	
	if(!canManagePlayer()){
		return boomError('error');
	}
	if($stream_url != '' && $stream_alias != ''){
		$count_player = $mysqli->query("SELECT id FROM boom_radio_stream WHERE id > 0");
		$playcount = $count_player->num_rows;
		$mysqli->query("INSERT INTO boom_radio_stream (stream_url, stream_alias) VALUE ('$stream_url', '$stream_alias')");
		if($playcount < 1){
			$last_id = $mysqli->insert_id;
			$mysqli->query("UPDATE boom_setting SET player_id = '$last_id' WHERE id = 1");
			boomSaveSettings();
		}
		return boomCode(1);
	}
	else {
		return boomError('empty_field');
	}	
}
function staffEditStream(){
	global $mysqli, $data;
	
	$id = escape($_POST['player_id']);
	$alias = escape($_POST['new_stream_alias']);
	$url = escape($_POST['new_stream_url']);
	
	if(!canManagePlayer()){
		return boomError('error');
	}
	if(!empty($alias) && !empty($url)){
		$mysqli->query("UPDATE boom_radio_stream SET stream_url = '$url', stream_alias = '$alias' WHERE id = '$id'");
		redisUpdatePlayer($id);
		return boomSuccess('saved');
	}
	else {
		return boomError('error');
	}
}

// end of functions

if(isset($_POST['delete_player'])){
	echo deletePlayer();
	die();
}
if(isset($_POST['stream_url'], $_POST['stream_alias'])){
	echo staffAddPlayer();
	die();
}
if(isset($_POST['new_stream_url'], $_POST['new_stream_alias'], $_POST['player_id'])){
	echo staffEditStream();
	die();
}
die();
?>