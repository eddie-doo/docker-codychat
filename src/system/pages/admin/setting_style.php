<?php
require(__DIR__ . '/../../config_admin.php');

if(!boomAllow(100)){
	die();
}
function listAdminProfileStyle(){
	global $mysqli, $data, $lang;
	$list = '';
	$get_style = $mysqli->query("SELECT * FROM boom_style WHERE id > 0 ORDER BY style_name ASC");
	if($get_style->num_rows > 0){
		while($style = $get_style->fetch_assoc()){
			$list .= boomTemplate('element/admin_style', $style);
		}
	}
	return $list;
}
?>
<?php echo elementTitle($lang['pstyle']); ?>
<div class="page_full">
	<div class="page_element">
		<div class="btable_auto brelative">
			<button onclick="openCreateProfileStyle();" class="theme_btn reg_button"><i class="fa fa-palette"></i> <?php echo $lang['create']; ?></button>
			<button onclick="openInstallProfileStyle();" class="default_btn reg_button"><i class="fa fa-plus"></i> <?php echo $lang['add']; ?></button>
		</div>
		<div id="style_search" class="vpad15">
			<div class="search_bar">
				<input id="search_admin_style" placeholder="<?php echo $lang['search']; ?>" class="full_input" type="text"/>
				<div class="clear"></div>
			</div>
		</div>
	</div>
	<div class="page_full">
		<div class="page_element">
			<div id="style_list">
				<?php echo listAdminProfileStyle(); ?>
			</div>
		</div>
	</div>
</div>