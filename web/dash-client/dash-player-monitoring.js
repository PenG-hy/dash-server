function initPlayer(videoId) {
    var video,
        player,
        // url = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
        // url = "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd";
        url = "videos/" + videoId + "/manifest.mpd";

    video = document.querySelector("video");
    player = dashjs.MediaPlayer().create();

    //////////////////////////////////////
    // add custom abr rule
    //////////////////////////////////////
    // don't use dash.js default rules
    player.useDefaultABRRules(false);

    // add my custom quality switch rule. Look at LowestBitrateRule.js to know more
    // about the structure of a custom rule
    player.addABRCustomRule('qualitySwitchRules', 'LowestBitrateRule', LowestBitrateRule);
    // end customer abr rule
    
    player.initialize(video, url, true);
    player.getDebug().setLogToBrowserConsole(false);
    player.on(dashjs.MediaPlayer.events["PLAYBACK_ENDED"], function() {
        clearInterval(eventPoller);
        clearInterval(bitrateCalculator);
    });

    // player.on(dashjs.MediaPlayer.events["BUFFER_LEVEL_STATE_CHANGED"], showEvent);

    var eventPoller = setInterval(function() {
        var streamInfo = player.getActiveStream().getStreamInfo();
        var metrics = player.getMetricsFor('video');
        var dashMetrics = player.getDashMetrics();

        if (metrics && dashMetrics && streamInfo) {
            const periodIdx = streamInfo.index;
            var repSwitch = dashMetrics.getCurrentRepresentationSwitch(metrics);
            var bufferLevel = dashMetrics.getCurrentBufferLevel(metrics);
            var bitrate = repSwitch ? Math.round(dashMetrics.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000) : NaN;
            document.getElementById('bufferLevel').innerText = bufferLevel + " secs";
            document.getElementById('reportedBitrate').innerText = bitrate + " Kbps";
        }
    }, 1000);

    
    if (video.webkitVideoDecodedByteCount !== undefined) {
        var lastDecodedByteCount = 0;
        const bitrateInterval = 5;
        var bitrateCalculator = setInterval(function() {
            var calculatedBitrate = (((video.webkitVideoDecodedByteCount - lastDecodedByteCount) / 1000) * 8) / bitrateInterval;
            document.getElementById('calculatedBitrate').innerText = Math.round(calculatedBitrate) + " Kbps";
            lastDecodedByteCount = video.webkitVideoDecodedByteCount;
        }, bitrateInterval * 1000);
    } else {
        document.getElementById('chrome-only').style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var videoId = location.search.split('video_id=')[1]
    console.log("found videoId: " + videoId)
    initPlayer(videoId)
});
