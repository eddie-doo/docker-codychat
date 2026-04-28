<?php
require('../config_session.php');
if(!canTheme()){
	die();
}
?>

<?php
$THEMES_DIR = __DIR__. '/../../css/themes/';

function listThemeDirs(string $base): array {
    $dirs = array_filter(glob(rtrim($base, '/\\') . '/*'), 'is_dir');
    sort($dirs, SORT_NATURAL | SORT_FLAG_CASE);
    return $dirs;
}

function loadThemeManifest(string $dir): ?array {
    $required = [
        'name',
        'background_header',
        'text_header',
        'background_chat',
        'background_log',
        'theme_color',
        'default_color'
    ];
    $optional = ['background_image'];
	
    $file = rtrim($dir, '/\\') . '/manifest.json';
    if (!is_file($file) || !is_readable($file)) {
        return null;
    }
    $raw = false;
    if (function_exists('file_get_contents')) {
        $raw = @file_get_contents($file);
    }
    if ($raw === false) {
        $h = @fopen($file, 'r');
        if ($h) {
            $raw = stream_get_contents($h);
            fclose($h);
        }
    }
    if ($raw === false) {
        return null;
    }
    $d = json_decode($raw, true);
    if (!is_array($d)) {
        return null;
    }
    foreach ($required as $k) {
        if (!array_key_exists($k, $d) || $d[$k] === '' || $d[$k] === null) {
            return [];
        }
    }
    foreach ($optional as $k) {
        if (!array_key_exists($k, $d)) {
            $d[$k] = '';
        }
    }
    foreach ($d as $key => $value) {
        if (is_string($value)) {
            $d[$key] = htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8', false);
        } else {
            $d[$key] = $value;
        }
    }
    return $d;
}


$themes = [];
foreach (listThemeDirs($THEMES_DIR) as $dir) {
    $m = loadThemeManifest($dir);
	if(!empty($m)){
		if($m['name'] == $data['user_theme']){
			array_unshift($themes, $m);
		}
		else {
			$themes[] = $m;
		}
	}
}
echo createPag($themes, 6, array('template'=> 'element/theme_preview', 'style'=> 'arrow', 'flex'=> 'theme_wrap'));
?>