
var webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo',
        remoteVideosEl: 'remoteVideo',
        autoRequestMedia: true
    })
    , parameters = getSearchParameters()
    , room_id    = parameters.room_id || parameters.room_name || "FronterWebRTC Room"
    , room_name  = parameters.room_name || "Fronter WebRTC Room"
    , user_name  = parameters.user_name || "C-3PO"
    ;

webrtc.on('readyToCall', function () {
    webrtc.joinRoom('room_id');
    document.getElementById('title').innerHTML = room_name + ' - ' + user_name;
});
