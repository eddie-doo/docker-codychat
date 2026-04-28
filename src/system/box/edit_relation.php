<?php
require('../config_session.php');
?>
<div class="modal_content">
	<div class="setting_element ">
		<p class="label"><?php echo $lang['relationship']; ?></p>
		<select id="set_profile_relation">
			<?php echo listRelation($data['user_relation']); ?>
		</select>
	</div>
</div>
<div class="modal_control">
	<button type="button" onclick="saveRelation();" class="reg_button theme_btn"><?php echo $lang['save']; ?></button>
</div>