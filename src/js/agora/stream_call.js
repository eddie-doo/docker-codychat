let client = AgoraRTC.createClient({ mode: 'live', codec: "vp8" });

let localTracks = {
  audioTrack: null,
  videoTrack: null
};

let localTrackState = {
  audioTrackMuted: false,
  videoTrackMuted: false
};

let remoteUsers = {};
let calladmin = false;
let callUsers = new Set();
let callUsersDelay = null;
let currentHostUid = null;

ensureContainer = (uid, isSelf = false) => {
  if (!$(`#video-wrapper-${uid}`).length) {
    $('#vcall_group_streams').append(tileTemplate(uid, isSelf));
    updateGridLayout();
  }
};

const removeContainer = (uid) => {
  const $grid = $('#vcall_group_streams');
  const $tile = $(`#video-wrapper-${uid}`);
  const wasSpotlight = $tile.hasClass('spotlight');
  $tile.remove();
  if (wasSpotlight) {
    $('.vcall_tile.spotlight').removeClass('spotlight');
    $grid.removeClass('spotlight-active');
    $('body').removeClass('no-scroll');
  }
  requestAnimationFrame(updateGridLayout);
};

const showPlaceholder = (uid, show) => {
  $(`#ph-${uid}`)[show ? 'show' : 'hide']();
};

const safePublish = async (tracks) => {
  if (calladmin){
	  const toPub = tracks.filter(Boolean);
	  if (toPub.length) {
		await client.publish(toPub);
	  }
  }
};

const closeIframe = (reason) => {
  window.parent.postMessage({ type: 'endCall', code: reason }, window.location.origin);
};

let closeCall = async (e) => {
  try {
    for (let k in localTracks) {
      const t = localTracks[k];
      if (t) {
        try { t.stop(); } catch (_) {}
        try { t.close(); } catch (_) {}
        localTracks[k] = null;
      }
    }
    try { await client.leave(); } catch (_) {}
  } finally {
    $('#vcall_group_streams').empty();
    closeIframe(e);
    window.location.href = 'call_end.php?end=' + e;
  }
};

let joinStreams = async () => {
  try {
    let response = await $.post("system/action/action_group_call.php", { open_group_call: appcall, group_call_type: 1 });
    let result = JSON.parse(response);
    if (result.code !== 1 || !result.data) {
      throw new Error("Invalid response from server");
    }

    let { appid, appowner, approom, apptoken } = result.data;
	
    currentHostUid = appowner;
    if (appowner == appuser) {
      calladmin = true;
    }
	
    console.log('call permission (host): ' + calladmin);

    await client.setClientRole(calladmin ? 'host' : 'audience');

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-left", handleUserLeft);

    client.enableAudioVolumeIndicator();
    client.on("volume-indicator", function (evt) {
      for (let i = 0; i < evt.length; i++) {
        const speaker = evt[i].uid;
        const volume = evt[i].level;
        const icon = (volume > 0) ? 'default_images/call/volume-on.svg' : 'default_images/call/volume-off.svg';
        $(`#volume-${speaker}`).attr('src', icon);
      }
    });
	
    [appuser] = await Promise.all([
      client.join(appid, approom, apptoken || null, appuser || null)
    ]);
	
    if (calladmin) {
      try { await client.enableDualStream(); } catch(_) {}
    }
	
    // Build own tile
    ensureContainer(appuser, true);
    $(`#vcall_u${appuser}`).text(appUsername);
    showPlaceholder(appuser, true);

    if (calladmin) {
      try {
        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      } catch (e) {
        console.warn('Mic not available:', e);
        localTracks.audioTrack = null;
      }
      try {
        localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: { resolution: "480p" }
        });
        localTracks.videoTrack.play(`stream-${appuser}`);
        showPlaceholder(appuser, false);
      } catch (e) {
        console.warn('Camera not available:', e);
        localTracks.videoTrack = null;
      }
      await safePublish([localTracks.audioTrack, localTracks.videoTrack]);
    } 
	else {
      $('#vcall_mic, #vcall_cam').addClass('disabled').hide();
    }

  } catch (error) {
    console.error("Error starting call:", error);
  }
};

let handleUserPublished = async (user, mediaType) => {

  if (user.uid !== currentHostUid) {
    console.warn('Ignoring non-host publisher:', user.uid);
    return;
  }

  remoteUsers[user.uid] = user;

  try {
    await client.subscribe(user, mediaType);
    ensureContainer(user.uid);

    if (mediaType === 'video' && user.videoTrack) {
      try { await client.setRemoteVideoStreamType(user.uid, 1); } catch(_) {}
      user.videoTrack.play(`stream-${user.uid}`);
      showPlaceholder(user.uid, false);
    }
    if (mediaType === 'audio' && user.audioTrack) {
      user.audioTrack.play();
      if (!user.videoTrack) showPlaceholder(user.uid, true);
    }

    callUsers.add(user.uid);
    if (!callUsersDelay) {
      callUsersDelay = setTimeout(() => {
        handleGroupUser(Array.from(callUsers));
        callUsers.clear();
        callUsersDelay = null;
      }, 300);
    }
  } catch (e) {
    console.error("Subscribe/play failed for", user.uid, mediaType, e);
  }
};

let handleGroupUser = function (ui) {
  if (ui.length === 0) return;
  $.ajax({
    url: "system/action/action_group_call.php",
    type: "post",
    cache: false,
    dataType: 'json',
    data: { call_group_user: ui },
    success: function (response) {
      if (response.code !== 0) {
        response.data.forEach(user => {
          $('#vcall_u' + user.user_id).text(user.user_name);
          $('#vcall_avatar' + user.user_id).attr('src', user.avatar);
        });
      }
    }
  });
};

let handleUserUnpublished = (user, mediaType) => {
  if (mediaType === 'audio') {
    $(`#volume-${user.uid}`).attr('src', 'default_images/call/volume-off.svg');
    if (!user.videoTrack) showPlaceholder(user.uid, true);
  }
  if (mediaType === 'video') {
    if (!user.audioTrack) showPlaceholder(user.uid, true);
  }
};

let handleUserLeft = (user) => {
  delete remoteUsers[user.uid];
  removeContainer(user.uid);
  if (user.uid === currentHostUid) {
		closeCall(99);
  }
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

$('#vcall_mic').on('click', async () => {
  if (calladmin){
	  if (!localTracks.audioTrack) {
		try {
		  localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
		  await safePublish([localTracks.audioTrack]);
		} catch (e) {
		  console.warn('Cannot enable mic:', e);
		  return;
		}
	  }

	  if (!localTrackState.audioTrackMuted) {
		await localTracks.audioTrack.setMuted(true);
		localTrackState.audioTrackMuted = true;
		$('#vcall_mic').addClass('vcall_off');
	  } else {
		await localTracks.audioTrack.setMuted(false);
		localTrackState.audioTrackMuted = false;
		$('#vcall_mic').removeClass('vcall_off');
	  }
  }
});

$('#vcall_cam').on('click', async () => {
  
  if (calladmin){
	  if (!localTracks.videoTrack) {
		try {
		  localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({
			encoderConfig: { resolution: "480p" }
		  });
		  localTracks.videoTrack.play(`stream-${appuser}`);
		  showPlaceholder(appuser, false);
		  await safePublish([localTracks.videoTrack]);
		  localTrackState.videoTrackMuted = false;
		  $('#vcall_cam').removeClass('vcall_off');
		  return;
		} catch (e) {
		  console.warn('Cannot enable camera:', e);
		  return;
		}
	  }

	  if (!localTrackState.videoTrackMuted) {
		await localTracks.videoTrack.setEnabled(false);
		localTrackState.videoTrackMuted = true;
		$('#vcall_cam').addClass('vcall_off');
		showPlaceholder(appuser, true);
	  } else {
		await localTracks.videoTrack.setEnabled(true);
		localTrackState.videoTrackMuted = false;
		$('#vcall_cam').removeClass('vcall_off');
		showPlaceholder(appuser, false);
	  }
  }
});

const updateGridLayout = () => {
  const $grid = $('#vcall_group_streams');
  const n = $grid.children('.vcall_tile').length;
  $grid.toggleClass('two-vertical', !$grid.hasClass('spotlight-active') && n === 2);
};

$('#vcall_group_streams')
  .off('click.vcSpot')
  .on('click.vcSpot', '.vcall_tile', function (e) {
    if ($(e.target).closest('.vcall_userbar, .vcall_vol, .spotlight-exit').length) return;
    const $tile = $(this);
    const $grid = $('#vcall_group_streams');

    if ($tile.hasClass('spotlight')) {
      $tile.removeClass('spotlight');
      $grid.removeClass('spotlight-active');
      $('body').removeClass('no-scroll');
    } else {
      $('.vcall_tile.spotlight').removeClass('spotlight');
      $tile.addClass('spotlight');
      $grid.addClass('spotlight-active');
      $('body').addClass('no-scroll');
    }

    updateGridLayout();
  });

$('#vcall_leave').on('click', async () => {
  await closeCall(99);
});

let startStream = async () => {
  await joinStreams();
};

let callBan = (id) => {
	if (calladmin){
	  const $tile = $(`#video-wrapper-${id}`);
	  if (!$tile.length) return;
	  $tile.addClass('ban-pending');
	  $.ajax({
		url: 'system/action/action_group_call.php',
		type: 'post',
		dataType: 'json',
		data: { call_ban: id, call_id: appcall },
		success: (res) => {
		  if (res && res.code === 1) {
			if (remoteUsers) delete remoteUsers[id];
			removeContainer(id);
		  }
		},
		complete: () => $tile.removeClass('ban-pending')
	  });
	}
};

$(document).ready(function () {
  $.ajaxSetup({ data: { token: utk, cp: curPage } });

  startStream();
  window.callUpgrade = setInterval(upgradeGroupCall, 10000);
  upgradeGroupCall();
});

const tileTemplate = (id, isSelf = false) => {
  const showBan = calladmin && id !== appuser;
  return `
    <div class="vcall_tile" id="video-wrapper-${id}">
      <div class="vcall_player" id="stream-${id}"></div>
      <div class="vcall_placeholder" id="ph-${id}" style="display:none;">No camera</div>
      <div class="vcall_userbar">
        <img class="vcall_vol" id="volume-${id}" src="default_images/call/volume-off.svg" />
        <span class="vcall_name bellips" id="vcall_u${id}">${isSelf ? appUsername : ''}</span>
        ${showBan ? `
          <div onclick="callBan(${id});" class="callactban${id} bcell_mid call_action" title="Ban from stream">
            <i class="fa fa-ban"></i>
          </div>` : ''}
      </div>
    </div>
  `;
};
