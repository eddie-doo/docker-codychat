<?php
function colorChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 32; $n++) {
		$val = 'bcolor' . $n;
		$back = 'bcback' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch name_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}
function gradChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 40; $n++) {
		$val = 'bgrad' . $n;
		$back = 'backgrad' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch name_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}
function neonChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 32; $n++) {
		$val = 'bneon' . $n;
		$back = 'bnback' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch name_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}

// BUBBLES 

function bubbleColorChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 32; $n++) {
		$val = 'bubcolor' . $n;
		$back = 'bubcolor' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch user_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}
function bubbleGradChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 40; $n++) {
		$val = 'bubgrad' . $n;
		$back = 'bubgrad' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch user_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}
function bubbleNeonChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 40; $n++) {
		$val = 'bubneon' . $n;
		$back = 'bubneon' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch user_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}

// TEXT 

function textColorChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 32; $n++) {
		$val = 'bcolor' . $n;
		$back = 'bcback' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch user_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}
function textGradChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 40; $n++) {
		$val = 'bgrad' . $n;
		$back = 'backgrad' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch user_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}
function textNeonChoice($sel){
	$show_c = '';
	for ($n = 1; $n <= 32; $n++) {
		$val = 'bneon' . $n;
		$back = 'bnback' . $n;
		$add_sel = '';
		if($val == $sel){
			$add_sel = '<i class="fa fa-check bccheck"></i>';
		}
		$show_c .= '<div data="' . $val . '" class="color_switch user_choice ' . $back . '">' . $add_sel . '</div>';
	}
	return $show_c;
}
?>