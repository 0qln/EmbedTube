(async () => {
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    const scriptIdentity = { Platform: types.Platform.Music, Content: types.Content.PlaylistPlayer };

    
    utils.notifyLoaded(scriptIdentity);
})();
