// main
(async () => {
    const scriptIdentity = "Embed/Video";
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    const settings = await import(chrome.runtime.getURL('settings.js'));
    utils.notifyLoaded(scriptIdentity);

    let startedPlay = false;    
    const openInYoutubeBtn = "ytp-youtube-button ytp-button yt-uix-sessionlink";
    const startPlayBtn = "ytp-large-play-button ytp-button ytp-large-play-button-red-bg";

    

    document.addEventListener("click", async function(event) {

        // open in youtube
        if (event.target.classList.value === openInYoutubeBtn) {
            utils.MANAGE_ME("OPEN_IN_YT", types.Content.Embed, types.Platform.Youtube, this.location.href);
        }

        // remember when the video has started playing
        if (event.target.classList.value === startPlayBtn) {
            startedPlay = true;        
        }
    });


    // initiate tab-update awareness
    chrome.runtime.onMessage.addListener(message => {
        if (message.command === "FORCE_UPDATE_URL") {
            update();
        }
    });

    update();

    if (await settings.getSettingsOption("autoplay") === true) {
        await autoPlay();    
    }


    // functions
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
    
    async function autoPlay() {
        const [startButton] = document.getElementsByClassName("ytp-large-play-button ytp-button ytp-large-play-button-red-bg");
        while (startedPlay === false) {
            startButton.click();
            await new Promise(r => setTimeout(r, 100));
        }
    }
})();


