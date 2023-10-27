(async () => {
    const scriptIdentity = "YoutubeMusic/Video";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    utils.notifyLoaded(scriptIdentity);
})();
