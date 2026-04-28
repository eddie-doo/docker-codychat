let client = AgoraRTC.createClient({ mode: 'rtc', codec: "vp8" });

let callUsers = new Set();
let callUsersDelay = null;
let calladmin = false;

let localTracks = {
    audioTrack: null,
    videoTrack: null
};

let localTrackState = {
    audioTrackMuted: false,
    videoTrackMuted: false
};

let remoteTracks = {};

let closeCall = async (e) => {
    for (let trackName in localTracks) {
        let track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = null;
        }
    }
    await client.leave();
    $('#vcall_streams').html('');
	closeIframe(e);
	window.location.href = 'call_end.php?end=' + e ;
};


let joinStreams = async () => {
	try {
        let response = await $.post("system/action/action_group_call.php", { open_group_call: appcall, group_call_type: 1 });
        let result = JSON.parse(response);
        if (result.code !== 1 || !result.data) {
            throw new Error("Invalid response from server");
			return;
        }
        let { appid, appowner, approom, apptoken, appurl } = result.data;
		if(appowner == appuser){
			calladmin = true;
		}
		client.on("user-published", handleUserJoined);
		client.on("user-left", handleUserLeft);
		client.enableAudioVolumeIndicator();
		client.on("volume-indicator", function (evt) {
			for (let i = 0; evt.length > i; i++) {
				let speaker = evt[i].uid;
				let volume = evt[i].level;
				if (volume > 0) {
					$(`#volume-${speaker}`).attr('src', 'default_images/call/volume-on.svg');
				} 
				else {
					$(`#volume-${speaker}`).attr('src', 'default_images/call/volume-off.svg');
				}
			}
		});
		[appuser, localTracks.audioTrack] = await Promise.all([
			client.join(appid, approom, apptoken || null, appuser || null),
			AgoraRTC.createMicrophoneAudioTrack()
		]);

		let player = selfPlayer(appuser);
		$('#vcall_self').append(player);
		await client.publish([localTracks.audioTrack]);
		
    } catch (error) {
        console.error("Error fetching call details:", error);
		closeCall(1);
    }
};

let handleUserJoined = async (user, mediaType) => {
    remoteTracks[user.uid] = user;
    await client.subscribe(user, mediaType);
    
    if (mediaType === 'audio') {
        let player = $(`#video-wrapper-${user.uid}`);
        console.log('player:', player);
        if (player != null) {
            player.replaceWith("");
        }
        player = joinPlayer(user.uid);
        $('#vcall_streams').append(player); 
        user.audioTrack.play();
        
        callUsers.add(user.uid);

        if (!callUsersDelay) {
            callUsersDelay = setTimeout(() => {
                handleGroupUser(Array.from(callUsers));
                callUsers.clear();
                callUsersDelay = null;
            }, 300);
        }
    }
};
let handleGroupUser = function(ui) {
    if (ui.length === 0){
		return;
	}
    $.ajax({
        url: "system/action/action_group_call.php",
        type: "post",
        cache: false,
        dataType: 'json',
        data: { call_group_user: ui },
        success: function(response) {
            if (response.code !== 0) {
                response.data.forEach(user => {
                    $('#vcall_u' + user.user_id).text(user.user_name);
                    $('#vcall_avatar' + user.user_id).attr('src', user.avatar);
                });
            }
        }
    });
};

let closeIframe = (reason) => {
	window.parent.postMessage({
		type: 'endCall',
		code: reason,
	}, window.location.origin);
}


let selfPlayer = (id) => {
    return `<div class="vcall_container" id="video-wrapper-${id}">
                <div class="vcall_player player" id="stream-${id}">
                </div>
            </div>`;
};

let joinPlayer = (id) => {
    return `<div class="call_item lite_olay btable" id="video-wrapper-${id}">
				<div data="${id}" class="callact call_item_avatar bcell_mid">
					<img id="vcall_avatar${id}" src="default_images/misc/holder.png"/>
				</div>
				<div data="${id}" class="callact call_item_name bcell_mid">
					<p class="bellips" id="vcall_u${id}"></p>
					<div  class="vcall_player player" id="stream-${id}">
					</div>
				</div>
				<div onclick="callBan(${id});" class="callactban${id} bcell_mid call_action hidden">
					<i class="fa fa-ban"></i>
				</div>
				<div class="bcell_mid call_mic">
					<img  id="volume-${id}" src="default_images/call/volume-off.svg" />
				</div>
            </div>`;
};

let startStream = async () => {
    await joinStreams();
};

let upgradeGroupCall = () => {
    $.post('system/action/action_group_call.php', {
        upgrade_group_call: appcall,
    }, function (response) {
        if (response.code != 0) {
			closeCall(response.code);
        }
    }, 'json');
};

let handleUserLeft = (userOrUid) => {
  const uid = (typeof userOrUid === 'object') ? userOrUid.uid : userOrUid;
  try { remoteTracks[uid]?.audioTrack?.stop(); } catch (_) {}
  delete remoteTracks[uid];
  $(`#video-wrapper-${uid}`).replaceWith("");
};

let callBan = (id) => {
  $.ajax({
    url: 'system/action/action_group_call.php',
    type: 'post',
    dataType: 'json',
    data: { call_ban: id, call_id: appcall },
    success: function (response) {
      if (response && response.code === 1) {
        handleUserLeft({ uid: id });
      }
    },
    error: function (xhr) {
      console.log('ajax error', xhr.responseText);
    }
  });
};

$('#vcall_self').on('click', function () {
    if ($(this).hasClass('vcall_self')) {
        $(this).removeClass('vcall_self');
    } else {
        $(this).addClass('vcall_self');
    }
});

$('#vcall_mic').on('click', async () => {
    if (!localTrackState.audioTrackMuted) {
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true;
        $('#vcall_mic').addClass('vcall_off');
    } else {
        await localTracks.audioTrack.setMuted(false);
        localTrackState.audioTrackMuted = false;
        $('#vcall_mic').removeClass('vcall_off');
    }
});

$(document).on('click', '.callact', async function () {
	var uact = $(this).attr('data');
	var callactBan = $('.callactban' + uact);
	var callactMute = $('.callactmute' + uact);
	callactMute.toggleClass('hidden');
	if (calladmin) {
		callactBan.toggleClass('hidden');
	}
});



$('#vcall_leave').on('click', async () => {
    await closeCall(99);
});

$(document).ready(function () {
    $.ajaxSetup({
        data: { token: utk, cp: curPage }
    });

    startStream();
    groupCallUpgrade = setInterval(upgradeGroupCall, 10000);
    upgradeGroupCall();
});
