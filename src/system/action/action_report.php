<?php
require(__DIR__ . '/../config_session.php');
require(__DIR__ . '/gen.php');

function makeWallReport(){
	global $mysqli, $data;
	if(!canSendReport()){
		return boomError('report_limit');
	}
	$post = escape($_POST['report'], true);
	$reason = escape($_POST['reason'], true);
	if(!validReport($reason)){
		return boomError('error');
	}
	if(!canPostAction($post)){
		return boomError('error');
	}
	$check_report = $mysqli->query("SELECT * FROM boom_report WHERE report_post = '$post' AND report_type = 2");
	if($check_report->num_rows > 0){
		return boomSuccess('reported');
	}
	else {
		$valid_post = $mysqli->query("SELECT post_id, post_user FROM boom_post WHERE post_id = '$post'");
		if($valid_post->num_rows > 0){
			$wall = $valid_post->fetch_assoc();
			$mysqli->query("INSERT INTO boom_report (report_type, report_user, report_target, report_post, report_reason, report_date, report_room) VALUES (2, '{$data['user_id']}', '{$wall['post_user']}', '$post', '$reason', '" . time() . "', 0)");
			updateStaffNotify();
			return boomSuccess('reported');
		}
		else {
			return boomError('error');
		}
	}
}
function makeNewsReport(){
	global $mysqli, $data;
	if(!canSendReport()){
		return boomError('report_limit');
	}
	$post = escape($_POST['report'], true);
	$reason = escape($_POST['reason'], true);
	if(!validReport($reason)){
		return boomError('error');
	}
	$check_report = $mysqli->query("SELECT * FROM boom_report WHERE report_post = '$post' AND report_type = 5");
	if($check_report->num_rows > 0){
		return boomSuccess('reported');
	}
	else {
		$valid_post = $mysqli->query("SELECT id, news_poster FROM boom_news WHERE id = '$post'");
		if($valid_post->num_rows > 0){
			$news = $valid_post->fetch_assoc();
			$mysqli->query("INSERT INTO boom_report (report_type, report_user, report_target, report_post, report_reason, report_date, report_room) VALUES (5, '{$data['user_id']}', '{$news['news_poster']}', '$post', '$reason', '" . time() . "', 0)");
			updateStaffNotify();
			return boomSuccess('reported');
		}
		else {
			return boomError('error');
		}
	}
}
function makeChatReport(){
	global $mysqli, $data;
	if(!canSendReport()){
		return boomError('report_limit');
	}
	$post = escape($_POST['report'], true);
	$reason = escape($_POST['reason'], true);
	if(!validReport($reason)){
		return boomError('error');
	}
	$check_report = $mysqli->query("SELECT * FROM boom_report WHERE report_post = '$post' AND report_type = 1");
	if($check_report->num_rows > 0){
		return boomSuccess('reported');
	}
	else {
		$log = logDetails($post);
		if(!empty($log)){
			$mysqli->query("INSERT INTO boom_report (report_type, report_user, report_target, report_post, report_reason, report_date, report_room) VALUES (1, '{$data['user_id']}', '{$log['user_id']}', '$post', '$reason', '" . time() . "', '{$data['user_roomid']}')");
			updateStaffNotify();
			return boomSuccess('reported');
		}
		else {
			return boomError('error');
		}
	}
}
function makeProfileReport(){
	global $mysqli, $data;
	if(!canSendReport()){
		return boomError('report_limit');
	}
	$id = escape($_POST['report'], true);
	$reason = escape($_POST['reason'], true);
	if(mySelf($id)){
		return boomError('error');
	}
	if(!validReport($reason)){
		return boomError('error');
	}
	$check_report = $mysqli->query("SELECT * FROM boom_report WHERE report_target = '$id' AND report_type = 4");
	if($check_report->num_rows > 0){
		return boomSuccess('reported');
	}
	$user = userDetails($id);
	if(empty($user)){
		return boomError('error');
	}
	if(isBot($user)){
		return boomError('error');
	}
	$mysqli->query("INSERT INTO boom_report (report_type, report_user, report_target, report_reason, report_date) VALUES (4, '{$data['user_id']}', '{$user['user_id']}', '$reason', '" . time() . "')");
	updateStaffNotify();
	return boomSuccess('reported');
}
function makePrivateReport(){
	global $mysqli, $data;
	
	$target = escape($_POST['report'], true);
	$reason = escape($_POST['reason'], true);

	if(!canSendReport()){
		return boomError('report_limit');
	}
	$user = userDetails($target);
	if(empty($user)){
		return boomError('error');
	}
	if(!validReport($reason)){
		return boomError('error');
	}
	$check_private = $mysqli->query("SELECT hunter FROM boom_private WHERE hunter = '{$data['user_id']}' AND target = '$target' || hunter = '$target' AND target = '{$data['user_id']}' LIMIT 1");
	if($check_private->num_rows < 1){
		return boomError('error');
	}
	$check_report = $mysqli->query("SELECT * FROM boom_report WHERE report_user = '{$data['user_id']}' AND report_target = '$target' AND report_type = 3");
	if($check_report->num_rows > 0){
		return boomSuccess('reported');
	}
	$mysqli->query("INSERT INTO boom_report (report_type, report_user, report_target, report_reason, report_date, report_room) VALUES ('3', '{$data['user_id']}', '$target', '$reason', '" . time() . "', '0')");
	updateStaffNotify();
	return boomSuccess('reported');
}

// end of functions

if(isset($_POST['send_report'], $_POST['type'], $_POST['report'], $_POST['reason'])){
	$type = escape($_POST['type'], true);
	if($type == 1){
		echo makeChatReport();
		die();
	}
	else if($type == 2){
		echo makeWallReport();
		die();
	}
	else if($type == 3){
		echo makePrivateReport();
		die();
	}
	else if($type == 4){
		echo makeProfileReport();
		die();
	}
	else if($type == 5){
		echo makeNewsReport();
		die();
	}
	else {
		die();
	}
}
die();
?>