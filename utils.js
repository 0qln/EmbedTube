

export async function notifyLoaded(name) {    
    const loadedMessage =  "CONTENT_SCRIPT_LOADED " + name;
    chrome.runtime.sendMessage(loadedMessage);
    console.log(loadedMessage);
}

export function isAnyYT(url) {
    const regex = /.youtube.com\//gm;
    return regex.test(url);    
}

export function isYT(url) {
    const regex = /www.youtube.com\//gm;
    return regex.test(url);
}
export function isMusic(url) {
    const regex = /music.youtube.com\//gm;
    return regex.test(url);
}

export function isVideo(url) {
    const regex = /\/watch/gm;
    return regex.test(url);
}
export function isEmbed(url) {
    const regex = /\/embed/gm;
    return regex.test(url);
}
export function isPlaylist(url) {
    const regex = /\/playlist/gm;
    return regex.test(url);
}
export function isPlaylistPlayer(url) {
    const regex = /&list=/gm;
    return regex.test(url);
}

export function hasPlaylistID(url) {
    return !!extractPlaylistID(url);
}
export function hasVideoID(url) {
    return !!extractVideoID(url);
}
export function extractPlaylistID(url) {
    const regex = /(?:list=)(?<playlistID>[A-Za-z0-9_-]*)/gm;
    const result = regex.exec(url);
    return !result || result.length <= 1 ? null : result[1];
}
export function extractVideoID(url) {
    const regex = /(?:\?v=|embed\/)(?<videoID>[A-Za-z0-9_-]*)/gm;
    const result = regex.exec(url);
    return !result || result.length <= 1 ? null : result[1];
}


export function createEmbedURL(videoID) {
    return "https://www.youtube.com/embed/" + videoID;
}

// Get the current active tab in the lastly focused window
export async function getCurrentTab() {
    let [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    console.assert(tab);
    return tab;
}