export async function alert(message) {
    // TODO: show a popup, similar to `window.alert`, but that does not pause the scripts
}

export async function notifyLoaded(name) {    
    console.log(name);
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

// checks if this could be a valid video id
export function couldBeVideoID(id) {
    // regex: 64bit Base64 encoded number
    const result = /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/gm.exec(id);
    return !result ? false : result[0] === id;
}
// checks if this could be a valid channel id
export function couldBeChannelID(id) {
    // regex: 128bit Base64 encoded number
    const result = /[0-9A-Za-z_-]{21}[AQgw]/gm.exec(id);
    return !result ? false : result[0] === id;
}

export function extractPlaylistID(url) {
    const regex = /[A-Za-z0-9_-]+(?<=list=[A-Za-z0-9_-]+)/gm;
    const result = regex.exec(url);
    return result ? result[0] : null;
}
export function extractVideoID(url) {
    const regex = /[A-Za-z0-9_-]+(?<=(watch\?v=|embed\/)[A-Za-z0-9_-]+)/gm;
    const result = regex.exec(url);
    return result ? result[0] : null;
}


export function createEmbedURL(videoID) {
    return "https://www.youtube.com/embed/" + videoID;
}
export function createWatchURL(videoID) {
    return "https://www.youtube.com/watch?v=" + videoID;
}
export function createPlaylistURL(playlistID) {
    return "https://www.youtube.com/playlist?list=" + playlistID;
}


// Get the current active tab in the lastly focused window
export async function getCurrentTab() {
    let [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    console.assert(tab); // this fails only while debugging and connection issues
    return tab;
}
// Get the current focued window
export async function getCurrentWindow() {
    let window = await chrome.windows.getCurrent();
    console.assert(window); 
    return window;
}

// using this so the masseges, when printed have a uniform order of properties
export async function MANAGE_ME(comment, content, platform, url) {
    chrome.runtime.sendMessage({ 
        command: "MANAGE_ME", 
        comment: comment,
        content: content,
        platform: platform, 
        url: url
    });
}


export function test_success(testName) {
    console.log('%c '+testName+' SUCCESSFUL', 'color: #00FF00');
}
export function test_fail(testName) {    
    console.log('%c '+testName+' FAILED', 'color: #FF0000');
}