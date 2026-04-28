<?php
require('../config_session.php');
if(!isset($_POST['id'])){
	die();
}
$id = escape($_POST['id'], true);

$news = newsDetails($id);

if(empty($news)){
	die();
}
if(!mySelf($news['news_poster'])){
	die();
}
?>
<div class="modal_title">
	<?php echo $lang['post_options']; ?>
</div>
<div class="modal_content">
	<div id="news_target" class="hidden" data="<?php echo $id; ?>">
	</div>
	<div class="switch_item bbackhover">
		<div class="switch_item_text">
			<?php echo $lang['post_comments']; ?>
		</div>
		<div class="switch_item_switch">
			<div class="switch_wrap">
				<?php echo createSwitch('set_ncomment', $news['news_comment'], 'saveNewsOptions'); ?>
			</div>
		</div>
	</div>
	<div class="switch_item bbackhover">
		<div class="switch_item_text">
			<?php echo $lang['post_likes']; ?>
		</div>
		<div class="switch_item_switch">
			<div class="switch_wrap">
				<?php echo createSwitch('set_nlike', $news['news_like'], 'saveNewsOptions'); ?>
			</div>
		</div>
	</div>
</div>