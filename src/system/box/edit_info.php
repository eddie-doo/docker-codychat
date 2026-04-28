<?php
require('../config_session.php');

if(empty($data['user_birth'])){
	$y = 0;
	$m = 0;
	$d = 0;
}
else {
	list($y, $m, $d) = explode('-', $data['user_birth']);
	$y = (int)$y;
	$m = (int)$m;
	$d = (int)$d;
}
if(!canInfo()){
	echo boomTemplate('box/notice_over', $lang['info_warn']);
	die();
}
?>
<div class="modal_content">
	<div class="vpad15">
		<?php echo boomNotice('warning', $lang['info_text']); ?>
	</div>
	<div class="setting_element ">
		<p class="label"><?php echo $lang['gender']; ?></p>
		<select id="set_profile_gender">
			<?php echo listGender($data['user_sex']); ?>
		</select>
	</div>
	<div class="setting_element">
		<p class="label"><?php echo $lang['birth_date']; ?></p>
		<div class="date_form">
			<div class="date_col date_day">
				<select id="date_day">
					<?php echo listDays($d); ?>
				</select>
			</div>
			<div class="date_col date_month">
				<select id="date_month">
					<?php echo listMonths($m); ?>
				</select>
			</div>
			<div class="date_col date_year">
				<select id="date_year">
					<?php echo listYears($y); ?>
				</select>
			</div>
		</div>
	</div>
</div>
<div class="modal_control">
	<button type="button" onclick="saveInfo();" class="reg_button theme_btn"><?php echo $lang['save']; ?></button>
</div>