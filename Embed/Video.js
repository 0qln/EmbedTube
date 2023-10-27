(async () => {
    const scriptIdentity = "Embed/Video";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    utils.notifyLoaded(scriptIdentity);
})();
