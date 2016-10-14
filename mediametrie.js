// variable for JSON tracking configuration
var confStreamTagModeStandard = {
    serial: 241041208720,
    measure: "streaming",
    levels: {
        level_1: "Documentaire",
        level_2: "Animalier",
    },
    streaming: {
        diffusion: "replay",
        playerObj: "",
        callbackPosition: getPos,
        playerName: "jwplayer",
        playerVersion: "7.7",
        streamGenre: "entertainment"
    }
};

// variable for beacon object
var streamingTagModeStandard;

// The API will call this function when the video player is ready
var eS 		= document.createElement('script');
eS.type 	= 'text/javascript';
eS.async 	= true;
eS.src 		= 'https://prof.estat.com/js/mu-integration-5.2.2.js';
var s		= document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(eS, s);
// eSloaded method is called when the Mediametrie library is loaded
if(eS.addEventListener) { // for all browsers except old IEs (< 9)
    eS.addEventListener('load', function(){
        eSloaded();
    }, false)
} else { // for old IEs only
    eS.onreadystatechange = function () {
        if (eS.readyState in {complete: 1, loaded: 1}) {
            eSloaded();
            }
    };
}
eSloaded = function() {
    streamingTagModeStandard        = new eStatTag(confStreamTagModeStandard)
};


// Callback called by the beacon to get the player position
function getPos() {
    if(jwplayer()) {
        return  Math.round(jwplayer().getPosition());
    }
    return 0;
}

// The jwplayer API will call this function when the video player is ready.
jwplayer().onReady(function(e) {
    // Set some data which are now available
    console.log("JW PLayer Loaded");
    setDuree();
    setPlayerObj();
    setName();
    setUrl();

    // Use jwplayer API to listen player event and notify beacon
    jwplayer().onPlay(function(e) {
        // Hack to avoid duration to -1 when the player is not completly set
        if(Math.round(jwplayer().getDuration())==-1) {
            window.setTimeout(setDuree, 1000);
        }
        streamingTagModeStandard.notifyPlayer("play");
    });

    jwplayer().onPause(function(e){
        streamingTagModeStandard.notifyPlayer("pause");
        console.log("pause");
    });

    jwplayer().onComplete(function(e){
        streamingTagModeStandard.notifyPlayer("stop");
        console.log("stop");
    });

    jwplayer().onSeek(function(e){
        console.log("seeking from " + Math.round(e.position)+" to "+Math.round(e.offset));
        streamingTagModeStandard.notifyPlayer("pause", Math.round(e.position));
        streamingTagModeStandard.notifyPlayer("play", Math.round(e.offset));
    });
});

// custome function to set data
setDuree = function() {
    maDuree = Math.round(jwplayer().getDuration());
    streamingTagModeStandard.set({streaming:{streamDuration:maDuree}});
}

setPlayerObj = function() {
    streamingTagModeStandard.set({streaming:{playerObj:jwplayer()}});
}

setName = function() {
    name=jwplayer().getPlaylistItem().title;
    streamingTagModeStandard.set({streaming:{streamName:name}});
}

setUrl = function() {
    url=jwplayer().getPlaylistItem().file;
    streamingTagModeStandard.set({streaming:{streamURL:url}});
}
