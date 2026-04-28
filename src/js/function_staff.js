editUser = function(id){
	$.post('system/box/admin_user.php', {
		edit_user: id,
		}, function(response) {
			if(response){
				showEmptyModal(response, 520);
			}
	});	
}

adminSaveEmail = function(id){
	$.post('system/action/action_users.php', { 
		set_user_id: id,
		set_user_email: $('#set_user_email').val(),
		}, function(response) {
			if(response.code == 1){
				hideOver();
			}
	}, 'json');		
}
adminSaveAbout = function(id){
	$.post('system/action/action_users.php', { 
		target_about: id,
		set_user_about: $('#admin_user_about').val(),
		}, function(response) {
			if(response.code == 1){
				hideOver();
			}
	}, 'json');		
}
adminSaveNote = function(id){
	$.post('system/action/action_staff.php', { 
		target: id,
		user_note: $('#set_user_note').val(),
		}, function(response) {
	}, 'json');		
}
adminChangeName = function(u){
	$.post('system/box/admin_edit_name.php', { 
		target: u,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
adminChangeMood = function(u){
	$.post('system/box/admin_edit_mood.php', { 
		target: u,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
adminSaveName = function(u){
	var myNewName = $('#new_user_username').val();
	$.post('system/action/action_users.php', { 
		target_id: u,
		user_new_name: myNewName,
		}, function(response) {
			if(response.code == 1){
				$('#pro_admin_name').text(myNewName);
				hideOver();
			}
			else if(response.code == 2){
				$('#new_user_username').val('');
			}
			else if(response.code == 3){
				$('#new_user_username').val();
			}
	}, 'json');
}
adminSaveMood = function(u){
	$.post('system/action/action_users.php', { 
		target_id: u,
		user_new_mood: $('#new_user_mood').val(),
		}, function(response) {
			if(response.code == 1){
				hideOver();
			}
	}, 'json');
}
adminSavePassword = function(u){
	$.post('system/action/action_users.php', { 
		target_id: u,
		user_new_password: $('#new_user_password').val(),
		}, function(response) {
			if(response.code == 1){
				hideOver();
			}
	}, 'json');
}
adminSaveBlock = function(){
	boomDelay(function() {
		$.post('system/action/action_users.php', { 
			target: $('#set_ublock').attr('value'),
			set_bupload: $('#set_bupload').attr('data'),
			set_bnews: $('#set_bnews').attr('data'),
			set_bcall: $('#set_bcall').attr('data'),
			}, function(response) {
		}, 'json');
	}, 500);
}
adminGetEmail = function(u){
	$.post('system/box/admin_edit_email.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
adminGetRank = function(u){
	$.post('system/box/admin_edit_rank.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
adminUserColor = function(u){
	$.post('system/box/admin_edit_color.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
adminUserAbout = function(u){
	$.post('system/box/admin_edit_about.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response, 500);
			}
	});
}
adminUserPassword = function(u){
	$.post('system/box/admin_edit_password.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response, 500);
			}
	});
}
adminUserWhitelist = function(u){
	$.post('system/box/admin_edit_whitelist.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response, 400);
			}
	});
}
adminUserBlock = function(u){
	$.post('system/box/admin_edit_block.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response, 400);
			}
	});
}
adminUserVerify = function(u){
	$.post('system/box/admin_edit_verify.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
adminUserAuth = function(u){
	$.post('system/box/admin_edit_auth.php', {
		target: u,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
changeRank = function(t, target){
	$.post('system/action/action_users.php', {
		change_rank: $(t).val(),
		target: target,
		}, function(response) {
			if(response.code == 1){
				if($('#mprofilemenu:visible').length){
					getProfile(target);
				}
			}
			hideOver();
	}, 'json');
}
changeUserVerify = function(target){
	$.post('system/action/action_users.php', {
		verify_member: target,
		}, function(response) {
			hideOver();
	}, 'json');
}
authUser = function(target){
	$.post('system/action/action_users.php', {
		auth_member: target,
		}, function(response) {
			hideOver();
	}, 'json');
}
changeUserVpn = function(t, target){
	$.post('system/action/action_users.php', {
		set_user_vpn: $(t).val(),
		target: target,
		}, function(response) {
			hideOver();
	}, 'json');
}
banBox = function(id){
	$.post('system/box/ban.php', {
		ban: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
kickBox = function(id){
	$.post('system/box/kick.php', {
		kick: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
muteBox = function(id){
	$.post('system/box/mute.php', {
		mute: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
warnBox = function(id){
	$.post('system/box/warn.php', {
		warn: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
ghostBox = function(id){
	$.post('system/box/ghost.php', {
		ghost: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
mainMuteBox = function(id){
	$.post('system/box/mute_main.php', {
		mute: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
privateMuteBox = function(id){
	$.post('system/box/mute_private.php', {
		mute: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
getHistory = function(id){
	$.post('system/box/admin_history.php', {
		target:id,
		}, function(response) {
			if(response){
				overModal(response, 460);
			}
	});
}
getWallet = function(id){
	$.post('system/box/admin_wallet.php', {
		target:id,
		}, function(response) {
			if(response){
				overModal(response, 340);
			}
	});
}
eraseAccount = function(target){
	$.post('system/box/delete_account.php', {
		account: target,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
getConsole = function(){
	$.post('system/box/console.php', {
		}, function(response) {
			if(response){
				showModal(response, 500);
			}
	});
}
getWhois = function(id){
	$.post('system/box/admin_lookup.php', {
		target:id,
		}, function(response) {
			if(response){
				overModal(response, 420);
			}
	});
}
getNote = function(id){
	$.post('system/box/admin_note.php', {
		target:id,
		}, function(response) {
			if(response){
				overModal(response, 420);
			}
	});
}
removeHistory = function(target, id){
	$.post('system/action/action_staff.php', {
		remove_history: id,
		target: target,
		}, function(response) {
			if(response == 1){
				$('.hist'+id).replaceWith("");
			}
	}, 'json');
}
kickUser = function(target){
	$.post('system/action/action.php', {
		kick: target,
		delay: $('#kick_delay').val(),
		reason: $('#kick_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}
banUser = function(target){
	$.post('system/action/action.php', {
		ban: target,
		reason: $('#ban_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}
warnUser = function(target){
	$.post('system/action/action.php', {
		warn: target,
		reason: $('#warn_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}
muteUser = function(target){
	$.post('system/action/action.php', {
		mute: target,
		delay: $('#mute_delay').val(),
		reason: $('#mute_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}
ghostUser = function(target){
	$.post('system/action/action.php', {
		ghost: target,
		delay: $('#ghost_delay').val(),
		reason: $('#ghost_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}
mainMuteUser = function(target){
	$.post('system/action/action.php', {
		main_mute: target,
		delay: $('#mute_delay').val(),
		reason: $('#mute_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}
privateMuteUser = function(target){
	$.post('system/action/action.php', {
		private_mute: target,
		delay: $('#mute_delay').val(),
		reason: $('#mute_reason').val(),
		}, function(response) {
			hideOver();
	}, 'json');
}
confirmDelete = function(target){
	$.post('system/action/action_users.php', {
		delete_user_account: target,
		}, function(response) {
			hideOver();
			hideModal();
			if(response.code == 1){
				$('#found'+target).replaceWith("");
			}
	}, 'json');
}
removeSystemAction = function(elem, u, t){
	$.post('system/action/action.php', {
		target: u,
		take_action: t,
		}, function(response) {
			if(response.code == 1){
				$(elem).parent().replaceWith("");
			}
	}, 'json');	
}
sendConsole = function(){
	var console = $('#console_content').val();
	$.post('system/action/console.php', {
		run_console: console,
		}, function(response) {
			$('#console_content').val('');
	}, 'json');
}

var adminWaitCover = 0;
adminUploadCover = function(id){
	var file_data = $("#admin_cover_file").prop("files")[0];
	if(!validUpload('admin_cover_file', coverMax)){
		return false;
	}
	else {
		if(adminWaitCover == 0){
			adminWaitCover = 1;
			uploadIcon('admin_cover_icon', 1);
			var form_data = new FormData();
			form_data.append("file", file_data)
			form_data.append("target", id)
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
					uploadIcon('admin_cover_icon', 2);
					adminWaitCover = 0;
				},
				error: function(){
					uploadIcon('admin_cover_icon', 2);
					adminWaitCover = 0;
				}
			})
		}
	}
}

var waitIcon = 0;
adminRoomIcon = function(id){
	var file_data = $("#ricon_image").prop("files")[0];
	if(!validUpload('ricon_image', riconMax)){
		return false;
	}
	else {
		if(waitIcon == 0){
			waitIcon = 1;
			uploadIcon('ricon_icon', 1);
			var form_data = new FormData();
			form_data.append("file", file_data)
			form_data.append("staff_add_icon", id)
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
					waitIcon = 0;
				},
				error: function(){
					uploadIcon('ricon_icon', 2);
					waitIcon = 0;
				}
			})
		}
	}
}

var newsWait = 0;
uploadNews = function(){
	var file_data = $("#news_file").prop("files")[0];
	if(!validUpload('news_file', fileMax)){
		return false;
	}
	else {
		if(newsWait == 0){
			newsWait = 1;
			postIcon(1);
			var form_data = new FormData();
			form_data.append("file", file_data)
			form_data.append("token", utk)
			form_data.append("zone", 'news')
			$.ajax({
				url: "system/action/file_news.php",
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
					newsWait = 0;
				},
				error: function(){
					newsWait = 0;
				}
			})
		}
	}
}

// lookup

getIpDetails = function(id){
	$('#scanbtn').hide();
	$.post('system/action/action_staff.php', {
		get_ip:id,
		}, function(response) {
			if(response.code == 1){
				$('#ip_details').html(response.data).show();
			}
	}, 'json');
}

adminRemoveAvatar = function(id){
	$.post('system/action/avatar.php', {
		remove_avatar: id,
		}, function(response) {
			if(response.code == 1) {
				$('.avatar_profile').attr('src', response.data);
				$('.avatar_profile').attr('href', response.data);
			}
	}, 'json');
}
adminRemoveProfileMusic = function(id){
	$.post('system/action/file_music.php', {
		staff_remove_pmusic: id,
		}, function(response) {
			if(response.code == 1) {
				$('#staff_pmusic').replaceWith('');
			}
	}, 'json');
}
adminRemoveCover = function(id){
	$.post('system/action/cover.php', {
		remove_cover: id,
		}, function(response) {
			if(response.code == 1){
				delCover();
			}
	}, 'json');	
}
staffRemoveRoomIcon = function(id){
	$.post('system/action/room_icon.php', {
		staff_remove_icon: id,
		}, function(response) {
			if(response.code == 1) {
				$('.ricon_current').attr('src', response.data);
				$('#ricon'+id).attr('src', response.data);
			}
	}, 'json');
}