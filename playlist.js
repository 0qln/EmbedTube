
// the playlist is a queue, stored in local storage

// implementation via the enumerator pattern


export async function loadPlaylist(playlistID) {
    // load all the video ids of the playlist into the queue
    let videos = []; //TODO
    await chrome.storage.local.set({ "cache_playlist":videos });
    await chrome.storage.local.set({ "cache_playlistIndex":0 });
}

export async function clear() {
    // clear the stash
}

export async function getNextVideo() {
    // increase index and return the video at index
    
}

export async function getPrevVideo() {
    // decrease index and return the video at index
}

export async function getVideo(index) {
    // return the videoId at `index`

}
