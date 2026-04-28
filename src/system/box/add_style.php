<?php
require_once('../config_session.php');

if(!boomAllow(100)){
	die();
}
?>
<div class="modal_content">
	<div class="setting_element">
		<p class="label">Style name</p>
		<input id="add_style_name" class="full_input" type="text"/>
	</div>
</div>
<div class="modal_control">
	<button onclick="createProfileStyle();" type="button" class="reg_button theme_btn"><?php echo $lang['add']; ?></button>
</div>