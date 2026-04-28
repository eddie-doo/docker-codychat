<?php
require(__DIR__ . '/../../config_admin.php');

if(!boomAllow(100)){
	die();
}
?>
<?php echo elementTitle($lang['display']); ?>
<div class="page_full">
	<div class="page_element">
		<div class="form_content">
			<div class="setting_element ">
				<p class="label"><?php echo $lang['theme']; ?></p>
				<select id="set_main_theme">
					<?php echo listTheme($setting['default_theme'], 1); ?>
				</select>
			</div>
			<div class="setting_element ">
				<p class="label"><?php echo $lang['left_mode']; ?></p>
				<select id="set_left_mode">
					<option <?php echo selCurrent($setting['left_mode'], 1); ?> value="1"><?php echo $lang['left_bar']; ?></option>
					<option <?php echo selCurrent($setting['left_mode'], 2); ?> value="2"><?php echo $lang['left_float']; ?></option>
				</select>
			</div>
			<div class="setting_element ">
				<p class="label"><?php echo $lang['log_mode']; ?> <?php echo createInfo('log_mode'); ?></p>
				<select id="set_log_mode">
					<option <?php echo selCurrent($setting['log_mode'], 1); ?> value="1"><?php echo $lang['log_bubble']; ?></option>
					<option <?php echo selCurrent($setting['log_mode'], 2); ?> value="2"><?php echo $lang['log_text']; ?></option>
					<option <?php echo selCurrent($setting['log_mode'], 3); ?> value="3"><?php echo $lang['log_duo']; ?></option>
				</select>
			</div>
			<div class="setting_element">
				<p class="label"><?php echo $lang['login_page']; ?></p>
				<select id="set_login_page">
					<?php echo listLogin(); ?>
				</select>
			</div>
			<div class="setting_element">
				<p class="label"><?php echo $lang['use_gender']; ?></p>
				<select id="set_use_gender">
					<?php echo yesNo($setting['use_gender']); ?>
				</select>
			</div>
			<div class="setting_element">
				<p class="label"><?php echo $lang['use_flag']; ?></p>
				<select id="set_use_flag">
					<?php echo yesNo($setting['use_flag']); ?>
				</select>
			</div>
		</div>
		<div class="form_control">
			<button onclick="saveAdminDisplay();" type="button" class="reg_button theme_btn"><?php echo $lang['save']; ?></button>
		</div>
	</div>
</div>