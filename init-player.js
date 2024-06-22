// TODO: wrap variables in a closure
let player;
let plugin;

function initApp() {
    console.log("initApp")

    // Check to see if the browser supports the basic APIs Shaka needs.
    // if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer().then(() => console.log("player initialized"));
    // } else {
    //     // This browser does not have the minimum set of APIs we need.
    //     console.error('Browser not supported!');
    // }
}

var getContentId = function(url){
    const regex = /([^\/]+)\/[^\/]+$/;
    const match = url.match(regex);

    if (match && match.length > 1) {
        const extractedValue = match[1];
        return extractedValue;            
    } else {
        alert("Inavlid URL Format!");
    }
}

async function initPlayer() {
    console.log("initPlayer")
    player = new shaka.Player();
    player.addEventListener('error', onErrorEvent);

    plugin = new CarbonVideoPlugin({containerId: 'video-container', videoId: 'video', indicatorId: 'carbon-indicator'});

    const videoUrl = 'https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd';
    const accountId = "0aaaa";        
    const carbonId = getContentId(videoUrl);
    if(carbonId){
        play(videoUrl, accountId, carbonId);
    }
}

function play(url, accountId, videoId) {
    const video = document.getElementById('video');
    player.attach(video);
    plugin.setCarbonAccountId(accountId);
    plugin.setCarbonVideoId(videoId);
    player.load(url);   
}

function onErrorEvent(event) {
    console.error('onErrorEvent', event)
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
}

function onError(error) {
    console.error('onError', error)
    // Log the error.
    console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);