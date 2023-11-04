export async function manage(document) {
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    const playlist = await import(chrome.runtime.getURL('playlist.js'));
    const scriptIdentity = { Platform: types.Platform.Youtube, Content: types.Content.PlaylistPlayer };
    utils.notifyLoaded(scriptIdentity);
    

    // start fetching the playlist
    playlist.startPrefetching(utils.extractPlaylistID(document.location.href));
}