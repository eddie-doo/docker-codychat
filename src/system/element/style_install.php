<?php
	$id = 'stylein_' . uniqid();
?>
<div id="<?php echo $id; ?>" class="sub_list_item blisting style_install_item btauto">
	<div class="sub_list_name style_install_name">
		<?php echo boomUnderClear($boom); ?>
	</div>
	<div class="sub_list_cell bcauto" onclick="installProfileStyle('<?php echo $boom; ?>', '<?php echo $id; ?>');">
		<button class="default_btn button style_abutton"><i class="fa fa-plus"></i> <?php echo $lang['install']; ?></button>
	</div>
</div>