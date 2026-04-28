<?php
require('../config_session.php');

if(!canCreateGroupCall()){
	echo 0;
	die();
}
?>
<div id="group_call_select" class="">
	<div class="modal_content">
		<div class="centered_element hpad25">
			<p class="vpad5"><?php echo $lang['call_select']; ?></p>
		</div>
	</div>
	<div class="modal_control centered_element">
		<?php if(canCreateVideoGroupCall()){ ?>
		<div>
			<button data-type="1" class="group_call_type delete_btn large_button"><i class="fa fa-video-camera"></i>  <?php echo $lang['video_call']; ?></button>
		</div>
		<?php } ?>
		<?php if(canCreateAudioGroupCall()){ ?>
		<div class="tpad10">
			<button data-type="2" class="group_call_type default_btn large_button"><i class="fa fa-microphone"></i> <?php echo $lang['audio_call']; ?></button>
		</div>
		<?php } ?>
	</div>
</div>
<div id="group_call_form" class="fhide" data-type="">
	<div class="modal_content">
		<div class="setting_element">
			<p class="label"><?php echo $lang['room_name']; ?></p>
			<input id="set_call_name" class="full_input" type="text" maxlength="30" />
		</div>
		<div class="setting_element">
			<p class="label"><?php echo $lang['password']; ?> <span class="theme_color text_xsmall"><?php echo $lang['optional']; ?></span></p>
			<input  id="set_call_password" class="full_input" type="text" maxlength="20"/>
		</div>
		<div class="setting_element">	
			<p class="label"><?php echo $lang['room_type']; ?></p>
			<select  class="select_room"  id="set_call_access">
				<?php echo listRoomAccess(); ?>
			</select>
		</div>
	</div>
	<div class="modal_control">
		<button class="reg_button theme_btn" onclick="addGroupCall();" id="add_group_call"><?php echo $lang['create']; ?></button>
		<button class="reg_button cancel_over default_btn"><?php echo $lang['cancel']; ?></button>
	</div>
</div>
<script>
$(document).on('click', '.group_call_type', function() {
    const type = $(this).data('type');
    $('#group_call_form').attr('data-type', type);
    $('#group_call_select').addClass('fhide');
    $('#group_call_form').removeClass('fhide');
	selectIt();
});
</script>