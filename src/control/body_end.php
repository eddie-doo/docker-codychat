<?php
if(!defined('BOOM')){
	die();
}
include('box.php');
include('control/fonts.php');
if(boomLogged()){
	include('js/function_ranking.php');
}
 ?>
 <script>
var system = <?php echo jsonSystemMessage(); ?>;
var notification = <?php echo jsonNotificationMessage(); ?>;
</script>
</body>
</html>