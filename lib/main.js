
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
    , colors = {
        '#899DF0': false,
        '#EDF375': false,
        '#698A15': false,
        '#6FC0F2': false,
        '#F26FF2': false
    }

    addTextToChat = function(id, screenName, text) {
        $('#chatText').append(
            '<div><label class="screenNameLabel" style="text-color:'
            + getUserColor(id) +'">' + screenName + '</label>: '
            + text +'</div>');
    }

    , getUserColor = function (user) {
        for (var prop in colors) {
            if (colors[prop] === false) {
                colors[prop] = user;
                return prop;
            }
        }
    }

    , releaseUserColor = function (user) {
        colors[prop] = false;
    }

    , sendScreenName = function (peer, name) {
        peer.getDataChannel('mySuperChannel');
        setTimeout(function(){
            webrtc.sendDirectlyToAll('mySuperChannel','setDisplayName', name);
        }, 3000);
    }

    ,setButtonsListeners = function() {

    };

webrtc.on('readyToCall', function () {
    webrtc.joinRoom(room_id);
    $('#title').html(room_name + ' - ' + user_name);
    $('#allowHelper').html('');

    $('#version').load("/version");
    $('#myScreenName').html(user_name);
    $('#myScreenName').css('color', getUserColor('myself'));

    // button to toggle video
    var videoBt = $('#video_button');
    videoBt.onclick = function() {
        var state = videoBt.className;
        if (state === 'on') {
            webrtc.pauseVideo();
            videoBt.src = 'images/video_off.png';
            videoBt.className = 'off';
        } else {
            webrtc.resumeVideo();
            videoBt.src = 'images/video_on.png';
            videoBt.className = 'on';
        }
    }

    // button to toggle Audio
    var audioBt = document.getElementById("audio_button");

    audioBt.onclick = function() {
        var state = audioBt.className;
        if (state === 'on') {
            webrtc.mute();
            audioBt.src = 'images/audio_off.png';
            audioBt.className = 'off';
        } else {
            webrtc.unmute();
            audioBt.src = 'images/audio_on.png';
            audioBt.className = 'on';
        }
    }

    $('#inputText').keypress(function( event ) {
        if ( event.which === 13  && $('#inputText').val() !== '' ) {
            webrtc.sendDirectlyToAll('mySuperChannel','userMessage',
                {
                    'text': $('#inputText').val(),
                    'screenName': user_name
            });
            addTextToChat('myself', user_name, $('#inputText').val());
            $('#inputText').val('');
        }
        console.log(event.which);
    });
});

webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type == 'volume') {
        showVolume(document.getElementById('volume_' + peer.id), data.volume);
    }
});

webrtc.on('mute', function (peer) {
    var elem = document.getElementById('container_' + peer.id + '_video_incoming'),
        d = document.createElement('div');

    d.className = 'peer_muted_' + peer.name;
    d.id = peer.id + '_'+ d.className ;

    elem.appendChild(d);
});

webrtc.on('unmute', function (peer) {
    document.getElementById(peer.id + '_peer_muted_' + peer.name).remove();
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

        var user = document.createElement('div'),
            userColor = getUserColor(peer.id);
        user.id = 'screenName_' + peer.id;
        user.className = 'screenName';
        user.style.color = userColor;

        d.appendChild(vol);
        d.appendChild(user);
        remotes.appendChild(d);
        console.log("Added " + userColor);
    }

    sendScreenName(peer, user_name);
});

webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type == 'setDisplayName') {
        $('#' + 'screenName_' + peer.id).html(data.payload);
        console.log('Received displayName ' + data.payload + ' from peer ' + peer.id);
    }
    else if (data.type == 'userMessage') {
        addTextToChat(peer.id, data.payload.screenName, data.payload.text);
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


