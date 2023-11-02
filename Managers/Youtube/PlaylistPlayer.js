export async function manage(document) {
    const types = await import(chrome.runtime.getURL('types.js'));
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const playlist = await import(chrome.runtime.getURL('playlist.js'));
    const scriptIdentity = { Platform: types.Platform.Youtube, Content: types.Content.PlaylistPlayer };
    

    await playlist.loadPlaylist("PLlfOcCY7-RxxAGKtjCtiv4vZs_DnlVvNZ");


    utils.notifyLoaded(scriptIdentity);
}