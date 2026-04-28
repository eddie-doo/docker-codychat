openContact = function(id){
	$.post('system/box/contact_box.php', {
		open_contact: id,
		}, function(response) {
			showModal(response, 700);
			$('#unread_contact'+id).remove();
	});	
}
deleteContact = function(id){
	$.post('system/action/action_contacts.php', {
		delete_contact: id,
		}, function(response) {
			if(response.code == 1){
				hideModal();
				$('#contact'+id).remove();
			}
	}, 'json');	
}
openClearContact = function(){
	$.post('system/box/contact_confirm.php', {
		}, function(response) {
			if(response){
				overModal(response);
			}
	});	
}
clearContact = function(){
	$.post('system/action/action_contacts.php', {
		clear_contact: 1,
		}, function(response) {
			hideOver();
			if(response.code == 1){
				$('#contact_listing').html(response.data);
			}
	}, 'json');	
}
var waitContact = 0;
replyContact = function(id){
	waitContact = 1;
	$.ajax({
		url: "system/action/action_contacts.php",
		type: "post",
		cache: false,
		dataType: 'json',
		data: { 
			reply_id: id,
			reply_content: $('#contact_reply').val(),
		},
		success: function(response){
			if(response.code == 1){
				$('#contact'+id).remove();
				hideModal();
			}
		},
		error: function(){
			waitContact = 0;
		}
	});
}
reloadContact = function(){
	$.post('system/action/action_contacts.php', {
		reload_contact: 1,
		}, function(response) {
			if(response.code == 1){
				$('#contact_notify').show();
			}
			else {
				$('#contact_notify').hide();
			}

	}, 'json');	
}

$(document).ready(function(){

	reloadContact();
	contactReload = setInterval(reloadContact, 15000);
	
});