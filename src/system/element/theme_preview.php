<?php 
$background = '';
if(!empty($boom['background_image'])){
	$background = "background-image: url('" . $boom['background_image'] . "'); background-size:cover;";
}
$theme_text = '';
if(isset($boom['theme_text']) && !empty($boom['theme_text'])){
	$theme_text = " color: " . $boom['theme_text'] . ";";
}
$default_text = '';
if(isset($boom['default_text']) && !empty($boom['default_text'])){
	$theme_text = " color: " . $boom['default_text'] . ";";
}
if(!isset($boom['author']) || empty($boom['author'])){
	$boom['author'] = 'someone';
}
if(!isset($boom['duotone']) || empty($boom['duotone'])){
	$boom['duotone'] = 'rgba(0,0,0,0.1)';
}
?>
<div class="theme_preview fborder" onclick="setUserTheme(this);" data-theme="<?php echo $boom['name']; ?>">
	<div class="btable header_preview" style="background: <?php echo $boom['background_header']; ?>; color: <?php echo $boom['text_header']; ?>">
		<div class="bcell_mid">
			<div class="btable">
				<div class="bcell_mid header_preview_option">
					<i class="fa fa-bars"></i>
				</div>
				<div class="bcell name_preview">
					<?php echo str_replace('_', ' ', $boom['name']); ?>
				</div>
				<div class="bcell_mid header_preview_option">
					<i class="fa fa-envelope"></i>
				</div>
				<div class="bcell_mid header_preview_option">
					<i class="fa fa-bell"></i>
				</div>
			</div>
		</div>
	</div>
	<div class="btable">
		<div class="bcell chat_preview" style="background: <?php echo $boom['background_chat']; ?>; color: <?php echo $boom['text_color']; ?>;">
			<div class="chat_preview_back" style="<?php echo $background; ?>"></div>
			<?php if(logMode(1)){ ?>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_bubble" style="background: <?php echo $boom['background_log']; ?>;">
						Lorem ipsum
					</div>
				</div>
			</div>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_bubble" style="background: <?php echo $boom['background_log']; ?>;">
						Excepteur sint proident, sunt in
					</div>
				</div>
			</div>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_bubble" style="background: <?php echo $boom['background_log']; ?>;">
						exercitation ullamco laboris
					</div>
				</div>
			</div>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_bubble" style="background: <?php echo $boom['background_log']; ?>;">
						Theme by <?php echo $boom['author']; ?>
					</div>
				</div>
			</div>
			<?php } ?>
			<?php if(logMode(2)){ ?>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_tlogs">
						Lorem ipsum
					</div>
				</div>
			</div>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_tlogs">
						Excepteur sint proident, sunt in
					</div>
				</div>
			</div>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_tlogs">
						exercitation ullamco laboris
					</div>
				</div>
			</div>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_tlogs">
						Theme by <?php echo $boom['author']; ?>
					</div>
				</div>
			</div>
			<?php } ?>
				<?php if(logMode(3)){ ?>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_tlogs">
						Lorem ipsum
					</div>
				</div>
			</div>
			<div class="btable log_preview" style="background: <?php echo $boom['duotone']; ?>;">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_tlogs">
						Excepteur sint proident, sunt in
					</div>
				</div>
			</div>
			<div class="btable log_preview">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_tlogs">
						exercitation ullamco laboris
					</div>
				</div>
			</div>
			<div class="btable log_preview" style="background: <?php echo $boom['duotone']; ?>;">
				<div class="bcell avatar_preview">
					<img src="<?php echo myAvatar($data['user_tumb']); ?>"/>
				</div>
				<div class="bcell content_preview">
					<p class="preview_name bold"><?php echo $data['user_name']; ?></p>
					<div class="preview_tlogs">
						Theme by <?php echo $boom['author']; ?>
					</div>
				</div>
			</div>
			<?php } ?>
		</div>
	</div>
	<div class="btable theme_control">
		<button class="pad10 brad5" style="background: <?php echo $boom['theme_color']; ?>;"></button> 
		<button class="pad10 brad5" style="background: <?php echo $boom['default_color']; ?>;"></button>
	</div>
</div>