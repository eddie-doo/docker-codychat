<?php
require('../config_session.php');

if(!isset($_POST['target'])){
	die();
}
$target = escape($_POST['target'], true);
$user = userDetails($target);
if(empty($user)){
	die();
}
if(!canViewWallet($user)){
	die();
}
?>
<div class="modal_content">
	<div class="vpad10 blist">
		<p class="text_small bold bpad5"><?php echo $lang['ruby']; ?></p>
		<div class="btable">
			<div class="bcell_mid ruby_icon">
				<img src="<?php echo rubyIcon(); ?>"/>
			</div>
			<div id="ruby" class="bcell_mid ruby_text bold hpad5">
				<?php echo $user['user_ruby']; ?>
			</div>
		</div>
	</div>
	<div class="vpad10">
		<p class="text_small bold bpad5"><?php echo $lang['gold']; ?></p>
		<div class="btable">
			<div class="bcell_mid gold_icon">
				<img src="<?php echo goldIcon(); ?>"/>
			</div>
			<div id="gold" class="bcell_mid gold_text bold hpad5">
				<?php echo $user['user_gold']; ?>
			</div>
		</div>
	</div>
</div>