<?php
require(__DIR__ . '/../config_session.php');

function processCover(){
	global $mysqli, $setting, $data;
	
	if(!canCover()){
		return boomError('error');
	}
	
	session_write_close();
	
	ini_set('memory_limit','128M');
	$info = pathinfo($_FILES["file"]["name"]);
	$extension = $info['extension'];

	if ( fileError(3) ){
		return boomError('wrong_file');
	}
	if (isCoverImage($extension)){
		$imginfo = getimagesize($_FILES["file"]["tmp_name"]);
		if ($imginfo !== false) {
			
			$width = $imginfo[0];
			$height = $imginfo[1];
			$type = $imginfo['mime'];
			
			$fname = encodeFileTumb($extension, $data);
			$file_name = $fname['full'];
			$file_tumb = $fname['tumb'];
			
			boomMoveFile('cover/' . $file_name);
			
			if(blockedImage('cover/' . $file_name)){
				return boomError('file_blocked');
			}
			
			$source = 'cover/' . $file_name;
			$tumb = 'cover/' . $file_tumb;
			
			if(canGifCover()){
				$create = imageTumb($source, $tumb, $type, 500);
			}
			else {
				$create = imageTumbGif($source, $tumb, $type, 500);
			}
			
			if(sourceExist($source) && sourceExist($tumb)){
				unlinkCover($file_name);
				unlinkCover($data['user_cover']);
				$mysqli->query("UPDATE boom_users SET user_cover = '$file_tumb' WHERE user_id = '{$data['user_id']}'");
				redisUpdateUser($data['user_id']);
				return boomCode(5, array('data'=> myCover($file_tumb)));
			}
			else if(sourceExist($source)){
				if(!canGifCover()){
					unlinkCover($file_name);
					return boomError('wrong_file');
				}
				else {
					unlinkCover($data['user_cover']);
					$mysqli->query("UPDATE boom_users SET user_cover = '$file_name' WHERE user_id = '{$data['user_id']}'");
					redisUpdateUser($data['user_id']);
					return boomCode(5, array('data'=> myCover($file_name)));
				}
			}
			else {
				return boomError('error');
			}
		}
		else {
			return boomError('wrong_file');
		}
	}
	else {
		return boomError('wrong_file');
	}
}
function staffAddCover(){
	global $mysqli, $data;
	
	$target = escape($_POST['target'], true);
	$user = userDetails($target);
	
	if(!canModifyCover($user)){ 
		return boomError('error');
	}

	ini_set('memory_limit','128M');
	$info = pathinfo($_FILES["file"]["name"]);
	$extension = $info['extension'];

	if ( fileError(3) ){
		return boomError('wrong_file');
	}
	if (isCoverImage($extension)){
		$imginfo = getimagesize($_FILES["file"]["tmp_name"]);
		if ($imginfo !== false) {
			
			$width = $imginfo[0];
			$height = $imginfo[1];
			$type = $imginfo['mime'];
			
			$fname = encodeFileTumb($extension, $user);
			$file_name = $fname['full'];
			$file_tumb = $fname['tumb'];
			
			boomMoveFile('cover/' . $file_name);
			
			if(blockedImage('cover/' . $file_name)){
				return boomError('file_blocked');
			}
			
			$source = 'cover/' . $file_name;
			$tumb = 'cover/' . $file_tumb;
			
			if(canGifCover()){
				$create = imageTumb($source, $tumb, $type, 500);
			}
			else {
				$create = imageTumbGif($source, $tumb, $type, 500);
			}
			
			if(sourceExist($source) && sourceExist($tumb)){
				unlinkCover($file_name);
				unlinkCover($user['user_cover']);
				$mysqli->query("UPDATE boom_users SET user_cover = '$file_tumb' WHERE user_id = '{$user['user_id']}'");
				redisUpdateUser($user['user_id']);
				return boomCode(5, array('data'=> myCover($file_tumb)));
			}
			else if(sourceExist($source)){
				if(!canGifCover()){
					unlinkCover($file_name);
					return boomError('wrong_file');
				}
				else {
					unlinkCover($user['user_cover']);
					$mysqli->query("UPDATE boom_users SET user_cover = '$file_name' WHERE user_id = '{$user['user_id']}'");
					redisUpdateUser($user['user_id']);
					return boomCode(5, array('data'=> myCover($file_name)));
				}
			}
			else {
				return boomError('error');
			}
		}
		else {
			return boomError('wrong_file');
		}
	}
	else {
		return boomError('wrong_file');
	}
}

function staffRemoveCover(){
	global $mysqli, $data;
	
	$target = escape($_POST['remove_cover']);
	
	$user = userDetails($target);
	if(!canModifyCover($user)){
		return boomError('cannot_user');
	}
	resetCover($user);
	boomConsole('remove_cover', array('target'=> $user['user_id']));
	return boomCode(1);
}

// end of functions

if (isset($_FILES["file"], $_POST['self'])){
	echo processCover();
	die();
}
if (isset($_FILES["file"], $_POST['target'])){
	echo staffAddCover();
	die();
}
if(isset($_POST['delete_cover'])){
	$reset = resetCover($data);
	die();
}
if(isset($_POST['remove_cover'])){
	echo staffRemoveCover();
}
die();
?> 