(async () => {
    const scriptIdentity = "AllContent";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    
    
    var platform, content, url;

    async function update() {
        url = location.href;

        content = utils.isVideo(url) ? types.Content.Video
                : utils.isPlaylist(url) ? types.Content.Playlist
                : utils.isEmbed(url) ? types.Content.Embed
                : utils.isPlaylistPlayer(url) ? types.Content.PlaylistPlayer
                : types.Content.Other;

        platform = utils.isYT(url) ? types.Platform.Youtube
                 : utils.isMusic(url) ? types.Platform.Music
                 : types.Platform.Other;
        
        let comment = content === types.Content.Video ? "GO_EMBED" : "";
        
        utils.MANAGE_ME(comment, content, platform, url);
    }
    
    chrome.runtime.onMessage.addListener(message => {
        if (message.command === "FORCE_UPDATE_URL") {
            update();
        }
    });
    
    utils.notifyLoaded(scriptIdentity);
    update();
})();
