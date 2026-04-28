<?php 
require(__DIR__ . '/../config_session.php');

$target = 0;
if(isset($_POST['target'])){
	$target = escape($_POST['target'], true);
}
?>
<div class="modal_content tpad10">
	<div class="uploader">
	  <div class="stage" id="stage">
		<canvas id="view" width="1024" height="1024"></canvas>
		<div class="overlay" id="overlay"></div>
	  </div>
	</div>
	<div id="avslider" class="btable tpad15 bpad15 hpad25 fhide">
		<div id="avslideup" class="bcell_mid av_slide_opt">
			<i class="fa fa-minus"></i>
		</div>
		<div id="av_slider" class="bcell_mid boom_slider">
			<div id="avatar_slider" style="width:100%;">
			</div>
		</div>
		<div id="avslidedown" class="bcell_mid av_slide_opt">
			<i class="fa fa-plus"></i>
		</div>
	</div>
	<div class="vpad10 centered_element">
			<button type="button" id="chooseImageBtn" class="reg_button default_btn bmargin3 bclick"><?php echo 'Select file'; ?></button>
			<input id="avatar_file" type="file" accept="image/*" style="display:none;" />
			<button id="saveavatar" class="reg_button ok_btn bmargin3 bclick" disabled><?php echo $lang['save']; ?></button>
	</div>
</div>
<script>
	<?php if($target > 0){ ?>
		initAvatarEditor({target: <?php echo $target; ?>});
	<?php } ?>
	<?php if($target == 0){ ?>
		initAvatarEditor(); 
	<?php } ?>
</script>