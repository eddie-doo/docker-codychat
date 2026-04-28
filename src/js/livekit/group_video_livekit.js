let liveRoom = null;

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

const closeIframe = (reason) => {
  window.parent.postMessage({ type: 'endCall', code: reason }, window.location.origin);
};

let closeCall = async (e) => {
  try {
    if (liveRoom) {
      try { await liveRoom.disconnect(); } catch (_) {}
      liveRoom = null;
    }
    if (localTracks.audioTrack) {
      try { localTracks.audioTrack.stop(); } catch (_) {}
      localTracks.audioTrack = null;
    }
    if (localTracks.videoTrack) {
      try { localTracks.videoTrack.stop(); } catch (_) {}
      localTracks.videoTrack = null;
    }
  } finally {
    $('#vcall_group_streams').empty();
    closeIframe(e);
    window.location.href = 'call_end.php?end=' + e;
  }
};

const handleUserName = (id) => {
  callUsers.add(id);
  if (!callUsersDelay) {
    callUsersDelay = setTimeout(() => {
      const ids = Array.from(callUsers);
      callUsers.clear();
      callUsersDelay = null;

      $.ajax({
        url: "system/action/action_group_call.php",
        type: "post",
        cache: false,
        dataType: "json",
        data: { call_group_user: ids },
        success: function(response) {
          if (response && response.code !== 0 && Array.isArray(response.data)) {
            response.data.forEach(user => {
              $('#vcall_u' + user.user_id).text(user.user_name);
              $('#vcall_avatar' + user.user_id).attr('src', user.avatar);
            });
          }
        }
      });
    }, 300);
  }
};

const handleUserLeft = (uid) => {
  delete remoteUsers[uid];
  removeContainer(uid);
};

const setVolumeIcon = (uid, on) => {
  const icon = on ? 'default_images/call/volume-on.svg' : 'default_images/call/volume-off.svg';
  $(`#volume-${uid}`).attr('src', icon);
};

const styleVideo = (el, isLocal = false) => {
  el.setAttribute('playsinline', '');
  el.autoplay = true;
  if (isLocal) el.muted = true;
  return el;
};

const getVideoPublications = (participant) => {
  if (typeof participant.getTrackPublications === 'function') {
    return participant.getTrackPublications().filter(p => p.kind === 'video');
  }
  const vt = participant.videoTracks;
  if (vt?.forEach) {
    const pubs = [];
    vt.forEach(p => pubs.push(p));
    return pubs;
  }
  if (vt && typeof vt === 'object') {
    return Object.values(vt);
  }
  return [];
};

const hasActiveRemoteVideo = (participant) => {
  return getVideoPublications(participant).some(pub => pub?.track && !pub.isMuted);
};

const playRemoteTrack = (participant, track) => {
  const uid = participant.identity;
  ensureContainer(uid, false);
  if (track.kind === 'audio') {
    const el = track.attach();
    $(el).addClass('lk-audio');
    document.body.appendChild(el);
    if (!hasActiveRemoteVideo(participant)) showPlaceholder(uid, true);
  } else if (track.kind === 'video') {
    const el = styleVideo(track.attach(), false);
    $(`#stream-${uid}`).empty().append(el);
    showPlaceholder(uid, false);
  }
  handleUserName(uid);
};

const unplayRemoteTrack = (participant, track) => {
  const uid = participant.identity;
  try { track.detach().forEach((el) => el.remove()); } catch (_) {}
  if (track.kind === 'audio') setVolumeIcon(uid, false);
  if (track.kind === 'video') {
    if (!hasActiveRemoteVideo(participant)) showPlaceholder(uid, true);
  }
};

let joinStreams = async () => {
  try {
    const response = await $.post("system/action/action_group_call.php", { open_group_call: appcall, group_call_type: 2 });
	
    const result = JSON.parse(response);
    if (result.code !== 1 || !result.data) throw new Error("Invalid response from server");
	
    const { appid, appowner, approom, apptoken, appurl } = result.data;
	if(appowner == appuser){
		calladmin = true;
	}
	console.log('call permission : ' + calladmin);

    const grantCam = await camPermission();
    const grantMic = await micPermission();

    liveRoom = new LivekitClient.Room({
      adaptiveStream: true,
      autoSubscribe: true
    });

    liveRoom.on(LivekitClient.RoomEvent.ParticipantConnected, (p) => {
      remoteUsers[p.identity] = p;
      ensureContainer(p.identity, false);
      showPlaceholder(p.identity, true);
      handleUserName(p.identity);
      setVolumeIcon(p.identity, false);
    });

    liveRoom.on(LivekitClient.RoomEvent.ParticipantDisconnected, (p) => {
      handleUserLeft(p.identity);
    });

    liveRoom.on(LivekitClient.RoomEvent.TrackSubscribed, (track, publication, participant) => {
      playRemoteTrack(participant, track);
    });

    liveRoom.on(LivekitClient.RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      unplayRemoteTrack(participant, track);
    });

    liveRoom.on(LivekitClient.RoomEvent.TrackMuted, (publication, participant) => {
      const uid = participant.identity;
      if (publication.kind === 'audio') setVolumeIcon(uid, false);
      if (publication.kind === 'video' && !hasActiveRemoteVideo(participant)) showPlaceholder(uid, true);
    });

    liveRoom.on(LivekitClient.RoomEvent.TrackUnmuted, (publication, participant) => {
      const uid = participant.identity;
      if (publication.kind === 'video') showPlaceholder(uid, false);
    });

    liveRoom.on(LivekitClient.RoomEvent.ActiveSpeakersChanged, (speakers) => {
      const active = new Set(speakers.map(s => s.identity));
      for (const [uid] of Object.entries(remoteUsers)) {
        setVolumeIcon(uid, active.has(uid));
      }
      if (typeof appuser !== 'undefined') setVolumeIcon(appuser, active.has(String(appuser)));
    });

    await liveRoom.prepareConnection(appurl, apptoken);
    await liveRoom.connect(appurl, apptoken);

    ensureContainer(appuser, true);
    $(`#vcall_u${appuser}`).text(appUsername);
    showPlaceholder(appuser, true);

    const tracks = await LivekitClient.createLocalTracks({
      audio: !!grantMic,
      video: grantCam ? { facingMode: 'user' } : false
    });

    const a = tracks.find(t => t.kind === 'audio') || null;
    const v = tracks.find(t => t.kind === 'video') || null;

    if (a) {
      await liveRoom.localParticipant.publishTrack(a);
      localTracks.audioTrack = a;
      localTrackState.audioTrackMuted = false;
    }

    if (v) {
      await liveRoom.localParticipant.publishTrack(v);
      localTracks.videoTrack = v;
      localTrackState.videoTrackMuted = false;
      const el = styleVideo(v.attach(), true);
      $(`#stream-${appuser}`).empty().append(el);
      showPlaceholder(appuser, false);
    } else {
      showPlaceholder(appuser, true);
    }

    (liveRoom.remoteParticipants || new Map()).forEach((p) => {
      remoteUsers[p.identity] = p;
      ensureContainer(p.identity, false);
      handleUserName(p.identity);
      setVolumeIcon(p.identity, false);
      if (!hasActiveRemoteVideo(p)) showPlaceholder(p.identity, true);
    });

  } catch (error) {
    console.error("Error starting call:", error);
  }
};

const getCurrentLocalVideoTrack = () => {
  if (!liveRoom) return null;
  let pubs = [];
  if (typeof liveRoom.localParticipant.getTrackPublications === 'function') {
    pubs = liveRoom.localParticipant.getTrackPublications();
  } else if (liveRoom.localParticipant.tracks instanceof Map) {
    pubs = Array.from(liveRoom.localParticipant.tracks.values());
  }
  const vpub = pubs.find(p => (p.kind || p?.track?.kind) === 'video');
  return vpub?.track || null;
};


$(document)
  .off('click.camToggle')
  .on('click.camToggle', '#vcall_cam', async () => {
    console.log('cam click');
    if (!liveRoom) return;

    try {
      const wantEnable = localTrackState.videoTrackMuted;
      await liveRoom.localParticipant.setCameraEnabled(wantEnable);

      localTrackState.videoTrackMuted = !wantEnable;
      $('#vcall_cam').toggleClass('vcall_off', !wantEnable);
      showPlaceholder(appuser, !wantEnable);

      localTracks.videoTrack = getCurrentLocalVideoTrack();

      const $slot = $(`#stream-${appuser}`);
      $slot.empty();
      if (localTracks.videoTrack && !localTrackState.videoTrackMuted) {
        const el = styleVideo(localTracks.videoTrack.attach(), true);
        $slot.append(el);
      }
    } catch (e) {
      console.warn('Cam toggle failed:', e);
    }
  });

$(document)
  .off('click.micToggle')
  .on('click.micToggle', '#vcall_mic', async () => {
    console.log('mic click');
    if (!liveRoom) return;

    try {
      const wantEnable = localTrackState.audioTrackMuted;
      await liveRoom.localParticipant.setMicrophoneEnabled(wantEnable);

      localTrackState.audioTrackMuted = !wantEnable;
      $('#vcall_mic').toggleClass('vcall_off', !wantEnable);
    } catch (e) {
      console.warn('Mic toggle failed:', e);
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

let upgradeGroupCall = () => {
    $.post('system/action/action_group_call.php', {
        upgrade_group_call: appcall,
    }, function (response) {
        if (response.code != 0) {
			closeCall(response.code);
        }
    }, 'json');
};

const camPermission = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    if (!devices.some(d => d.kind === 'videoinput')) return false;
    const s = await navigator.mediaDevices.getUserMedia({ video: true });
    s.getTracks().forEach(t => t.stop());
    return true;
  } catch { return false; }
};

const micPermission = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    if (!devices.some(d => d.kind === 'audioinput')) return false;
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    s.getTracks().forEach(t => t.stop());
    return true;
  } catch { return false; }
};

let startStream = async () => { await joinStreams(); };

let callBan = (id) => {
  $.ajax({
    url: 'system/action/action_group_call.php',
    type: 'post',
    dataType: 'json',
    data: { call_ban: id, call_id: appcall },
    success: function (response) {
      if (response && response.code === 1) {
        const $tile = $(`#video-wrapper-${id}`);
        const wasSpotlight = $tile.hasClass('spotlight');
        if (remoteUsers) delete remoteUsers[id];
        removeContainer(id);
        if (wasSpotlight) {
		  $('.vcall_tile.spotlight').removeClass('spotlight');
          $('#vcall_group_streams').removeClass('spotlight-active');
          $('body').removeClass('no-scroll');
        }
		removeContainer(id);
		requestAnimationFrame(updateGridLayout);
      }
    },
    error: function (xhr) {
      console.log('ajax error', xhr.responseText);
    }
  });
};

$(document).ready(function () {
  $.ajaxSetup({ data: { token: utk, cp: curPage } });
  startStream();
  window.callGroupUpgrade = setInterval(upgradeGroupCall, 10000);
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
          <div onclick="callBan(${id});" class="callactban${id} bcell_mid call_action">
            <i class="fa fa-ban"></i>
          </div>` : ''}
      </div>
    </div>
  `;
};
