(async () => {
    const scriptIdentity = "AllContent";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    utils.notifyLoaded(scriptIdentity);
    
    var platform, content, url;

    
    // chrome.runtime.onMessage.addListener(
    //     async message => {
    //         if (message.command === "REQUEST") {                
    //             console.log('received some request in content script');                
    //             switch (message.comment) {
    //                 case "VIDEO_IDS":                        
    //                     console.log('received VIDEO_IDS request in content script');
    //                     if (content !== types.Content.Playlist) {
    //                         console.log("Error: Video IDs were requested from a tab that containes no playlist!");
    //                         break;
    //                     }

    //                     // aquire video ids
    //                     const managerScript = `Managers/${platform}/${content}.js`;
    //                     const manager = await import(chrome.runtime.getURL(managerScript));
    //                     const videoIDs = await manager.getVideoIDs(document, window); 

    //                     // send the video ids back
    //                     chrome.runtime.sendMessage({ command: "REQUST_RESPONSE", comment:message.comment, value:videoIDs });
    //                     break;
                    
    //                 default:
    //                     break;
    //                 }
    //         }
    //     }
    // );

    chrome.runtime.onMessage.addListener(
        async message => {
            if (message.command === "MISC") {                
                switch (message.comment) {
                    case "DUMP_VIDEO_IDS":
                        // tell tab to start fetching
                        const managerScript = `Managers/${platform}/${content}.js`;
                        const manager = await import(chrome.runtime.getURL(managerScript));
                        manager.fetchVideoIDs(document, window); 
                        break;
                
                    default:
                        break;
                }
            }
        }
    )


    chrome.runtime.onMessage.addListener(
        async message => {
            if (message.command === "FORCE_UPDATE_URL") {
                await update();
                await newSite();
            }
        }
    );         
    await update();
    await newSite();

    async function newSite() {        
        console.log("`newSite`");

        var managerScript = `Managers/${platform}/${content}.js`;
        var manager = await import(chrome.runtime.getURL(managerScript));
        
        var comment = await manager.manage(document, window);
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
