(async () => {
    const scriptIdentity = "Youtube/PlaylistPlayer";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    utils.notifyLoaded(scriptIdentity);
    
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message === "IDENTITY_REQUEST") {
            await sendResponse("PlaylistPlayer");
        } 
    });
})();

