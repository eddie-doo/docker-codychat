initCall = function(t){
	hideAllModal();
	hideCallRequest();
	hideCall();
	hidePanel();
	$('#wrap_call').html(t.data);
	$('.callwidth').css('width', t.w+'px');
	$('.callheight').css('height', t.h+'px');
	showCall();
}

startCall = function(id, type){
	hideAllModal();
	$.post('system/action/action_call.php', { 
			init_call: id,
			call_type: type,
		}, function(response) {
			if(response.code == 1){
				overEmptyModal(response.data);
			}
	}, 'json');
}
openCall = function(id){
	hideAllModal();
	$.post('system/box/call_box.php', { 
			target: id,
		}, function(response) {
			if(response){
				overModal(response);
			}
	});
}
cancelCall = function(id){
	$.post('system/action/action_call.php', { 
			cancel_call: id,
		}, function(response) {
			hideOver();
	}, 'json');
}
acceptCall = function(){
	$.post('system/action/action_call.php', { 
			accept_call: $('#call_request').attr('data'),
		}, function(response) {
			if(response.code == 1){
				initCall(response);
			}
			else{
				hideCallRequest();
			}
	}, 'json');
}
joinGroupCall = function(id, rank){
	var gpass = '';
	if ($("#call_password").length){
		gpass = $('#call_password').val();
	}
	if(!boomAllow(rank)){
		callError(system.access_requirement);
		return;
	}
	$.post('system/action/action_group_call.php', { 
			join_group_call: id,
			call_key: gpass,
		}, function(response) {
			if(response.code == 1){
				initCall(response);
			}
			else if(response.code == 3){
				hideOver();
			}
	}, 'json');
}
openJoinGroupCall = function(id, rank){
	if(!boomAllow(rank)){
		callError(system.access_requirement);
		return;
	}
	$.post('system/box/join_group_call.php', { 
			call_id: id,
		}, function(response) {
			if(response){
				overModal(response, 320);
			}
	});
}
declineCall = function(){
	$.post('system/action/action_call.php', { 
			decline_call: $('#call_request').attr('data'),
		}, function(response) {
			hideCallRequest();
	}, 'json');
}

updateCall = function(type){
	if($('#call_pending:visible').length){
		
		$.post('system/action/action_call.php', { 
				update_call: $('#call_pending').attr('data'),
			}, function(response) {
				if(response.code == 1){
					initCall(response);
				}
				else if(response.code == 0){
					hideOver();
				}
		}, 'json');	
	}
}

updateIncomingCall = function(type){
	if($('#call_request:visible').length){
		$.post('system/action/action_call.php', { 
				update_incoming_call: $('#call_request').attr('data'),
			}, function(response) {
				if(response.code == 99){
					hideCallRequest();
				}
		}, 'json');	
	}
}

hideCallRequest = function(){
	$('#call_request').attr('data', '');
	$('#call_request_type').text('');
	$('#call_request_name').text('');
	$('#call_request_avatar').attr('src', '');
	$('#call_request').addClass('fhide');
}
showCallRequest = function(d){
	$('#call_request').attr('data', d.call_id);
	$('#call_request_type').text(d.call_type);
	$('#call_request_name').text(d.call_username);
	$('#call_request_avatar').attr('src', d.call_avatar);
	$('#call_request').removeClass('fhide');
}

checkCall = function(ncall){
	if(ncall > uCall){
		uCall = ncall;
		$.post('system/action/action_call.php', { 
				check_call: inCall(),
			}, function(response) {
				if(response.code == 1){
					showCallRequest(response.data);
				}
		}, 'json');	
	}	
}

inCall = function(){
	if($('#call_pending:visible').length || $('#call_request:visible').length || $('#container_call:visible').length){
		return 1;
	}
	else {
		return 0;
	}
}

callOff = function(){
	$('.vcallstream').removeClass('over_stream');
}
callOn = function(){
	if(!insideChat()){
		$('.vidminus').replaceWith("");
	}
	if($('.modal_in:visible').length){
		$('.vidstream').addClass('over_stream');
	}
	else {
		vidOff();
	}
}

hideCall = function(){
	$('#wrap_call').html('');
	$('#container_call').hide();
	$('#mstream_call').addClass('streamhide');
}
showCall = function(){
	$("#container_call").removeClass('streamout').fadeIn(300);
}

toggleCall = function(type){
	if(type == 1){
		$("#container_call").addClass('streamout');
		$('#mstream_call').removeClass('streamhide');
	}
	if(type == 2){
		$("#container_call").removeClass('streamout');
		$('#mstream_call').addClass('streamhide');
	}
}

openAddCall = function(){
	$.post('system/box/create_group_call.php', {
		}, function(response) {
			overModal(response);
	});
}
editGroupCall = function(id){
	hideAllModal();
	$.post('system/box/edit_group_call.php', { 
			call_id: id,
		}, function(response) {
			if(response){
				showModal(response);
			}
	});
}
var waitGcall = 0;
addGroupCall = function(){
	if(waitGcall == 0){
		waitGcall = 1;
		$.ajax({
			url: "system/action/action_group_call.php",
			type: "post",
			cache: false,
			dataType: 'json',
			data: { 
				add_group_call: 1,
				call_name: $('#set_call_name').val(),
				call_password: $('#set_call_password').val(),
				call_access: $('#set_call_access').val(),
				call_type: $('#group_call_form').attr('data-type'),
			},
			success: function(response){
				if(response.code == 1){
					joinGroupCall(response.room, response.rank);
				}
				waitGcall = 0;
			},
			error: function(){
				waitGcall = 0;
			}
		});	
	}
}

saveGroupCall = function(id){
	$.ajax({
		url: "system/action/action_group_call.php",
		type: "post",
		cache: false,
		dataType: 'json',
		data: { 
			save_group_call: 1,
			call_id: id,
			call_name: $('#save_call_name').val(),
			call_password: $('#save_call_password').val(),
			call_access: $('#save_call_access').val(),
		},
		success: function(response){
			if(response.code == 1){
				hideModal();
			}
		}
	});	
}

showCallError = function(e){
	$.post('system/box/call_error.php', { 
			error: e,
		}, function(response) {
			if(response){
				overModal(response, 320);
			}
	});
}


$(document).ready(function(){
	callUpdate = setInterval(updateCall, 3000);
	callIncoming = setInterval(updateIncomingCall, 3000);
	updateCall();
	updateIncomingCall();
	
	$(document).on('click', '.opencall', function(){
		var calluser = $(this).attr('data');
		openCall(calluser);
	});
	$(document).on('click', '.startcall', function(){
		var cuser = $(this).attr('data-user');
		var ctype = $(this).attr('data-type');
		startCall(cuser, ctype);
	});
	$(document).on('click', '.hide_call', function(){
		hideCall();
	});
	
	$(window).on("message", function(event) {
		const e = event.originalEvent;
		if (e.origin !== window.location.origin) {
			return;
		}
		const data = e.data;
		if (data.type === 'endCall') {
			hideCall();
			callendPlay();
			if(data.code != 99){
				showCallError(data.code);
			}
		}
	});
	
	$(document).on('change, paste, keyup', '#search_call_room', function(){
		var sr = $(this).val().toLowerCase();
		if(sr == ''){
			$(".call_element").each(function(){
				$(this).show();
			});	
		}
		else {
			$(".call_element").each(function(){
				var rt = $(this).find('.call_name').text().toLowerCase();
				var rd = $(this).find('.callusername').text().toLowerCase();
				if(rt.indexOf(sr) < 0 && rd.indexOf(sr) < 0){
					$(this).hide();
				}
				else {
					$(this).show();
				}
			});
		}
	});
});