
// the playlist is a queue, stored in local storage

// implementation via the enumerator pattern

// TODO: store a playlists videos, once evaluated



// load all the video ids of the playlist into the queue
export async function loadPlaylist(playlistID) {
    let videos = []; //TODO

    chrome.runtime.sendMessage(
        { command:"REQUEST", comment:"VIDEO_IDS", playlistID:playlistID }
        // handle response
    );

    await chrome.storage.local.set({ "cache_playlist":videos });
    await chrome.storage.local.set({ "cache_playlistIndex":0 });
}

// clear the stash
export async function clear() {
    await chrome.storage.local.set({ "cache_playlist":[] });
    await chrome.storage.local.set({ "cache_playlistIndex":0 });
}

// increase index and return the video at index
export async function getNextVideo() {
    let currIdx = await getCurrentIndex();
    await chrome.storage.local.set({ "cache_playlistIndex": currIdx+1 });
    return await getVideo();
}

// decrease index and return the video at index
export async function getPrevVideo() {
    let currIdx = await getCurrentIndex();
    // we don't just go `getVideo(currIdx-1)`, because the index has to be updated anyway
    await chrome.storage.local.set({ "cache_playlistIndex": currIdx-1 });
    return await getVideo();
}

export async function getVideo(index) {
    let output;
    if (index) { 
        // return the videoId at `index`
        await chrome.storage.local.get(["cache_playlist"], result => {
            output = result.cache_playlist[index];
        });
    } 
    else { // no index given
        // return the videoId at `getCurrentIndex`
        await chrome.storage.local.get(["cache_playlist"], async result => {
            output = result.cache_playlist[await getCurrentIndex()];
        });
    }
    return output;
}

export async function getCurrentIndex() {
    let output = -1;
    await chrome.storage.local.get(["cache_playlistIndex"], result => {
        output = result.cache_playlistIndex;
    });
    return output;
}