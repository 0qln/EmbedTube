export async function manage(document, window) {
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    const playlist = await import(chrome.runtime.getURL('playlist.js'));
    const settings = await import(chrome.runtime.getURL('settings.js'));
    const scriptIdentity = { Platform: types.Platform.Youtube, Content: types.Content.Playlist };
    utils.notifyLoaded(scriptIdentity);
    
    if (await settings.getSettingsOption("playlist-prefetching") === true) {
        playlist.startPrefetching(utils.extractPlaylistID(document.location.href));
    } 
}

export async function fetchVideoIDs(document, window) {
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const playlist = await import(chrome.runtime.getURL('playlist.js'));

    
    // create playlist
    const playlistID = utils.extractPlaylistID(document.location.href);
    await playlist.addPlaylist(playlistID);
    
    // get whole playlist, not just the videos that are currently loaded
    let videos;
    while (!fetchRecomendedVideos(document) || fetchRecomendedVideos(document).length === 0) {
        // scroll down, append
        window.scrollBy(0, 100000);
        await chrome.runtime.sendMessage({ command:"MISC", comment:"WIGGLE_WINDOW" });
        videos = fetchVideos(document);
        await new Promise(r => setTimeout(r, 2000));
    }
    //window.scrollTo(0,0);
    
    // dumping into playlist
    console.log(videos);
    for (var i = 0; i < videos.length; i++) {
        let videoElement = videos[i];
        let video = videoElement.children[1].children[0].children[0].children[0];
        let videoId = utils.extractVideoID(video.href);
        await playlist.addVideo(playlistID, videoId);
    }

    window.close();
}

export async function getVideoIDs(document, window) {
    const utils = await import(chrome.runtime.getURL('utils.js'));

    let videos;

    // wait to load
    while (!videos || videos.length === 0) {
        videos = fetchVideos(document);
        await new Promise(r => setTimeout(r, 100));
    }

    /*  This seems to be unequal to the videos that will get shown on the website by youtube,
        so we will just fetch all the videos youtube decides to show us. */
    // let videoCount = parseInt(document.getElementsByClassName('byline-item style-scope ytd-playlist-byline-renderer')[0].children[0].textContent);
    // console.log(videos.length + " / " + videoCount);


    // get whole playlist, not just the videos that are loaded
    while (!fetchRecomendedVideos(document) || fetchRecomendedVideos(document).length === 0) {
        // scroll down, append
        window.scrollBy(0, 100000);
        videos = fetchVideos(document);
        await new Promise(r => setTimeout(r, 100)); // wait for elements to load
    }
    
    // debugging
    console.log(videos.length);
    for (var i = 0; i < videos.length; i++) {
        let videoElement = videos[i];
        let video = videoElement.children[1].children[0].children[0].children[0];
        let videoId = utils.extractVideoID(video.href);
        console.log(videoId);
    }

    // return the video ids of the playlist
    return videos.map(video => {
        let link = video.children[1].children[0].children[0].children[0];
        let videoId = utils.extractVideoID(link.href);
        return videoId;
    });
}

function fetchVideos(document) {
    return intersectHtmlColl( 
        document.getElementsByTagName('YTD-PLAYLIST-VIDEO-RENDERER'),
        document.getElementsByClassName('style-scope ytd-playlist-video-list-renderer')
    );
}

function fetchRecomendedVideos(document) {
    return intersectHtmlColl(
        document.getElementsByTagName('YTD-PLAYLIST-VIDEO-RENDERER'),
        document.getElementsByClassName('style-scope ytd-item-section-renderer')
    );
}

function intersectLists(list1, list2) {
    return list1.filter(element => list2.includes(element));
}

function intersectHtmlColl(collection1, collection2) {
    return intersectLists(
        Array.from(collection1),
        Array.from(collection2)
    );
}