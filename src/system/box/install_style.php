<?php
require_once('../config_admin.php');

if(!boomAllow(100)){
	die();
}
?>
<div class="modal_content tpad15">
	<div class="text_med pad5 bpad10 bborder">
		<?php echo $lang['pstyle']; ?>
	</div>
	<div class="style_listing tmargin20">
		<?php echo adminStyleList(); ?>
	</div>
</div>