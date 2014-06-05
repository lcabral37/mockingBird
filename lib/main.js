
var webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo',
        remoteVideosEl: '',
        autoRequestMedia: true,
        detectSpeakingEvents: true
    })
    , parameters = getSearchParameters()
    , room_id    = parameters.room_id || parameters.room_name || "FronterWebRTC Room"
    , room_name  = parameters.room_name || "Fronter WebRTC Room"
    , user_name  = parameters.user_name || "C-3PO"
    ;

webrtc.on('readyToCall', function () {
    webrtc.joinRoom(room_id);
    document.getElementById('title').innerHTML = room_name + ' - ' + user_name;
    document.getElementById('allowHelper').innerHTML = '';


    // button to toggle video
    var videoBt = document.getElementById("video_button");
    videoBt.onclick = function() {
        var state = videoBt.className;
        if (state === 'on') {
            webrtc.pauseVideo();
            videoBt.src = 'images/webcam_off.png';
            videoBt.className = 'off';
        } else {
            webrtc.resumeVideo();
            videoBt.src = 'images/webcam_on.png';
            videoBt.className = 'on';
        }
    }


    // button to toggle Audio
    var audioBt = document.getElementById("audio_button");

    audioBt.onclick = function() {
        var state = audioBt.className;
        if (state === 'on') {
            webrtc.mute();
            audioBt.src = 'images/mic_off.png';
            audioBt.className = 'off';
        } else {
            webrtc.unmute();
            audioBt.src = 'images/mic_on.png';
            audioBt.className = 'on';
        }
    }
});

webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type == 'volume') {
        showVolume(document.getElementById('volume_' + peer.id), data.volume);
    }
});

webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    var remotes = document.getElementById('remoteVideo');
    if (remotes) {
        var d = document.createElement('div');
        d.className = 'remoteVideo';
        d.id = 'container_' + webrtc.getDomId(peer);
        d.appendChild(video);
        var vol = document.createElement('div');
        vol.id = 'volume_' + peer.id;
        vol.className = 'volume_bar';
        video.onclick = function () {
            video.style.width = video.videoWidth + 'px';
            video.style.height = video.videoHeight + 'px';
        };
        d.appendChild(vol);
        remotes.appendChild(d);
    }
});

webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementById('remoteVideo');
    var el = document.getElementById('container_' + webrtc.getDomId(peer));
    if (remotes && el) {
        remotes.removeChild(el);
    }
});

webrtc.on('volumeChange', function (volume, treshold) {
    showVolume(document.getElementById('localVolume'), volume);
});

function showVolume(el, volume) {
    if (!el) return;
    if (volume < -45) { // vary between -45 and -20
        el.style.width = '0px';
    } else if (volume > -20) {
        el.style.width = '100%';
    } else {
        el.style.width = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
    }
}

