(async () => {
    const scriptIdentity = "YoutubeMusic/Home";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    utils.notifyLoaded(scriptIdentity);
})();
