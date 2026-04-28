<?php
require('../config_session.php');

if(!canProfileStyle()){
	die();
}

function listProfileStyle(){
	global $mysqli, $data;
	
	$user_style = 0;
	$result = [];
	if(profileStyle($data)){
		$user_style = (int) $data['user_pstyle'];
	}
	$get_style = $mysqli->query("
		SELECT *
		FROM boom_style
		WHERE id > 0
		  AND style_active > 0
		ORDER BY (id = $user_style) DESC, id ASC
	");
	if($get_style && $get_style->num_rows > 0){
		while($style = $get_style->fetch_assoc()){
			$result[] = $style;
		}
	}
	return $result;
}
$list = listProfileStyle();
if(empty($list)){
	die();
}
?>
<div class="tpad25">
	<?php echo createPag($list, 1, array('template'=> 'element/profile_style', 'style'=> 'arrow', 'flex'=> 'pstyle_wrap')); ?>
</div>
<div id="pstyle_remove" class="centered_element <?php if(!profileStyle($data)){ echo 'hidden'; }?>">
	<p onclick="removePstyle();" class="pad10 sub_text"><?php echo $lang['remove_pstyle']; ?></p>
</div>