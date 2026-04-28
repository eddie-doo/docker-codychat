<?php 
require('../config.php'); 
if(checkCoppa()){
	echo 99;
	die();
}
?>
<div id="registration_form_box">
	<div class="modal_title">
		<?php echo $lang['register']; ?>
	</div>
	<div class="modal_content">
		<div class="bpad15">
			<input spellcheck="false" id="reg_username" class="full_input" type="text" maxlength="<?php echo $setting['max_username']; ?>" autocomplete="off" placeholder="<?php echo $lang['username']; ?>">
			<input type="text" style="display:none">
			<input type="password" style="display:none">
		</div>
		<div class="bpad15">
			<input spellcheck="false" id="reg_password" class="full_input" maxlength="30" type="password" autocomplete="off" placeholder="<?php echo $lang['password']; ?>">
		</div>
		<div class="bpad15">
			<input spellcheck="false" id="reg_email" class="full_input" maxlength="80" type="text" autocomplete="off" placeholder="<?php echo $lang['email']; ?>">
		</div>
		<div class="bpad15">
			<select id="login_select_gender">
				<?php echo listGender(1); ?>
			</select>
		</div>
		<div class="register_date">
			<p class="label hpad5"><?php echo $lang['birth_date']; ?></p>
			<div class="date_form">
				<div class="date_col date_day">
					<select id="date_day">
						<?php echo listDays(); ?>
					</select>
				</div>
				<div class="date_col date_month">
					<select id="date_month">
						<?php echo listMonths(); ?>
					</select>
				</div>
				<div class="date_col date_year">
					<select id="date_year">
						<?php echo listYears(); ?>
					</select>
				</div>
			</div>
		</div>
		<div class="clear"></div>
		<?php if(boomRecaptcha()){ ?>
		<div class="recapcha_div tmargin15">
			<div id="boom_recaptcha" class="register_recaptcha">
			</div>
		</div>
		<?php } ?>
	</div>
	<div class="modal_control">
		<button onclick="sendRegistration();" type="button" class="theme_btn full_button large_button" id="register_button"><i class="fa fa-edit"></i> <?php echo $lang['register']; ?></button>
		<div class="rules_text_elem vpad10">
			<p class="rules_text text_xsmall sub_text"><?php echo $lang['i_agree']; ?> <span class="rules_click" onclick="showRules();"><?php echo $lang['terms']; ?></span></p>
		</div>
	</div>
</div>