previewName = function(c){
	var n = $('.user_color').attr('data');
	var f = $('#fontitname').val();
	$('#preview_name').removeClass();
	$('#preview_name').addClass(n+' '+f);
}
var waitGuest = 0;
registerGuest = function() {
	
	var err = 0;
	var gname = $('#new_guest_name').val();
	var gpass = $('#new_guest_password').val();
	var gemail = $('#new_guest_email').val();
	
	if(!validForm('new_guest_name', 'new_guest_password', 'new_guest_email')){
		return false;
	}
	else {
		if(waitGuest == 0){
			waitGuest = 1;
			$.post('system/action/action_member.php', {
				new_guest_name: gname,
				new_guest_password: gpass,
				new_guest_email: gemail,
				}, function(response) {
					if (response.code == 1){
						location.reload();
					}
					else if (response.code == 2){
						$('#new_guest_name').val("");
					}
					else if (response.code == 3){
						$('#new_guest_email').val("");
					}
					else if (response.code == 4){
						$('#new_guest_password').val("");
					}
					waitGuest = 0;
			}, 'json');
		}
	}
}
var waitSecure = 0;
secureAccount = function() {
	
	var err = 0;
	var sname = $('#secure_name').val();
	var spass = $('#secure_password').val();
	var semail = $('#secure_email').val();

	if(!validForm('secure_name', 'secure_password', 'secure_email')){
		return false;
	}
	else {
		if(waitSecure == 0){
			waitSecure = 1;
			$.post('system/action/action_secure.php', {
				secure_name: sname,
				secure_password: spass,
				secure_email: semail,
				}, function(response) {
					if (response.code == 1){
						location.reload();
					}
					else if (response.code == 2){
						$('#secure_name').val("");
					}
					else if (response.code == 3){
						$('#secure_email').val("");
					}
					else if (response.code == 4){
						$('#secure_password').val("");
					}
					waitSecure = 0;
			}, 'json');
		}
		else{
			return false;
		}
	}
}
verifyAccount = function(){
	$('.resend_hide').hide();
	$.post('system/action/action_member.php', {
		send_verify: 1,
		}, function(response){
	}, 'json');
}
boomSound = function(snd){
	if(uSound.match(snd)){
		return true;
	}
}
resetVerify = function(){
	$('#verify_one').show();
	$('#verify_two').hide();
}
toggleVerify = function(){
	$('#verify_one').hide();
	$('#verify_two').show();
}
validCode = function(type){
	var vCode = $('#boom_code').val();
	
	if(!validForm('boom_code')){
		return false;
	}
	else {
		$.post('system/action/action_member.php', {
			valid_code: vCode,
			verify_code:1,
			}, function(response) {	
			if(response.code == 1){
				if(type == 1){
					location.reload();
				}
				if(type == 2){
					$('#not_verify').replaceWith("");
					$('#verify_hide').replaceWith("");
					$('#now_verify').show();
				}
			}
			$('#boom_code').val('');
		}, 'json');
	}
}
var modalList = [];
scanModal = function(v){
	if('modal' in v){
		var m = v.modal;
		if(m.length > 0){
			for (var i = 0; i < m.length; i++){
				modalList.push(m[i]);
			}
		}
	}
}
registerModal = function(v){
	if('content' in v && 'type' in v && 'size' in v){
		modalList.push(v);
	}
}
checkModal = function(){
	if(systemLoaded == 0 || modalList.length === 0 || $('.modal_back:visible').length){
		return false;
	}
	else {
		var m = modalList.shift();
		if(m.type == 'modal'){
			showModal(m.content, m.size);
			callSound(m.sound);
		}
		else if(m.type == 'empty'){
			showEmptyModal(m.content, m.size);
			callSound(m.sound);
		}
	}
}
editProfile = function(){
	$.post('system/box/edit_profile.php', {
		}, function(response) {
			if(response){
				showEmptyModal(response, 520);
			}
	});
}
storeArray = function(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

getArray = function(key) {
	var stored = localStorage.getItem(key);
	if(stored != null) {
		return JSON.parse(stored);
	}
	else {
		return [];
	}
}
setArray = function(key, value){
	var arr = getArray(key);
	arr.push(value);
	storeArray(key, arr);
}

setUserTheme = function(item){
	var theme = $(item).attr('data-theme');
	$.post('system/action/action_profile.php', {
		set_user_theme: theme,
		}, function(response) {
			if(response.code == 1){
				$("#actual_theme").attr("href", "css/themes/" + response.theme + "/" + response.theme + ".css"+bbfv);
				$('#main_logo').attr('src', response.logo);
			}
	}, 'json');
}
saveUserSound = function(){
	boomDelay(function() {
		$.post('system/action/action_profile.php', {
			change_sound: 1,
			chat_sound: $('#set_chat_sound').attr('data'),
			private_sound: $('#set_private_sound').attr('data'),
			notify_sound: $('#set_notification_sound').attr('data'),
			name_sound: $('#set_username_sound').attr('data'),
			call_sound: $('#set_call_sound').attr('data'),
			}, function(response) {
				if(response.code == 1) {
					uSound = response.data;
				}
		}, 'json');
	}, 500);
}
systemLoad = function(){
	$.post('system/action/system_load.php', {
		}, function(response) {
			scanModal(response);
	}, 'json');
}
logOut = function(){
	$.post('system/action/logout.php', { 
		logout_from_system: 1,
		}, function(response) {
			if(response.code == 1){
				location.reload();
			}
	}, 'json');
}
saveMood = function(){
	$.post('system/action/action_profile.php', { 
		save_mood: $('#set_mood').val(),
		}, function(response) {
			if(response.code == 1) {
				hideOver();
			}
	}, 'json');	
}
saveInfo = function(){
	$.post('system/action/action_profile.php', { 
		save_info: 1,
		birth: buildDate(),
		gender: $('#set_profile_gender').val(),
		relation: $('#set_profile_relation').val(),
		}, function(response) {
			if(response.code == 1){
				hideOver();
			}
	}, 'json');	
}
saveRelation = function(){
	$.post('system/action/action_profile.php', { 
		relationship: $('#set_profile_relation').val(), 
		}, function(response) {
			if(response.code == 1){
				hideOver();
			}
	}, 'json');	
}
saveShare = function(){
	boomDelay(function() {
		$.post('system/action/action_profile.php', { 
				save_shared: 1,
				ashare: $('#set_ashare').attr('data'),
				sshare: $('#set_sshare').attr('data'),
				fshare: $('#set_fshare').attr('data'),
				gshare: $('#set_gshare').attr('data'),
				lshare: $('#set_lshare').attr('data'),
			}, function(response) {
		}, 'json');
	}, 500);
}
saveAbout = function(){
	$.post('system/action/action_profile.php', { 
		save_about: '1',
		about: $('#set_user_about').val(),
		}, function(response) {
			if(response.code == 1){
				hideOver();
			}
	}, 'json');	
}
saveEmail = function(){
	$.post('system/action/action_secure.php', { 
		save_email: '1',
		email: $('#set_profile_email').val(),
		password: $('#email_password').val(),
		}, function(response) {
			if(response.code == 3){
				$('#email_password').val('');
			}
			else if(response.code == 1){
				hideOver();
			}
	}, 'json');	
}
changePassword = function(){
	var err = 0;
	var actual = $('#set_actual_pass').val();
	var newPass = $('#set_new_pass').val();
	var newRepeat = $('#set_repeat_pass').val();
	
	if(!validForm('set_actual_pass', 'set_new_pass', 'set_repeat_pass')){
		return false;
	}
	else {
		$.post('system/action/action_secure.php', { 
			actual_pass: actual,
			new_pass: newPass,
			repeat_pass: newRepeat,
			change_password: 1,
			}, function(response) {
				if(response.code == 1){
					hideOver();
				}
		}, 'json');
	}
}
deleteMyAccount = function(){
	$.post('system/action/action_secure.php', { 
		delete_my_account: '1',
		delete_account_password: $('#delete_account_password').val(),
		}, function(response) {
			if(response.code == 1){
				$('#del_account_btn').replaceWith("");
				hideOver();
			}
			else if(response.code == 2){
				$('#delete_account_password').val('');
			}
	}, 'json');	
}
cancelDelete = function(){
	$.post('system/action/action_secure.php', { 
		cancel_delete_account: '1',
		}, function(response) {
			if(response.code == 1){
				$('#delete_warn').replaceWith("");
			}
	}, 'json');	
}
saveLocation = function(){
	$.post('system/action/action_profile.php', {
		user_timezone: $('#set_profile_timezone').val(),
		user_language: $('#set_profile_language').val(),
		user_country: $('#set_profile_country').val(),
		}, function(response) {
			if(response.code == 2){
				location.reload();
			}
	}, 'json');
}
savePreference = function(){
	var saveBubble = $('#set_user_bubble').val();
	$.post('system/action/action_profile.php', {
		save_preference: 1,
		save_ulogin: $('#set_ulogin').val(),
		set_private_mode: $('#set_private_mode').val(),
		set_user_call: $('#set_user_call').val(),
		set_ufriend: $('#set_ufriend').val(),
		set_user_bubble: saveBubble,
		set_pmusic: $('#set_pmusic').val(),
		}, function(response) {
			if(response.code == 1){
				ububble = saveBubble;
			}
	}, 'json');	
}
getProfile = function(profile){
	hideOver();
	$.post('system/box/profile.php', {
		get_profile: profile,
		}, function(response) {
			if(response){
				showEmptyModal(response,520);
			}
	});
}

getBadgeInfo = function(){
	hideOver();
	$.post('system/box/badge_info.php', {
		}, function(response) {
			if(response){
				overModal(response,540);
			}
	});
}
getDisplaySetting = function(){
	$.post('system/box/display.php', {
		}, function(response) {
			if(response){
				overModal(response, 500);
			}
	});
}
getActions = function(id){
	$.post('system/box/action_main.php', {
		id: id,
		}, function(response) {
			if(response){
				overModal(response,400);
			}
	});
}
getPassword = function(){
	$.post('system/box/edit_password.php', {
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
getOtherLogout = function(){
	$.post('system/box/other_logout.php', {
		}, function(response) {
			if(response){
				overModal(response, 460);
			}
	});
}
otherLogout = function(){
	$.post('system/action/logout.php', {
		other_logout: 1,
		}, function(response) {
	}, 'json');
}
getFriends = function(){
	$.post('system/box/manage_friends.php', {
		}, function(response) {
			if(response){
				overModal(response, 460);
			}
	});
}
getGift = function(){
	$.post('system/box/my_gift.php', {
		}, function(response) {
			if(response){
				overModal(response,440);
			}
	});
}

$(document).on('click', '.view_gift', function(){
	$('#view_gift_title').text($(this).attr('data-title'));
	$('#view_gift_img').attr('src', $(this).attr('data-img'));
	$('#view_gift_id').attr('data', $(this).attr('data-gift'));
	topModal($('#view_gift_template').html(), 300);
});

$(document).on('click', '#gift_delete', function(){
	var gift = $('#view_gift_id').attr('data');
	$.post('system/box/gift_delete.php', {
			gift: gift,
		}, function(response) {
			if(response){
				topModal(response, 300);
			}
	});
});

$(document).on('click', '#delete_mgift', function(){
	var gift = $(this).attr('data');
	$.post('system/action/action_gift.php', {
			delete_mgift: gift,
		}, function(response) {
			if(response.code == 1){
				hideTop();
				$('#mgift'+gift).replaceWith("");
			}
	}, 'json');
});

$(document).on('click', '.view_friend', function(){
	$('#view_friend_name').text($(this).attr('data-name'));
	$('#view_friend_avatar').attr('src', $(this).attr('data-avatar'));
	$('#view_friend_id').attr('data', $(this).attr('data-id'));
	overModal($('#view_friend_template').html(), 400);
});

getUserGift = function(id){
	var cgift = $('#progift').attr('value');
	if(cgift == 0){
		$.post('system/box/gift_view.php', {
				target: id,
			}, function(response) {
				if(response){
					$('#progift').html(response).attr('value', 1);
				}
		});
	}
}
getUserFriend = function(id){
	var cfriend = $('#profriend').attr('value');
	if(cfriend == 0){
		$.post('system/box/friend_view.php', {
				target: id,
			}, function(response) {
				if(response){
					$('#profriend').html(response).attr('value', 1);
				}
		});
	}
}
getIgnore = function(){
	$.post('system/box/manage_ignore.php', {
		}, function(response) {
			if(response){
				overModal(response, 460);
			}
	});
}
getLocation = function(){
	$.post('system/box/location.php', {
		}, function(response) {
			if(response){
				overModal(response, 460);
			}
	});
}
getPreference = function(){
	$.post('system/box/preference.php', {
		}, function(response) {
			if(response){
				overModal(response, 460);
			}
	});
}
getEmail = function(){
	$.post('system/box/edit_email.php', {
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
getDeleteAccount = function(){
	$.post('system/box/user_delete.php', {
		}, function(response) {
			if(response){
				overModal(response, 500);
			}
	});
}
acceptFriend = function(t, friend){
	$.post("system/action/action_friend.php", { 
		add_friend: friend,
		}, function(response) {
			$(t).parent().replaceWith("");
			if($('.friend_request').length < 1 && $('#friends_menu:visible').length){
				hideMenu('friends_menu');
			}
	}, 'json');
}
declineFriend = function(t, id){
	$.post("system/action/action_friend.php", {
		remove_friend: id,
		}, function(response) {
			$(t).parent().replaceWith("");
			if($('.friend_request').length < 1){
				hideMenu('friends_menu');
			}
	}, 'json');
}
removeFriend = function(t, id){
	$.post('system/action/action_friend.php', { 
		remove_friend: id,
		}, function(response) {
			$(t).parent().replaceWith("");
			if($('.friend_request').length < 1 && $('#friends_menu:visible').length){
				hideMenu('friends_menu');
			}
	}, 'json');
}
deleteIgnore = function(t, id){
	$.post('system/action/action_member.php', { 
		remove_ignore: id,
		}, function(response) {
			$(t).parent().replaceWith("");
			removeIgnore(id);
	}, 'json');
}
addFriend = function(id){
	$.post("system/action/action_friend.php", {
		add_friend: id,
		}, function(response) {
			hideOver();
	}, 'json');
}
unFriend = function(id){
	$.post('system/action/action_friend.php', { 
		remove_friend: id,
		}, function(response) {
			hideOver();
	}, 'json');
}
ignoreUser = function(id){
	$.post('system/action/action_member.php', { 
		add_ignore: id,
		}, function(response) {
			if(response.code == 1){
				addIgnore(id);
			}
			hideOver();
	}, 'json');
}
unIgnore = function(id){
	$.post('system/action/action_member.php', { 
		remove_ignore: id,
		}, function(response) {
			removeIgnore(id);
			hideOver();
	}, 'json');
}
ignoreThisUser = function(){
	ignoreUser(currentPrivate);
}
changeUsername = function(){
	$.post('system/box/edit_name.php', { 
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
changeInfo = function(){
	$.post('system/box/edit_info.php', { 
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
changeRelation = function(){
	$.post('system/box/edit_relation.php', { 
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
changeShared = function(){
	$.post('system/box/edit_shared.php', { 
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
changeAbout = function(){
	$.post('system/box/edit_about.php', { 
		}, function(response) {
			if(response){
				overModal(response, 500);
			}
	});
}
getTextOptions = function(){
	$.post('system/box/chat_text.php', {
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
getProfileStyle = function(){
	$.post('system/box/profile_style.php', {
		}, function(response) {
			if(response){
				overModal(response, 500);
			}
	});
}
getSoundSetting = function(){
	$.post('system/box/sound.php', {
		}, function(response) {
			if(response){
				overModal(response, 380);
			}
	});
}
changeColor = function(){
	$.post('system/box/edit_color.php', { 
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
openSecure = function(){
	$.post('system/box/secure_account.php', { 
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
openGuestRegister = function(){
	$.post('system/box/guest_register.php', { 
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
changeMood = function(){
	$.post('system/box/edit_mood.php', { 
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
changeMyUsername = function(){
	var myNewName = $('#my_new_username').val();
	
	if(!validForm('my_new_username')){
		return false;
	}
	else {
		$.post('system/action/action_profile.php', { 
			edit_username: 1,
			new_name: myNewName,
			}, function(response) {
				if(response.code == 1){
					$('.globname').text(myNewName);
					hideOver();
				}
				else if(response.code == 2){
					$('#my_new_username').val('');
				}
				else if(response.code == 3){
					$('#my_new_username').val();
				}
				else {
					hideOver();
				}
		}, 'json');
	}
}
saveNameColor = function(){
	$.post('system/action/action_profile.php', {
		my_username_color: $('.user_color').attr('data'),
		my_username_font: $('#fontitname').val(),
		}, function(response) {
	}, 'json');
}
saveUserColor = function(u){
	$.post('system/action/action_users.php', {
		user_color: $('.user_color').attr('data'),
		user_font: $('#fontitname').val(),
		user: u,
		}, function(response) {
	}, 'json');	
}
openAddRoom = function(){
	$.post('system/box/create_room.php', {
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
openShareWallet = function(id){
	$.post('system/box/wallet_share.php', {
			target: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
openSendGift = function(id){
	$.post('system/box/gift.php', {
			target: id,
		}, function(response) {
			if(response){
				overModal(response, 460);
			}
	});
}
viewLevelStatus = function(id){
	$.post('system/box/level_status.php', {
			target: id,
		}, function(response) {
			if(response){
				overModal(response, 480);
			}
	});
}
var waitShare = 0;
shareGold = function(id){
	if(waitShare == 0){
		waitShare = 1;
		$.post('system/action/action_member.php', {
				share_gold: id,
				shared_gold: $('#gold_shared').val(),
			}, function(response) {
				if(response.code == 1){
					hideOver();
				}
				waitShare = 0;
		}, 'json');
	}
}
shareRuby = function(id){
	if(waitShare == 0){
		waitShare = 1;
		$.post('system/action/action_member.php', {
				share_ruby: id,
				shared_ruby: $('#ruby_shared').val(),
			}, function(response) {
				if(response.code == 1){
					hideOver();
				}
				waitShare = 0;
		}, 'json');
	}
}
roomBlockBox = function(id){
	$.post('system/box/room_block.php', {
		room_block: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
roomMuteBox = function(id){
	$.post('system/box/room_mute.php', {
		room_mute: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
roomMuteUser = function(target){
	$.post('system/action/action.php', {
		room_mute: target,
		delay: $('#room_mute_delay').val(),
		reason: $('#room_mute_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}
roomBlockUser = function(target){
	$.post('system/action/action.php', {
		room_block: target,
		delay: $('#room_block_delay').val(),
		reason: $('#room_block_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}

listAction = function(target, act){
	closeTrigger();
	if(act == 'ban'){
		banBox(target);
	}
	else if(act == 'kick'){
		kickBox(target);
	}
	else if(act == 'mute'){
		muteBox(target);
	}
	else if(act == 'main_mute'){
		mainMuteBox(target);
	}
	else if(act == 'private_mute'){
		privateMuteBox(target);
	}
	else if(act == 'ghost'){
		ghostBox(target);
	}
	else if(act == 'warn'){
		warnBox(target);
	}
	else if(act == 'room_mute'){
		roomMuteBox(target);
	}
	else if(act == 'room_block'){
		roomBlockBox(target);
	}
	else if(act == 'change_rank'){
		adminGetRank(target);
	}
	else if(act == 'room_rank'){
		openRoomRank(target);
	}
	else if(act == 'delete_account'){
		eraseAccount(target);
	}
	else {
		$.post('system/action/action.php', {
			take_action: act,
			target: target,
			}, function(response) {
				if(response.code == 1){
					processAction(act);
					if(act == 'unghost'){
						$('.ghst'+target).replaceWith("");
					}
				}
				hideOver();
		}, 'json');
	}
}
processAction = function(act){
	if(act == 'unmute'){
		$('.im_muted').replaceWith("");
	}
	else if(act == 'unban'){
		$('.im_banned').replaceWith("");
	}
}
removeRoomAction = function(elem, action, target){
	$.post('system/action/action.php', {
		take_action: action,
		target: target,
		}, function(response) {
			if(response.code == 1){
				$(elem).parent().replaceWith("");
			}
	}, 'json');
}
appLeftMenu = function(aIcon, aText, aCall, optMenu) {
	renderLeftMenu(aIcon, aText, aCall, optMenu);
}
appSettingMenu = function(aIcon, aText, aCall){
	renderRightMenu(aIcon, aText, aCall, 'setting_menu_content');
}
appLeadMenu = function(aIcon, aText, aCall){
	renderSideMenu(aIcon, aText, aCall, 'leaderboard_menu_content', 'fmenu_img');
}
appGameMenu = function(aIcon, aText, aCall){
	renderSideMenu(aIcon, aText, aCall, 'game_menu_content', 'fmenu_gimg');
}
appAppMenu = function(aIcon, aText, aCall){
	renderSideMenu(aIcon, aText, aCall, 'app_menu_content', 'fmenu_aimg');
}
appStoreMenu = function(aIcon, aText, aCall){
	renderSideMenu(aIcon, aText, aCall, 'store_menu_content', 'fmenu_simg');
}
appToolMenu = function(aIcon, aText, aCall){
	renderSideMenu(aIcon, aText, aCall, 'tool_menu_content', 'fmenu_timg');
}
appHelpMenu = function(aIcon, aText, aCall){
	renderSideMenu(aIcon, aText, aCall, 'help_menu_content', 'fmenu_himg');
}
appPanelMenu = function(icon, text, pCall){
	var panMenu = '<div title="'+text+'" class="panel_option" onclick="'+pCall+'"><i class="fa fa-'+icon+'"></i></div>';
	$('#right_panel_bar').append(panMenu);
}
appInputMenu = function(mIcon, mCall){
	var inpMenu = '<div class="sub_options" onclick="'+mCall+'"><img src="'+mIcon+'"/></div>';
	$('#main_input_extra').append(inpMenu);
}
appPrivInputMenu = function(mIcon, mCall){
	var privInpMenu = '<div class="psub_options" onclick="'+mCall+'"><img src="'+mIcon+'"/></div>';
	$('#priv_input_extra').append(privInpMenu);
}
noDataTemplate = function(){
	return '<div class="pad_box"><p class="centered_element text_med sub_text">'+system.no_result+'</p></div>';
}
cleanData = function(){
	if(isStaff(user_rank)){
		$.post('system/action/system_clean.php', {
			clean_data: 1,
			}, function(response) {
		}, 'json');
	}
}
isStaff = function(urank){
	if(urank >= 70){
		return true;
	}
}
betterRank = function(urank){
	if(user_rank > urank){
		return true;
	}
}

removeRoomStaff = function(elem, target){
	$.post('system/action/action.php', {
		remove_room_staff: 1,
		target: target,
		}, function(response) {
			if(response.code == 1){
				$(elem).parent().replaceWith("");
			}
	}, 'json');
}
joinRoomPassword = function(rt, rank){
	$.post('system/action/action_room.php', {
		pass: $('#pass_input').val(),
		room: rt,
		join_room_pass: 1,
		}, function(response) {
			if(response.code == 10){
				if(insideChat()){
					resetRoom(response.data);
					hideOver();
				}
				else {
					location.reload();
				}
			}
			else if(response.code == 5){
				$('#pass_input').val('');
			}
	}, 'json');
}

var waitJoin = 0;
switchRoom = function(room, pass, rank){
	if(insideChat() && room == user_room){
		return;
	}
	if(waitJoin == 0){
		waitJoin = 1;
		if(pass == 1){
			$.post('system/box/pass_room.php', {
				room_rank: rank,
				room_id: room,
				}, function(response) {
					overModal(response);
					waitJoin = 0;
			});
		}
		else {
			$.post('system/action/action_room.php', {
				room: room,
				join_room: 1,
				}, function(response) {
					if(response.code == 10){
						if(insideChat()){
							resetRoom(response.data);
						}
						else {
							location.reload();
						}
					}
					waitJoin = 0;
			}, 'json');	
		}
	}
}
var waitRoom = 0;
addRoom = function(){
	if(waitRoom == 0){
		waitRoom = 1;
		$.post('system/action/action_room.php', {
			set_name: $("#set_room_name").val(),
			set_type: $("#set_room_type").val(),
			set_pass: $("#set_room_password").val(),
			set_description: $("#set_room_description").val(),
			set_ricon: $('#set_room_icon').attr('data'),
			}, function(response) {
				if(response.code == 7){
					if(insideChat()){
						resetRoom(response.data);
					}
					else {
						location.reload();
					}
				}
				waitRoom = 0;
		}, 'json');	
	}
}

// files functions 
var mupload;
var pupload;

uploadChatFile = function(){
	if($('#chat_file').val() === ''){
		return;
	}
	else {
		uploadChat($("#chat_file").prop("files")[0]);
	}
}

var waitUpload = 0;
uploadChat = function(f){
	var filez = (f.size / 1024 / 1024).toFixed(2);
	if( filez > fileMax ){
		callError(system.file_big);
	}
	else {
		if(waitUpload == 0){
			uploadStatus('chat_file', 2);
			waitUpload = 1;
			var form_data = new FormData();
			form_data.append("file", f)
			form_data.append("token", utk)
			mupload = $.ajax({
				url: "system/action/file_chat.php",
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				type: 'post',
				beforeSend: function(){
					startMainUp();
				},
				xhr: function() {
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function(evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							upMainStatus((Math.round(percentComplete * 100)));
						}
					}, false);
					return xhr;
				},
				success: function(response){
					if(response.code == 5){
						appendSelfChatMessage(response.logs);
					}
					resetMainUp();
				},
				error: function(){
					resetMainUp();
				}
			})
		}
	}
}

// profile style

function savePstyle(v){
	$.post('system/action/action_profile.php', {
		save_pstyle: v,
	}, function(response){
		if(response.code == 1){
			$('#pstyle_remove').removeClass('hidden');
		}
	}, 'json');
}

function removePstyle(){
	$.post('system/action/action_profile.php', {
		remove_pstyle: 1,
	}, function(response){
		if(response.code == 1){
			$('#pstyle_remove').addClass('hidden');
		}
	}, 'json');
}

// up functions controller

startMainUp = function(){
	upMainStatus(0);
	$('#main_progress').show();
}
upMainStatus = function(v){
	$('#mprogress').css('width', v+'%');
}
cancelMainUp = function(){
	mupload.abort();
}
resetMainUp = function(){
	$('#main_progress').hide();
	$("#chat_file").val("");
	uploadStatus('chat_file', 1);
	waitUpload = 0;
}

startPrivateUp = function(){
	upPrivateStatus(0);
	$('#private_progress').show();
}
upPrivateStatus = function(v){
	$('#pprogress').css('width', v+'%');
}
cancelPrivateUp = function(){
	pupload.abort();
}
resetPrivateUp = function(){
	$("#private_file").val("");
	$('#private_progress').hide();
	uploadStatus('private_file', 1);
	waitUpload = 0;
}

uploadPrivateFile = function(){
	if($('#private_file').val() === ''){
		return;
	}
	else {
		uploadPrivate($("#private_file").prop("files")[0]);
	}
}

uploadPrivate = function(f){
	var filez = (f.size / 1024 / 1024).toFixed(2);
	if( filez > fileMax ){
		callError(system.file_big);
	}
	else {
		if(waitUpload == 0){
			uploadStatus('private_file', 2);
			waitUpload = 1;
			var form_data = new FormData();
			form_data.append("file", f)
			form_data.append("target", currentPrivate)
			form_data.append("zone", 'private')
			form_data.append("token", utk)
			pupload = $.ajax({
				url: "system/action/file_private.php",
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				type: 'post',
				beforeSend: function(){
					startPrivateUp();
				},
				xhr: function() {
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function(evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							upPrivateStatus((Math.round(percentComplete * 100)));
						}
					}, false);
					return xhr;
				},
				success: function(response){
					if(response.code == 5){
						appendSelfPrivateMessage(response.logs);
					}	
					else if(response.code == 99){
						appendCannotPrivate();
					}
					resetPrivateUp();
				},
				error: function(){
					resetPrivateUp();
				}
			})
		}
	}
}

var waitCover = 0;
uploadCover = function(){
	
	var file_data = $("#cover_file").prop("files")[0];
	if(!validUpload('cover_file', coverMax)){
		return false;
	}
	else {
		if(waitCover == 0){
			waitCover = 1;
			uploadIcon('cover_icon', 1);
			var form_data = new FormData();
			form_data.append("file", file_data)
			form_data.append("self", 1)
			form_data.append("token", utk)
			$.ajax({
				url: "system/action/cover.php",
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				type: 'post',
				success: function(response){
					if(response.code == 5){
						addCover(response.data);
					}
					uploadIcon('cover_icon', 2);
					waitCover = 0;
				},
				error: function(){
					uploadIcon('cover_icon', 2);
					waitCover = 0;
				}
			})
		}
	}
}
var waitRoomIcon = 0;
addRoomIcon = function(id){
	
	var file_data = $("#ricon_image").prop("files")[0];

	if(!validUpload('ricon_image', riconMax)){
		return false;
	}
	else {
		if(waitRoomIcon == 0){
			waitRoomIcon = 1;
			uploadIcon('ricon_icon', 1);
			var form_data = new FormData();
			form_data.append("file", file_data)
			form_data.append("add_icon", 1)
			form_data.append("token", utk)
			$.ajax({
				url: "system/action/room_icon.php",
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				type: 'post',
				success: function(response){
					if(response.code == 5){
						$('.ricon_current').attr('src', response.data);
						$('#ricon'+id).attr('src', response.data);
					}
					uploadIcon('ricon_icon', 2);
					waitRoomIcon = 0;
				},
				error: function(){
					uploadIcon('ricon_icon', 2);
					waitRoomIcon = 0;
				}
			})
		}
	}
}
var wallUpload = 0;
uploadWall = function(){
	var file_data = $("#wall_file").prop("files")[0];

	if(!validUpload('wall_file', fileMax)){
		return false;
	}
	else {
		if(wallUpload == 0){
			wallUpload = 1;
			postIcon(1);
			var form_data = new FormData();
			form_data.append("file", file_data)
			form_data.append("token", utk)
			form_data.append("zone", 'wall')
			$.ajax({
				url: "system/action/file_wall.php",
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				type: 'post',
				success: function(response){
					if(response.code == 0){
						$('#post_file_data').attr('data-key', response.key);
						$('#post_file_data').html(response.file);
					}
					else {
						postIcon(2);
					}
					wallUpload = 0;
				},
				error: function(){
					wallUpload = 0;
				}
			})
		}
	}
}

proMusic = function(s){
	if(s == 1){
		$('#up_pmusic, #del_pmusic').addClass('fhide');
		$('#add_pmusic').removeClass('fhide');
	}
	if(s == 2){
		$('#add_pmusic, #del_pmusic').addClass('fhide');
		$('#up_pmusic').removeClass('fhide');
	}
	if(s == 3){
		$('#add_pmusic, #up_pmusic').addClass('fhide');
		$('#del_pmusic').removeClass('fhide');
	}
}

var waitMusic = 0;
uploadMusic = function(f){
	var file_data = $("#pmusic_file").prop("files")[0];
	var filez = ($("#pmusic_file")[0].files[0].size / 1024 / 1024).toFixed(2);
	if( filez > fileMax ){
		callError(system.file_big);
	}
	else {
		if(waitMusic == 0){
			waitMusic = 1;
			var form_data = new FormData();
			form_data.append("file", file_data)
			form_data.append("upload_music", 1)
			form_data.append("token", utk)
			mupload = $.ajax({
				url: "system/action/file_music.php",
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				type: 'post',
				beforeSend: function(){
					proMusic(2);
				},
				success: function(response){
					if(response.code == 1){
						proMusic(3);
					}
					else {
						proMusic(1);
					}
					waitMusic = 0;
				},
				error: function(){
					proMusic(1);
					waitMusic = 0;
				}
			})
		}
	}
}

removeProfileMusic = function(){
	$.post('system/action/file_music.php', {
		remove_pmusic: 1,
		}, function(response) {
			proMusic(1);
	}, 'json');
}

// misc function for files

addCover = function(cover){
	$('.profile_background').css('background-image', 'url('+cover+')');
	$('.profile_background').addClass('cover_size');
}
delCover = function(cover){
	$('.profile_background').css('background-image', '');
	$('.profile_background').removeClass('cover_size');
}
uploadIcon = function(target, type){
	var upIcon = $('#'+target).attr('data');
	if(type == 2){
		$('#'+target).removeClass('fa-circle-notch fa-spin fa-fw').addClass(upIcon);
	}
	else {
		$('#'+target).removeClass(upIcon).addClass('fa-circle-notch fa-spin fa-fw');
	}
}
uploadStatus = function(target, type){
	if(type == 2){
		$("#"+target).prop('disabled', true);
	}
	else {
		$("#"+target).prop('disabled', false);
	}
}
postIcon = function(type){
	if(type == 2){
		$('#post_file_data').html('').hide();
	}
	else {
		$('#post_file_data').html(regSpinner).show();
	}
	$('#post_file_data').attr('data-key', '');
}
removeFile = function(target){
	postIcon(2);
	$.post('system/action/action_files.php', {
		remove_uploaded_file: target,
		}, function(response) {
	});
}

avatarUpload = function(t = 0) {
    const data = t > 0 ? { target: t } : { self: 1 };
    $.post('system/box/avatar.php', data, function(response) {
		if(response){
			overModal(response, 400);
		}
    });
};

// files removal options

deleteAvatar = function(){
	$.post('system/action/avatar.php', { 
		delete_avatar: 1,
		}, function(response) {
			$('.avatar_profile').attr('src', response.data);
			$('.avatar_profile').attr('href', response.data);
			$('.glob_av').attr('src', response.data);
	}, 'json');
}
deleteCover = function(){
	$.post('system/action/cover.php', { 
		delete_cover: 1,
		}, function(response) {
			delCover();
	});
}
removeRoomIcon = function(id){
	$.post('system/action/room_icon.php', { 
		remove_icon: id,
		}, function(response) {
			if(response.code == 1) {
				$('.ricon_current').attr('src', response.data);
				$('#ricon'+id).attr('src', response.data);
			}
	}, 'json');
}
infoPop = function(i){
	$.post('system/action/help.php', { 
			info:i,
		}, function(response) {
			if(response){
				topModal(response, 500);
			}
	});
}

/* gift functions */

$(document).on('click', '.select_gift', function(){
	var gimg = $(this).attr('data-img');
	var gprice = $(this).attr('data-price');
	var gid = $(this).attr('data-id');
	var gtitle = $(this).attr('data-title');
	var gmethod = $(this).attr('data-method');
	
	if(gmethod == 1){
		$('#gift_sruby').hide();
		$('#gift_sgold').show();
	}
	if(gmethod == 2){
		$('#gift_sgold').hide();
		$('#gift_sruby').show();
	}
	
	$('#gift_second').attr('data-id', gid);
	$('#gift_selected').attr('src', gimg);
	$('#gift_pricing').text(gprice);
	$('#gift_title').text(gtitle);
	$('#gift_first').hide();
	$('#gift_second').show();
});
$(document).on('click', '.open_gift', function(){
	$.post('system/box/open_gift.php', {
		open_gift: $(this).attr('data'),
		}, function(response) {
			if(response){
				overModal(response, 300);
			}
	});
});

var waitSendGift = 0;
sendGift = function(){
	if(waitSendGift == 0){
		waitSendGift = 1;
		$.post('system/action/action_gift.php', {
			send_gift: $('#gift_second').attr('data-id'),
			target: $('#gift_second').attr('data-user'),
			}, function(response) {
				hideOver();
				waitSendGift = 0;
		}, 'json');
	}
}
backGift = function(){
	$('#gift_second').hide();
	$('#gift_first').show();
}

/* document ready functions */

$(document).ready(function(){
	
	systemLoad();
	setTimeout(cleanData, 5000)
	runClean = setInterval(cleanData, 300000);

	$(document).on('click', '.get_info', function(){
		var profile = $(this).attr('data');
		closeTrigger();
		getProfile(profile);
	});
	$(document).on('click', '.get_finfo', function(){
		var profile = $(this).attr('data');
		closeTrigger();
		hideOver();
		getProfile(profile);
	});
	$(document).on('click', '.open_profile', function(){
		editProfile();
	});
	$(document).on('click', '.badge_info', function(){
		getBadgeInfo();
	});
	$(document).on('click', '.get_actions', function(){
		var id = $(this).attr('data');
		closeTrigger();
		getActions(id);
	});
	$(document).on('click', '.open_same_page', function(){
		var l = $(this).attr('data');
		openSamePage(l);
	});
	$(document).on('click', '.open_link_page', function(){
		var l = $(this).attr('data');
		openLinkPage(l);
	});
	$(document).on('click', '.get_room_actions', function(){
		var id = $(this).attr('data');
		closeTrigger();
		getRoomActions(id);
	});

	$(document).on('click', '.name_choice, .choice', function() {	
		var curColor = $(this).attr('data');
		if($('.user_color').attr('data') == curColor){
			$('.bccheck').replaceWith("");
			$('.user_color').attr('data', 'user');
		}
		else {
			$('.bccheck').replaceWith("");
			$(this).append('<i class="fa fa-check bccheck"></i>');
			$('.user_color').attr('data', curColor);
		}
		previewName();
	});
	
	$(document).on('change', '#fontitname', function(){		
		previewName();
	});
	
	$(document).on('click', '.infopop', function(){		
		infoPop($(this).attr('data'));
	});
	
	$(document).on('keydown', function(event) {
		if( event.which === 8 && event.ctrlKey && event.altKey ) {
			getConsole();
		}
	});
	
	$(document).on('change, paste, keyup', '#search_chat_room', function(){
		var sr = $(this).val().toLowerCase();
		if(sr == ''){
			$(".room_element").each(function(){
				$(this).show();
			});	
		}
		else {
			$(".room_element").each(function(){
				var rt = $(this).find('.roomtitle').text().toLowerCase();
				var rd = $(this).find('.roomdesc').text().toLowerCase();
				if(rt.indexOf(sr) < 0 && rd.indexOf(sr) < 0){
					$(this).hide();
				}
				else {
					$(this).show();
				}
			});
		}
	});
	
	$(document).on("mouseenter", '.srnk', function(){
		var rtitle = $(this).attr('data-r');
		$(this).attr('title', systemRankTitle(parseInt(rtitle)));
	});
	$(document).on("mouseenter", '.rrnk', function(){
		var rtitle = $(this).attr('data-r');
		$(this).attr('title', roomRankTitle(parseInt(rtitle)));
	});
	$(document).on("mouseenter", '.sttle', function(){
		var stitle = $(this).attr('data-s');
		$(this).attr('title', statusTitle(parseInt(stitle)));
	});
});