export async function manage(document) {
    // imports
    const utils = await import(chrome.runtime.getURL('utils.js'));
    const types = await import(chrome.runtime.getURL('types.js'));
    const settings = await import(chrome.runtime.getURL('settings.js'));

    // vars
    let output = "";

    // main
    document.addEventListener("click", async function(event) {
        // open in youtube
        if (event.target.classList.value === "ytp-youtube-button ytp-button yt-uix-sessionlink") {
            utils.MANAGE_ME("OPEN_IN_YT", types.Content.Embed, types.Platform.Youtube, document.location.href);
        }
    });

    if (isPlayable(document) === false) {
        output = "NOT_PLAYABLE";
    }
    
    if (await settings.getSettingsOption("autoplay") === true) {
        await autoPlay(document);    
    }

    return output;
}

function isPlayable(document) {        
    // check wether an error popped up on the site, suggesting that this video
    // is not playable by an embed player
    return document.getElementsByClassName('ytp-error').length === 0;
}   

// testing required
function hasStarted(document) {
    const elements = document.getElementsByClassName('ytp-upnext ytp-player-content ytp-upnext-autoplay-paused');
    return elements.length !== 0;
}

// testing required
async function autoPlay(document, maxTries = 20) {
    const [startButton] = document.getElementsByClassName("ytp-large-play-button ytp-button ytp-large-play-button-red-bg");
    while (hasStarted(document) === false && --maxTries > 0) {
        startButton.click();
        await new Promise(r => setTimeout(r, 100));
    }
    console.log("Auto play success: " + maxTries === 0);
}