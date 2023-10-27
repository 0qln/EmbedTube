(async () => {
    const scriptIdentity = "YoutubeMusic/Playlist";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    utils.notifyLoaded(scriptIdentity);
})();
