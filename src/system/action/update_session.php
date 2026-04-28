<?php
require('../config.php');
if(!checkToken()){
	echo boomCode(0);
}
else {
	echo boomCode(1);
}
?>