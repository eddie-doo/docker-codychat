<?php
require('../config.php');
if(!allowGuest()){
	die();
}
if(checkCoppa()){
	echo 99;
	die();
}
?>
<div id="guest_form_box">
	<div class="modal_title">
		<?php echo $lang['guest_login']; ?>
	</div>
	<div class="modal_content">
		<div>
			<input id="guest_username" class="user_username full_input" type="text" maxlength="<?php echo $setting['max_username']; ?>" name="username" autocomplete="off" placeholder="<?php echo $lang['username']; ?>">
		</div>
		<?php if(guestForm()){ ?>
		<div class="vpad15">
			<select id="guest_gender">
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
		<?php } ?>
		<?php if(!guestForm()){ ?>
			<input id="guest_gender" class="hidden" value="1">
			<input id="guest_age" class="hidden" value="1">
		<?php } ?>
		<?php if(boomRecaptcha()){ ?>
		<div class="recapcha_div tmargin15">
			<div id="boom_recaptcha" class="guest_recaptcha">
			</div>
		</div>
		<?php } ?>
	</div>
	<div class="modal_control">
		<button onclick="sendGuestLogin();" type="button" class="theme_btn full_button large_button"><i class="fa fa-sign-in"></i> <?php echo $lang['login']; ?></button>
	</div>
</div>