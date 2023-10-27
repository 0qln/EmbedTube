(async () => {
    const scriptIdentity = "YoutubeMusic/PlaylistPlayer";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    utils.notifyLoaded(scriptIdentity);
})();
