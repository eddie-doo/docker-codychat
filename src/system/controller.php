<?php
function boomCookieParam($expires = null) {
    if (!$expires) {
        $expires = time() + 31556926;
    }
    $secure = (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') ||
        (!empty($_SERVER['HTTP_CF_VISITOR']) && strpos($_SERVER['HTTP_CF_VISITOR'], '"scheme":"https"') !== false)
    );
    return array(
        'expires'  => $expires,
        'path'     => '/',
        'secure'   => $secure,
        'httponly' => true,
        'samesite' => 'Lax'
    );
}
function setBoomCookie($user, $set = []) {
	$def = array(
		'id' => $user['user_id'],
		'password' => $user['user_password'],
		'session' => $user['session_id'],
	);
	$u = array_merge($def, $set);
	setcookie(BOOM_PREFIX . "userid", "{$u['id']}", boomCookieParam());
	setcookie(BOOM_PREFIX . "utk", "{$u['password']}", boomCookieParam());
	setcookie(BOOM_PREFIX . "ssid", "{$u['session']}", boomCookieParam());
}

function unsetBoomCookie() {
	// Pass the expiry time as a negative value to remove cookies
	setcookie(BOOM_PREFIX . "userid", "", boomCookieParam(time() - 1000));
	setcookie(BOOM_PREFIX . "utk", "", boomCookieParam(time() - 1000));
	setcookie(BOOM_PREFIX . "ssid", "", boomCookieParam(time() - 1000));
}

function setBoomLang($val) {
	setcookie(BOOM_PREFIX . "lang", "$val", boomCookieParam());
}

function setBoomCookieLaw() {
	setcookie(BOOM_PREFIX . "claw", "1", boomCookieParam());
}

function setBoomCoppa() {
	setcookie(BOOM_PREFIX . "cop", "1", boomCookieParam());
}
?>