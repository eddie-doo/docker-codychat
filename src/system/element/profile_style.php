<?php
if(!isset($boom['preview'])){ 
	$cover_class = coverClass($data);
	$cover_data = getCover($data);
	$button = '<button onclick="savePstyle(' . $boom['id'] . ');" class="ok_btn reg_button pstyle_save">' . $lang['sel'] . '</button>';
}
else {
	$cover_class = '';
	$cover_data = '';
	$button = '<button  class="ok_btn reg_button close_over">' . $lang['close'] . '</button>';
}
?>
<style>
	.pstylewrap<?php echo $boom['id']; ?> { <?php echo $boom['style_wrap']; ?> }
	.pstyletop<?php echo $boom['id']; ?> { <?php echo $boom['style_top']; ?>}
	.pstyleavatar<?php echo $boom['id']; ?> { <?php echo $boom['style_avatar']; ?>}
	.pstylemenu<?php echo $boom['id']; ?> { <?php echo $boom['style_menu']; ?>}
	.pstylecontent<?php echo $boom['id']; ?> { <?php echo $boom['style_content']; ?>}
	<?php echo boomRewriteStyleCustom($boom['style_custom'], $boom['id']); ?>
</style>
<div class="pstyle_container bpad25">
	<div class="pstyle_wrap pstyle_box pstylewrap<?php echo $boom['id']; ?>">
		<div class="back_modal pstyle_cover">
			<div class="pro_top bpad10 pstyle_top <?php echo $cover_class; ?> pstyletop<?php echo $boom['id']; ?>" <?php echo $cover_data; ?>>
				<div class="pstyle_top_menu">
					<div class="btable hpad5">
						<div class="bcell_mid pstyle_olay">
							<div class="pstyle_olay_item lite_olay">
								<?php echo $boom['style_name']; ?>
							</div>
						</div>
						<div class="bcell_mid">
						</div>
						<div class="modal_top_item pstyle_top_item">
							<i class="fa fa-edit"></i>
						</div>
						<div class="modal_top_item pstyle_top_item">
							<i class="fa fa-bars"></i>
						</div>
						<div class="modal_top_item pstyle_top_item">
							<i class="fa fa-times"></i>
						</div>
					</div>
				</div>
				<div class="pstyle_data centered_element">
					<div class="pstyle_avatar">
						<img class="avatar_pstyle pstyleavatar<?php echo $boom['id']; ?>" src="<?php echo myAvatar($data['user_tumb']); ?>"/>
					</div>
					<div class="pstyle_rank">
						<?php echo proRank($data); ?>
					</div>
					<div class="pstyle_name">
						<?php echo $data['user_name']; ?>
					</div>
				</div>
			</div>
			<div class="modal_menu modal_mback centered_element pstyle_menu pstylemenu<?php echo $boom['id']; ?>">
				<ul>
					<li class="modal_selected"><?php echo $lang['bio']; ?></li>
					<li><?php echo $lang['about_me']; ?></li>
					<li><?php echo $lang['more']; ?></li>
				</ul>
			</div>
			<div class="pstyle_bottom bpad10 tpad25 hpad25 pstylecontent<?php echo $boom['id']; ?>">
				<div class="bpad10">
					<div class="btable blisting proitem">
						<div class="bcell_mid bold"><i class="fa fa-language proicon"></i><?php echo $lang['language']; ?></div>
						<div class="bcell_mid prodata"><?php echo $data['user_language']; ?></div>
					</div>
					<div class="btable blisting proitem">
						<div class="bcell_mid bold"><i class="fa fa-user proicon"></i><?php echo $lang['join_chat']; ?></div>
						<div class="bcell_mid prodata"><?php echo longDate($data['user_join']); ?></div>
					</div>
					<div class="btable blisting proitem">
						<div class="bcell_mid bold"><i class="fa fa-eye proicon"></i><?php echo $lang['last_seen']; ?></div>
						<div class="bcell_mid prodata"><?php echo longDateTime($data['last_action']); ?></div>
					</div>
				</div>
				<div class="pstyle_choice bpad10 centered_element">
					<?php echo $button; ?>
				</div>
			</div>
		</div>
	</div>
</div>