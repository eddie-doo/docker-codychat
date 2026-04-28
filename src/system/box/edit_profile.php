<?php
require('../config_session.php');
$music = userProfileMusic($data);
$use_style = false;
if(profileStyle($data)){
	$style = styleDetails($data['user_pstyle']);
	if(!empty($style)){
		$use_style = true;
	}
}
if($use_style){
	echo boomTemplate('element/profile_style_load', $style);
}
?>
<div class="profile_wrap <?php if($use_style){ echo 'pstyle_box'; } ?> pstylewrap">
	<div id="my_profile_top" class="modal_wrap_top pro_top profile_background <?php echo coverClass($data); ?> pstyletop" <?php echo getCover($data); ?>>
		<div class="btable">
			<div class="bcell">
				<div class="modal_top_menu">
					<div class="bcell_mid hpad15">
						<?php if(useLike() || useLevel()){ ?>
						<div id="profile_like">
							<?php echo getProfileLevel($data); ?>
							<?php echo getProfileLikes($data); ?>
						</div>
						<?php } ?>
					</div>
					<?php if(canCover()){ ?>
					<div class="cover_menu">
						<div class="cover_item_wrap lite_olay">
							<div class="cover_item delete_cover" onclick="deleteCover();">
								<i class="fa fa-times" id="cover_button"></i>
							</div>
							<div class="cover_item add_cover">
									<i class="fa fa-camera" id="cover_icon" data="fa-camera"></i>
									<input id="cover_file" class="up_input" onchange="uploadCover();" type="file"/>
							</div>
						</div>
					</div>
					<div class="modal_top_menu_empty">
					</div>
					<?php } ?>
					<div data="<?php echo $data['user_id']; ?>" class="get_info modal_top_item cover_text">
						<i class="fa-regular fa-eye"></i>
					</div>
					<div class="cancel_modal modal_top_item cover_text">
						<i class="fa fa-times"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="btable bpad10">
			<div class="bcell">
			</div>
			<div id="proav" class="profile_avatar" data="<?php echo $data['user_tumb']; ?>" >
				<div class="avatar_spin">
					<img data-fancybox class="avatar_profile pstyleavatar" href="<?php echo myAvatar($data['user_tumb']); ?>" src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<?php if(canAvatar()){ ?>
				<div class="avatar_control olay">
					<div class="avatar_button" onclick="deleteAvatar();" id="delete_avatar">
						<i class="fa fa-times"></i>
					</div>
					<div id="avatarupload" class="avatar_button" onclick="avatarUpload();">
						<i class="fa fa-camera" id="avat_icon" data="fa-camera"></i>
					</div>
				</div>
				<?php } ?>
			</div>
			<div class="bcell">
			</div>
		</div>
		<div class="cover_text centered_element bpad15">
			<div class="pdetails">
				<div class="pdetails_text pro_rank">
					<?php echo proRank($data); ?>
				</div>
			</div>
			<div class="pdetails">
				<div id="pro_name" class="globname pdetails_text pro_name">
					<?php echo $data['user_name']; ?>
				</div>
			</div>
			<?php if(canProfileMusic()){ ?>
			<div class="pdetails tpad5">
				<div id="add_pmusic" class="lite_olay proplayer_btn <?php if(!empty($music)){ echo 'fhide'; } ?>">
					 <i class="fa fa-circle-play"></i> <?php echo $lang['add_music']; ?>
					 <input id="pmusic_file" class="up_input" onchange="uploadMusic();" accept=".mp3" type="file"/>
				</div>
				<div id="up_pmusic" class="lite_olay proplayer_btn fhide">
					 <i class="fa-solid fa-ellipsis fa-beat-fade"></i>
				</div>
				<div id="del_pmusic" onclick="removeProfileMusic();" class="lite_olay proplayer_btn <?php if(empty($music)){ echo 'fhide'; } ?>">
					 <i class="fa fa-circle-play"></i> <?php echo $lang['del_music']; ?>
				</div>
			</div>
			<?php } ?>
		</div>
	</div>
	<?php if(!isSecure($data) && isMember($data)){ ?>
	<div id="secure_account_warn" onclick="openSecure();" class="profile_info_box ok_btn">
		<i class="fa fa-exclamation-circle"></i> <?php echo $lang['secure_account']; ?>
	</div>
	<?php } ?>
	<?php if(guestCanRegister()){ ?>
	<div id="secure_account_warn" onclick="openGuestRegister();" class="profile_info_box ok_btn">
		<i class="fa fa-exclamation-circle"></i> <?php echo $lang['register_guest']; ?>
	</div>
	<?php } ?>
	<?php if(userDelete($data)){ ?>
	<div id="delete_warn" class="pad15 warn_btn">
		<p class="text_xsmall">
		<span><?php echo str_replace('%date%', longDate($data['user_delete']), $lang['close_warning']); ?></span> 
		<span onclick="cancelDelete();" class="link_like"><?php echo $lang['cancel_request']; ?></span>
		</p>
	</div>
	<?php } ?>
	<div class="pro_menu_wrap pstylemenu">
		<div class="modal_menu modal_mback hpad15 centered_element">
			<ul>
				<li class="modal_menu_item modal_selected" data="meditprofile" data-z="personal_account"><?php echo $lang['account']; ?></li>
				<li class="modal_menu_item" data="meditprofile" data-z="personal_more"><?php echo $lang['more']; ?></li>
			</ul>
		</div>
	</div>
	<div id="meditprofile" class="edit_profile_content_wrap  pstylecontent">
		<div class="modal_zone pad25 tpad15" id="personal_account">
			<div onclick="changeInfo();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-address-card proicon"></i><?php echo $lang['edit_info']; ?></div>
			</div>
			<div onclick="changeRelation();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-heart proicon"></i><?php echo $lang['edit_relation']; ?></div>
			</div>
			<?php if(canName()){ ?>
			<div onclick="changeUsername();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-edit proicon"></i><?php echo $lang['edit_username']; ?></div>
			</div>
			<?php } ?>
			<?php if(canAbout()){ ?>
			<div onclick="changeAbout();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-question-circle proicon"></i><?php echo $lang['edit_about']; ?></div>
			</div>
			<?php } ?>
			<?php if(canMood()){ ?>
			<div onclick="changeMood();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-heart proicon"></i><?php echo $lang['edit_mood']; ?></div>
			</div>
			<?php } ?>
			<?php if(isMember($data) && isSecure($data)){ ?>
			<div onclick="getEmail();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-envelope proicon"></i><?php echo $lang['edit_email']; ?></div>
			</div>
			<div onclick="getPassword();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-key proicon"></i><?php echo $lang['change_password']; ?></div>
			</div>
			<?php } ?>
		</div>
		<div class="modal_zone hide_zone pad25 tpad15" id="personal_more">
			<?php if(useGift()){ ?>
			<div onclick="getGift();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-gift proicon"></i><?php echo $lang['gift']; ?></div>
			</div>
			<?php } ?>
			<?php if(isMember($data)){ ?>
			<div onclick="getFriends();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-user-plus proicon"></i><?php echo $lang['manage_friends']; ?></div>
			</div>
			<?php } ?>
			<div onclick="getIgnore();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-ban proicon"></i><?php echo $lang['manage_ignores']; ?></div>
			</div>
			<div onclick="getPreference();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-user-tie proicon"></i><?php echo 'Preferences'; ?></div>
			</div>
			<div onclick="changeShared();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-ghost proicon"></i><?php echo $lang['edit_privacy']; ?></div>
			</div>
			<div onclick="getLocation();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-globe proicon"></i><?php echo $lang['lang_location']; ?></div>
			</div>
			<?php if(isMember($data) && isSecure($data)){ ?>
			<div onclick="getOtherLogout();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-sign-out proicon"></i><?php echo $lang['logout_option']; ?></div>
			</div>
			<?php } ?>
			<?php if(!boomAllow(100) && !userDelete($data) && !isBot($data) && isSecure($data)){ ?>
			<div id="del_account_btn" onclick="getDeleteAccount();" class="btable blisting proitem">
				<div class="bcell_mid"><i class="fa fa-trash-can proicon"></i><?php echo $lang['close_account']; ?></div>
			</div>
			<?php } ?>
		</div>
	</div>
</div>