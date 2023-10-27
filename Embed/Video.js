(async () => {
    const scriptIdentity = "Embed/Video";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    utils.notifyLoaded(scriptIdentity);
    

    function update() {
        if (isPlayable() === false) {
            utils.MANAGE_ME("NOT_PLAYABLE", types.Content.Embed, types.Platform.Youtube, this.location.href);
        }
        else {
            utils.MANAGE_ME("", types.Content.Embed, types.Platform.Youtube, this.location.href);
        }
    }

    function isPlayable() {        
        // check wether an error popped up on the site, suggesting that this video
        // is not playable by an embed player
        return document.getElementsByClassName('ytp-error').length === 0;
    }

    document.addEventListener("click", async function(event) {
        // open in youtube
        let openInYoutubeBtn = "ytp-youtube-button ytp-button yt-uix-sessionlink";
        if (event.target.classList.value === openInYoutubeBtn) {
            utils.MANAGE_ME("OPEN_IN_YT", types.Content.Embed, types.Platform.Youtube, this.location.href);
        }
    });

    chrome.runtime.onMessage.addListener(message => {
        if (message.command === "FORCE_UPDATE_URL") {
            update();
        }
    });

    update();
})();

