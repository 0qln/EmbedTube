(async () => {
    const scriptIdentity = "AllContent";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    
    var platform, content, url;

    
    chrome.runtime.onMessage.addListener(
        async ({command}) => command === "FORCE_UPDATE_URL" 
        && await update() 
        && await newSite());         

    await update(); 
    await newSite();
    utils.notifyLoaded(scriptIdentity);


    async function newSite() {        
        var managerScript = `Managers/${platform}/${content}.js`;
        var manager = await import(chrome.runtime.getURL(managerScript));
        
        var comment = await manager.manage(document);
        console.log(comment);
        utils.MANAGE_ME(comment, content, platform, url);
        
        return true;
    }
    
    async function update() {
        url = location.href;

        // Order of operations is important here:
        // First check if it is a playlist player, because `isVideo` also
        // evaluates to true of a playlist player (not a bug).
        content = utils.isPlaylistPlayer(url) ? types.Content.PlaylistPlayer
                : utils.isVideo(url) ? types.Content.Video
                : utils.isPlaylist(url) ? types.Content.Playlist
                : utils.isEmbed(url) ? types.Content.Embed
                : types.Content.Other;

        platform= utils.isYT(url) ? types.Platform.Youtube
                : utils.isMusic(url) ? types.Platform.Music
                : types.Platform.Other;        

        return true;
    }
})();
