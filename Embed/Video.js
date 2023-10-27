(async () => {
    const scriptIdentity = "Embed/Video";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    utils.notifyLoaded(scriptIdentity);

    var playable, url;

    function update() {
        url = location.href;

        // check wether an error popped up on the site, suggesting that this video
        // is not playable by an embed player
        playable = document.getElementsByClassName('ytp-error').length === 0;
        chrome.runtime.sendMessage({ 
            command:"MANAGE_ME", 
            platform:types.Platform.Youtube, 
            content:types.Content.Embed, 
            playable:playable 
        });
    }


    chrome.runtime.onMessage.addListener(message => {
        if (message.command === "FORCE_UPDATE_URL") {
            update();
        }
    });

    update();
})();
