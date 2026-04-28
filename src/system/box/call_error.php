<?php
require('../config_session.php');

if(!isset($_POST['error'])){
	die();
}

$end = escape($_POST['error'], true);

if($end == 99){
	die();
}

switch($end){
	case 1:
		$reason = $lang['call_error'];
		break;
	case 2:
		$reason = $lang['call_left'];
		break;
	case 3:
		$reason = $lang['call_fund'];
		break;
	case 4:
		$reason = $lang['call_expired'];
		break;
	case 5:
		$reason = $lang['call_banned'];
		break;
	default:
		$reason = $lang['call_error'];
}
?>
<div class="modal_content">
	<div class="centered_element tpad25">
		<p class="text_med bold"><?php echo $lang['call_ended']; ?></p>
		<p class="tpad5"><?php echo $reason; ?></p>
	</div>
</div>
<div class="modal_control centered_element">
	<button class="reg_button delete_btn close_over"><?php echo $lang['close']; ?></button>
</div>