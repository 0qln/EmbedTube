export async function manage(document) {
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    const playlist = await import(chrome.runtime.getURL('playlist.js'));
    const settings = await import(chrome.runtime.getURL('settings.js'));
    const scriptIdentity = { Platform: types.Platform.Youtube, Content: types.Content.PlaylistPlayer };
    utils.notifyLoaded(scriptIdentity);
    

    // start fetching the playlist
    console.log(settings.getSettingsOption("playlist-fetching"));
    if (await settings.getSettingsOption("playlist-fetching") === true) {
        playlist.startPrefetching(utils.extractPlaylistID(document.location.href));
    }
} 