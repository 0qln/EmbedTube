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
        
        chrome.runtime.sendMessage( { command:"MANAGE_ME", platform:platform, content:content } );
        
        /*
            testing a different method: 
            replace normal video player with the embed play 
            on the original site.
            would make other features, like playing a  playlist
            easy to implement.
        */
        return;
        // if (content === types.Content.Video) {
      
        //     await new Promise(r => setTimeout(r, 4000));

        //     //chrome.tabCapture.getMediaStreamId();
              
        //     let videoContainer;
        //     // aquire container
        //     console.log('start aquire');
        //     while (!videoContainer) {
        //         try {            
        //             videoContainer = document.getElementById('player');
        //         }
        //         catch {
        //             await new Promise(r => setTimeout(r, 10));
        //         }
        //     }
        //     console.log('aquired');
        //     // remove container
        //     while (videoContainer.firstChild) {
        //         try {            
        //             videoContainer.removeChild(videoContainer.firstChild);
        //         }
        //         catch {
        //             await new Promise(r => setTimeout(r, 10));
        //         }
        //     }
        //     console.log('removed');
    
        //     return;
        // }  
        
        // await new Promise(r => setTimeout(r, 4000));
        // if (platform === types.Platform.Youtube && content === types.Content.Video) {

            
        //     function togglePlay() {
        //         let button = document.getElementsByClassName('ytp-play-button ytp-button')[0];
        //         button.click();
        //     }
        //     function isPlaying() {
        //         const player = document.querySelector('div[aria-label="YouTube-Videoplayer"]');
        //         if (!player) {
        //             return false;
        //         }
        //         console.log(player.classList);
        //         return player.classList.contains('playing-mode') && !player.classList.contains('unstarted-mode');
        //     }

            

        //     const iframe = document.createElement('iframe');
        //     // iframe.setAttribute('width', '560');
        //     // iframe.setAttribute('height', '315');
        //     iframe.setAttribute('src', 'https://www.youtube-nocookie.com/embed/' + utils.extractVideoID(url));
        //     iframe.setAttribute('title', 'YouTube video player');
        //     iframe.setAttribute('frameborder', '0');
        //     iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        //     iframe.setAttribute('allowfullscreen', '');

        //     console.log('append child');
        //     videoContainer.appendChild(iframe);
        // }
    }
    
    chrome.runtime.onMessage.addListener(message => {
        if (message.command === "FORCE_UPDATE_URL") {
            update();
        }
    });
    
    utils.notifyLoaded(scriptIdentity);
    update();
})();
