
// the playlist is a queue, stored in local storage

// implementation via the enumerator pattern

// TODO: store a playlists videos, once evaluated


export async function initPlaylistStorage() {
    await chrome.storage.local.set({ "PLAYLISTS":{} });
    await chrome.storage.local.set({ "cache_playlistIndex":0 });
}

// endpoint is undefined
export async function startPrefetching(playlistID) {
    chrome.runtime.sendMessage({ 
        command:"MISC", 
        comment:"DUMP_VIDEO_IDS", 
        playlistID:playlistID 
    });
}

export async function addPlaylist(playlistID) {
    console.log(playlistID);

    // Retrieve the current playlists from storage
    const result = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["PLAYLISTS"], result => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });

    // Create the playlist if it does not exist yet
    if (!result.PLAYLISTS[playlistID]) {
        result.PLAYLISTS[playlistID] = [];
        console.log('create ' + playlistID);
    } else {
        console.log('playlist ' + playlistID + ' already exists');
    }

    // Push the result pack into storage
    await new Promise((resolve, reject) => {
        chrome.storage.local.set({ "PLAYLISTS": result.PLAYLISTS }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

export async function addVideo(playlistID, videoID) {
    // retrieve the current playlists from the storage
    const result = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["PLAYLISTS"], result => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });

    // add the video if not already present
    if (!result.PLAYLISTS[playlistID].includes(videoID)) {
        result.PLAYLISTS[playlistID].push(videoID);
        console.log('push ' + videoID);
    } else {
        console.log('dont push ' + videoID);
    }

    // push the result pack into the storage
    await new Promise((resolve, reject) => {
        chrome.storage.local.set({ "PLAYLISTS": result.PLAYLISTS }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

// load all the video ids of the playlist into the queue
export async function loadPlaylist(playlistID) {
    // console.log('`loadPlaylist` called');
    
    // // request videos
    // let videos; 
    // chrome.runtime.sendMessage({ 
    //         command:"REQUEST", 
    //         comment:"VIDEO_IDS", 
    //         playlistID:playlistID 
    //     },
    //     async function(videoIDs) {
    //         videos = videoIDs;
    //         console.log('response in `loadPlaylist`');
    //     }
    // );

    // // set videos
    // await chrome.storage.local.set({ "cache_playlist":videos });
    // await chrome.storage.local.set({ "cache_playlistIndex":0 });
    
    // console.log('`loadPlaylist` done');
}

// clear the stash
export async function clear(playlistID) {
    if (playlistID) {
        await chrome.storage.local.get(["PLAYLISTS"], async result => {
            result.PLAYLISTS[playlistID] = [ ];
            await chrome.storage.local.set({ "PLAYLISTS": result.PLAYLISTS });
        });
    }
    else {
        await chrome.storage.local.set({ "PLAYLISTS":[] });
        await chrome.storage.local.set({ "cache_playlistIndex":0 });
    }
}

// returns after incrementing
// increase index and return the video at index
export async function getNextVideo() {
    let currIdx = await getCurrentIndex();
    await chrome.storage.local.set({ "cache_playlistIndex": currIdx+1 });
    return await getVideo();
}

// returns after incrementing
// decrease index and return the video at index
export async function getPrevVideo() {
    let currIdx = await getCurrentIndex();
    // we don't just go `getVideo(currIdx-1)`, because the index has to be updated anyway
    await chrome.storage.local.set({ "cache_playlistIndex": currIdx-1 });
    return await getVideo();
}

export async function getVideo(playlistID, index) {
    let output;
    if (index) { 
        // return the videoId at `index`
        await chrome.storage.local.get(["PLAYLISTS"], result => {
            output = result.PLAYLISTS[playlistID][index];
        });
    } 
    else { // no index given
        // return the videoId at `getCurrentIndex`
        await chrome.storage.local.get(["PLAYLISTS"], async result => {
            output = result.PLAYLISTS[playlistID][await getCurrentIndex()];
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