<?php
require('../config_session.php');

if(!boomAllow(100)){
	die();
}
if(!isset($_POST['preview_style'])){
	die();
}

$id = escape($_POST['preview_style'], true);
$style = styleDetails($id);
if(empty($style)){
	die();
}
$style['preview'] = true;
?>
<div class="tpad25">
	<?php echo boomTemplate('element/profile_style', $style); ?>
</div>