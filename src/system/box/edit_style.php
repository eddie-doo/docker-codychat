<?php
require_once('../config_session.php');

function styleOutput($s){
	return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

if(!isset($_POST['style'])){
	die();
}

if(!boomAllow(100)){
	die();
}

$id = escape($_POST['style'], true);
$style = styleDetails($id);

if(empty($style)){
	die();
}
?>
<div class="modal_content">
	<div class="setting_element">
		<p class="label">Style name</p>
		<input id="set_style_name" class="full_input" type="text" value="<?php echo $style['style_name']; ?>"/>
	</div>
	<div class="setting_element ">
		<p class="label">Active</p>
		<select id="set_style_active">
			<?php echo yesNo($style['style_active']); ?>
		</select>
	</div>
	<div class="pro_style_edit">
		<div class="profile_style_editor">
			<div class="reg_menu_container tmargin10">		
				<div class="reg_menu">
					<ul>
						<li class="reg_menu_item rselected" data="style_tab" data-z="edit_style_wrap">Wrap</li>
						<li class="reg_menu_item" data="style_tab" data-z="edit_style_top">Top</li>
						<li class="reg_menu_item" data="style_tab" data-z="edit_style_avatar">Avatar</li>
						<li class="reg_menu_item" data="style_tab" data-z="edit_style_menu">Menu</li>
						<li class="reg_menu_item" data="style_tab" data-z="edit_style_content">Content</li>
						<li class="reg_menu_item" data="style_tab" data-z="edit_style_custom">Custom</li>
					</ul>
				</div>
			</div>
			<div id="style_tab">
				<div id="edit_style_wrap" class="reg_zone vpad5">
					<div class="setting_element">
						<textarea id="set_style_wrap" class="full_textarea large_textarea" type="text" maxlength="1000"><?php echo styleOutput($style['style_wrap']); ?></textarea>
					</div>
				</div>
				<div id="edit_style_top" class="reg_zone vpad5 hide_zone">
					<div class="setting_element">
						<textarea id="set_style_top" class="full_textarea large_textarea" type="text" maxlength="1000"><?php echo styleOutput($style['style_top']); ?></textarea>
					</div>
				</div>
				<div id="edit_style_avatar" class="reg_zone vpad5 hide_zone">
					<div class="setting_element">
						<textarea id="set_style_avatar" class="full_textarea large_textarea" type="text" maxlength="1000"><?php echo styleOutput($style['style_avatar']); ?></textarea>
					</div>
				</div>
				<div id="edit_style_menu" class="reg_zone vpad5 hide_zone">
					<div class="setting_element">
						<textarea id="set_style_menu" class="full_textarea large_textarea" type="text" maxlength="1000"><?php echo styleOutput($style['style_menu']); ?></textarea>
					</div>
				</div>
				<div id="edit_style_content" class="reg_zone vpad5 hide_zone">
					<div class="setting_element">
						<textarea id="set_style_content" class="full_textarea large_textarea" type="text" maxlength="1000"><?php echo styleOutput($style['style_content']); ?></textarea>
					</div>
				</div>
				<div id="edit_style_custom" class="reg_zone vpad5 hide_zone">
					<div class="setting_element">
						<textarea id="set_style_custom" class="full_textarea large_textarea" type="text" maxlength="1000"><?php echo styleOutput($style['style_custom']); ?></textarea>
					</div>
				</div>
			</div>
		</div>
		<div class="clear"></div>
	</div>
</div>
<div class="modal_control">
	<button onclick="saveProfileStyle(<?php echo $style['id']; ?>);" type="button" class="reg_button theme_btn"><?php echo $lang['save']; ?></button>
	<button onclick="previewProfileStyle(<?php echo $style['id']; ?>);" type="button" class="reg_button default_btn"><?php echo $lang['preview']; ?></button>
	<button onclick="deleteProfileStyle(<?php echo $style['id']; ?>);" class="button fright rtl_fleft delete_btn"><i class="fa fa-trash-can"></i></button>
</div>