<?php
require("session.php");;
require("database.php");
require("controller.php");
require("function.php");
require("function_all.php");
require('function_sranking.php');
require('settings.php');
require('function_redis.php');

if(checkRateLimit()){
	die();
}

if(!checkToken()){
	die();
}
mysqli_report(MYSQLI_REPORT_OFF);
$mysqli = @new mysqli(BOOM_DHOST, BOOM_DUSER, BOOM_DPASS, BOOM_DNAME);
if (mysqli_connect_errno()){
	die();
}
$pass = escape($_COOKIE[BOOM_PREFIX . 'utk']);
$ident = escape($_COOKIE[BOOM_PREFIX . 'userid'], true);

$data = getUserSession($ident, $pass);

if(empty($data)){
	clearUserSession();
	die();
}

define('BOOM_LANG', $data['user_language']);
require("language/" . BOOM_LANG . "/language.php");
require("language/" . BOOM_LANG . "/response.php");

date_default_timezone_set($data['user_timezone']);
?>