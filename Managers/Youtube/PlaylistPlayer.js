export async function manage(document) {
    const types = await import(chrome.runtime.getURL('types.js'));
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const scriptIdentity = { Platform: types.Platform.Youtube, Content: types.Content.PlaylistPlayer };
    

    utils.notifyLoaded(scriptIdentity);
}

