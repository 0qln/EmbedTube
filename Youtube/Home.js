(async () => {
    const scriptIdentity = "Youtube/Home";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    utils.notifyLoaded(scriptIdentity);
    
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message === "IDENTITY_REQUEST") {
            await sendResponse("Home");
        } 
    });    
})();

